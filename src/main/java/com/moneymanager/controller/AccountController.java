package com.moneymanager.controller;

import com.moneymanager.dto.AccountDTO;
import com.moneymanager.dto.ApiResponse;
import com.moneymanager.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Account", description = "Account management APIs")
@CrossOrigin
public class AccountController {
    
    private final AccountService accountService;
    
    @GetMapping
    @Operation(summary = "Get all accounts", description = "Retrieve all accounts")
    public ResponseEntity<ApiResponse<List<AccountDTO>>> getAllAccounts() {
        List<AccountDTO> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.success(accounts));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get account by ID", description = "Retrieve a specific account by its ID")
    public ResponseEntity<ApiResponse<AccountDTO>> getAccountById(@PathVariable String id) {
        AccountDTO account = accountService.getAccountById(id);
        return ResponseEntity.ok(ApiResponse.success(account));
    }
    
    @GetMapping("/total-balance")
    @Operation(summary = "Get total balance", description = "Get the total balance across all accounts")
    public ResponseEntity<ApiResponse<Double>> getTotalBalance() {
        Double totalBalance = accountService.getTotalBalance();
        return ResponseEntity.ok(ApiResponse.success(totalBalance));
    }
    
    @PostMapping
    @Operation(summary = "Create account", description = "Create a new account")
    public ResponseEntity<ApiResponse<AccountDTO>> createAccount(
            @Valid @RequestBody AccountDTO accountDTO) {
        AccountDTO created = accountService.createAccount(accountDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", created));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update account", description = "Update an existing account")
    public ResponseEntity<ApiResponse<AccountDTO>> updateAccount(
            @PathVariable String id,
            @Valid @RequestBody AccountDTO accountDTO) {
        AccountDTO updated = accountService.updateAccount(id, accountDTO);
        return ResponseEntity.ok(ApiResponse.success("Account updated successfully", updated));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete account", description = "Delete an account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable String id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }
}
