package com.moneymanager.service;

import com.moneymanager.dto.AccountDTO;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.model.Account;
import com.moneymanager.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {
    
    private final AccountRepository accountRepository;
    
    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public AccountDTO getAccountById(String id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        return toDTO(account);
    }
    
    @Transactional
    public AccountDTO createAccount(AccountDTO dto) {
        Account account = Account.builder()
                .name(dto.getName())
                .balance(dto.getBalance() != null ? dto.getBalance() : 0.0)
                .color(dto.getColor())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Account saved = accountRepository.save(account);
        log.info("Created account: {} - {}", saved.getId(), saved.getName());
        
        return toDTO(saved);
    }
    
    @Transactional
    public AccountDTO updateAccount(String id, AccountDTO dto) {
        Account existing = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        
        existing.setName(dto.getName());
        existing.setColor(dto.getColor());
        existing.setUpdatedAt(LocalDateTime.now());
        
        // Note: Balance should not be directly updated, only through transactions
        
        Account saved = accountRepository.save(existing);
        log.info("Updated account: {}", saved.getId());
        
        return toDTO(saved);
    }
    
    @Transactional
    public void updateBalance(String id, Double amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        
        account.setBalance(account.getBalance() + amount);
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);
        
        log.info("Updated balance for account {}: {} (change: {})", id, account.getBalance(), amount);
    }
    
    @Transactional
    public void deleteAccount(String id) {
        if (!accountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
        log.info("Deleted account: {}", id);
    }
    
    public Double getTotalBalance() {
        return accountRepository.findAll()
                .stream()
                .mapToDouble(Account::getBalance)
                .sum();
    }
    
    private AccountDTO toDTO(Account account) {
        return AccountDTO.builder()
                .id(account.getId())
                .name(account.getName())
                .balance(account.getBalance())
                .color(account.getColor())
                .build();
    }
}
