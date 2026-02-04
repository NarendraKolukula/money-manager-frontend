package com.moneymanager.controller;

import com.moneymanager.dto.ApiResponse;
import com.moneymanager.dto.TransactionDTO;
import com.moneymanager.model.Division;
import com.moneymanager.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction", description = "Transaction management APIs")
@CrossOrigin
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @GetMapping
    @Operation(summary = "Get all transactions", description = "Retrieve all transactions with optional filters")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getAllTransactions(
            @RequestParam(required = false) Division division,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<TransactionDTO> transactions = transactionService.getFilteredTransactions(
                division, category, startDate, endDate);
        
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get transaction by ID", description = "Retrieve a specific transaction by its ID")
    public ResponseEntity<ApiResponse<TransactionDTO>> getTransactionById(@PathVariable String id) {
        TransactionDTO transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }
    
    @PostMapping
    @Operation(summary = "Create transaction", description = "Create a new income or expense transaction")
    public ResponseEntity<ApiResponse<TransactionDTO>> createTransaction(
            @Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO created = transactionService.createTransaction(transactionDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction created successfully", created));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update transaction", description = "Update an existing transaction (within 12 hours of creation)")
    public ResponseEntity<ApiResponse<TransactionDTO>> updateTransaction(
            @PathVariable String id,
            @Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO updated = transactionService.updateTransaction(id, transactionDTO);
        return ResponseEntity.ok(ApiResponse.success("Transaction updated successfully", updated));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transaction", description = "Delete a transaction (within 12 hours of creation)")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable String id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }
}
