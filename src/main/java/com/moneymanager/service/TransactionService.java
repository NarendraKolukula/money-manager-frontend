package com.moneymanager.service;

import com.moneymanager.dto.CategorySummaryDTO;
import com.moneymanager.dto.TransactionDTO;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.exception.TransactionNotEditableException;
import com.moneymanager.model.Category;
import com.moneymanager.model.Division;
import com.moneymanager.model.Transaction;
import com.moneymanager.model.TransactionType;
import com.moneymanager.repository.CategoryRepository;
import com.moneymanager.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {
    
    private static final int EDIT_WINDOW_HOURS = 12;
    
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountService accountService;
    
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAllByOrderByDateTimeDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public TransactionDTO getTransactionById(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return toDTO(transaction);
    }
    
    public List<TransactionDTO> getFilteredTransactions(Division division, String category, 
                                                         LocalDateTime startDate, LocalDateTime endDate) {
        List<Transaction> transactions;
        
        if (division != null && category != null && startDate != null && endDate != null) {
            transactions = transactionRepository.findByDivisionAndCategoryAndDateRange(division, category, startDate, endDate);
        } else if (division != null && startDate != null && endDate != null) {
            transactions = transactionRepository.findByDivisionAndDateRange(division, startDate, endDate);
        } else if (category != null && startDate != null && endDate != null) {
            transactions = transactionRepository.findByCategoryAndDateRange(category, startDate, endDate);
        } else if (startDate != null && endDate != null) {
            transactions = transactionRepository.findByDateRange(startDate, endDate);
        } else if (division != null && category != null) {
            transactions = transactionRepository.findByDivisionAndCategory(division, category);
        } else if (division != null) {
            transactions = transactionRepository.findByDivision(division);
        } else if (category != null) {
            transactions = transactionRepository.findByCategory(category);
        } else {
            transactions = transactionRepository.findAllByOrderByDateTimeDesc();
        }
        
        return transactions.stream()
                .sorted((a, b) -> b.getDateTime().compareTo(a.getDateTime()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TransactionDTO createTransaction(TransactionDTO dto) {
        Transaction transaction = Transaction.builder()
                .type(dto.getType())
                .amount(dto.getAmount())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .division(dto.getDivision())
                .accountId(dto.getAccountId())
                .dateTime(dto.getDateTime())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Transaction saved = transactionRepository.save(transaction);
        
        // Update account balance
        double balanceChange = dto.getType() == TransactionType.INCOME ? dto.getAmount() : -dto.getAmount();
        accountService.updateBalance(dto.getAccountId(), balanceChange);
        
        log.info("Created transaction: {} - {} - ${}", saved.getId(), saved.getDescription(), saved.getAmount());
        
        return toDTO(saved);
    }
    
    @Transactional
    public TransactionDTO updateTransaction(String id, TransactionDTO dto) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        
        if (!isEditable(existing)) {
            throw new TransactionNotEditableException("Transaction cannot be edited after 12 hours");
        }
        
        // Revert old balance change
        double oldBalanceChange = existing.getType() == TransactionType.INCOME ? -existing.getAmount() : existing.getAmount();
        accountService.updateBalance(existing.getAccountId(), oldBalanceChange);
        
        // Update transaction
        existing.setType(dto.getType());
        existing.setAmount(dto.getAmount());
        existing.setDescription(dto.getDescription());
        existing.setCategory(dto.getCategory());
        existing.setDivision(dto.getDivision());
        existing.setAccountId(dto.getAccountId());
        existing.setDateTime(dto.getDateTime());
        existing.setUpdatedAt(LocalDateTime.now());
        
        Transaction saved = transactionRepository.save(existing);
        
        // Apply new balance change
        double newBalanceChange = dto.getType() == TransactionType.INCOME ? dto.getAmount() : -dto.getAmount();
        accountService.updateBalance(dto.getAccountId(), newBalanceChange);
        
        log.info("Updated transaction: {}", saved.getId());
        
        return toDTO(saved);
    }
    
    @Transactional
    public void deleteTransaction(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        
        if (!isEditable(transaction)) {
            throw new TransactionNotEditableException("Transaction cannot be deleted after 12 hours");
        }
        
        // Revert balance change
        double balanceChange = transaction.getType() == TransactionType.INCOME ? -transaction.getAmount() : transaction.getAmount();
        accountService.updateBalance(transaction.getAccountId(), balanceChange);
        
        transactionRepository.deleteById(id);
        log.info("Deleted transaction: {}", id);
    }
    
    public Double getTotalIncome(LocalDateTime start, LocalDateTime end) {
        List<Transaction> transactions = start != null && end != null
                ? transactionRepository.findByDateRange(start, end)
                : transactionRepository.findAll();
        
        return transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();
    }
    
    public Double getTotalExpense(LocalDateTime start, LocalDateTime end) {
        List<Transaction> transactions = start != null && end != null
                ? transactionRepository.findByDateRange(start, end)
                : transactionRepository.findAll();
        
        return transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();
    }
    
    public List<CategorySummaryDTO> getCategorySummary(LocalDateTime start, LocalDateTime end) {
        List<Transaction> transactions = start != null && end != null
                ? transactionRepository.findByDateRange(start, end)
                : transactionRepository.findAll();
        
        Map<String, CategorySummaryDTO> summaryMap = new HashMap<>();
        
        for (Transaction t : transactions) {
            String categoryId = t.getCategory();
            Category category = categoryRepository.findById(categoryId).orElse(null);
            
            CategorySummaryDTO existing = summaryMap.get(categoryId);
            if (existing == null) {
                existing = CategorySummaryDTO.builder()
                        .categoryId(categoryId)
                        .categoryName(category != null ? category.getName() : categoryId)
                        .icon(category != null ? category.getIcon() : "Receipt")
                        .type(t.getType())
                        .amount(0.0)
                        .count(0)
                        .build();
            }
            
            existing.setAmount(existing.getAmount() + t.getAmount());
            existing.setCount(existing.getCount() + 1);
            summaryMap.put(categoryId, existing);
        }
        
        return new ArrayList<>(summaryMap.values());
    }
    
    private boolean isEditable(Transaction transaction) {
        LocalDateTime createdAt = transaction.getCreatedAt();
        LocalDateTime now = LocalDateTime.now();
        long hoursDiff = ChronoUnit.HOURS.between(createdAt, now);
        return hoursDiff <= EDIT_WINDOW_HOURS;
    }
    
    private TransactionDTO toDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .category(transaction.getCategory())
                .division(transaction.getDivision())
                .accountId(transaction.getAccountId())
                .dateTime(transaction.getDateTime())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .editable(isEditable(transaction))
                .build();
    }
}
