package com.moneymanager.controller;

import com.moneymanager.dto.ApiResponse;
import com.moneymanager.dto.TransferDTO;
import com.moneymanager.service.TransferService;
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
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
@Tag(name = "Transfer", description = "Account transfer APIs")
@CrossOrigin
public class TransferController {
    
    private final TransferService transferService;
    
    @GetMapping
    @Operation(summary = "Get all transfers", description = "Retrieve all account transfers")
    public ResponseEntity<ApiResponse<List<TransferDTO>>> getAllTransfers() {
        List<TransferDTO> transfers = transferService.getAllTransfers();
        return ResponseEntity.ok(ApiResponse.success(transfers));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get transfer by ID", description = "Retrieve a specific transfer by its ID")
    public ResponseEntity<ApiResponse<TransferDTO>> getTransferById(@PathVariable String id) {
        TransferDTO transfer = transferService.getTransferById(id);
        return ResponseEntity.ok(ApiResponse.success(transfer));
    }
    
    @GetMapping("/date-range")
    @Operation(summary = "Get transfers by date range", description = "Retrieve transfers within a date range")
    public ResponseEntity<ApiResponse<List<TransferDTO>>> getTransfersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<TransferDTO> transfers = transferService.getTransfersByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(transfers));
    }
    
    @PostMapping
    @Operation(summary = "Create transfer", description = "Transfer money between accounts")
    public ResponseEntity<ApiResponse<TransferDTO>> createTransfer(
            @Valid @RequestBody TransferDTO transferDTO) {
        TransferDTO created = transferService.createTransfer(transferDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transfer completed successfully", created));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transfer", description = "Delete/reverse a transfer")
    public ResponseEntity<ApiResponse<Void>> deleteTransfer(@PathVariable String id) {
        transferService.deleteTransfer(id);
        return ResponseEntity.ok(ApiResponse.success("Transfer deleted successfully", null));
    }
}
