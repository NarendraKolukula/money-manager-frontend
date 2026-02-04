package com.moneymanager.service;

import com.moneymanager.dto.TransferDTO;
import com.moneymanager.exception.InvalidTransferException;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.model.Transfer;
import com.moneymanager.repository.TransferRepository;
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
public class TransferService {
    
    private final TransferRepository transferRepository;
    private final AccountService accountService;
    
    public List<TransferDTO> getAllTransfers() {
        return transferRepository.findAllByOrderByDateTimeDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public TransferDTO getTransferById(String id) {
        Transfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer not found with id: " + id));
        return toDTO(transfer);
    }
    
    public List<TransferDTO> getTransfersByDateRange(LocalDateTime start, LocalDateTime end) {
        return transferRepository.findByDateTimeBetween(start, end)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TransferDTO createTransfer(TransferDTO dto) {
        // Validate transfer
        if (dto.getFromAccountId().equals(dto.getToAccountId())) {
            throw new InvalidTransferException("Cannot transfer to the same account");
        }
        
        // Verify accounts exist
        accountService.getAccountById(dto.getFromAccountId());
        accountService.getAccountById(dto.getToAccountId());
        
        Transfer transfer = Transfer.builder()
                .fromAccountId(dto.getFromAccountId())
                .toAccountId(dto.getToAccountId())
                .amount(dto.getAmount())
                .description(dto.getDescription())
                .dateTime(dto.getDateTime())
                .createdAt(LocalDateTime.now())
                .build();
        
        Transfer saved = transferRepository.save(transfer);
        
        // Update account balances
        accountService.updateBalance(dto.getFromAccountId(), -dto.getAmount());
        accountService.updateBalance(dto.getToAccountId(), dto.getAmount());
        
        log.info("Created transfer: {} - ${} from {} to {}", 
                saved.getId(), saved.getAmount(), saved.getFromAccountId(), saved.getToAccountId());
        
        return toDTO(saved);
    }
    
    @Transactional
    public void deleteTransfer(String id) {
        Transfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer not found with id: " + id));
        
        // Revert account balances
        accountService.updateBalance(transfer.getFromAccountId(), transfer.getAmount());
        accountService.updateBalance(transfer.getToAccountId(), -transfer.getAmount());
        
        transferRepository.deleteById(id);
        log.info("Deleted transfer: {}", id);
    }
    
    private TransferDTO toDTO(Transfer transfer) {
        return TransferDTO.builder()
                .id(transfer.getId())
                .fromAccountId(transfer.getFromAccountId())
                .toAccountId(transfer.getToAccountId())
                .amount(transfer.getAmount())
                .description(transfer.getDescription())
                .dateTime(transfer.getDateTime())
                .createdAt(transfer.getCreatedAt())
                .build();
    }
}
