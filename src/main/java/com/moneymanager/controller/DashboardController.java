package com.moneymanager.controller;

import com.moneymanager.dto.ApiResponse;
import com.moneymanager.dto.CategorySummaryDTO;
import com.moneymanager.dto.DashboardSummaryDTO;
import com.moneymanager.service.DashboardService;
import com.moneymanager.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard and reporting APIs")
@CrossOrigin
public class DashboardController {
    
    private final DashboardService dashboardService;
    private final TransactionService transactionService;
    
    @GetMapping("/summary/weekly")
    @Operation(summary = "Get weekly summary", description = "Get dashboard summary for the current week")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getWeeklySummary() {
        DashboardSummaryDTO summary = dashboardService.getWeeklySummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
    
    @GetMapping("/summary/monthly")
    @Operation(summary = "Get monthly summary", description = "Get dashboard summary for the current month")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getMonthlySummary() {
        DashboardSummaryDTO summary = dashboardService.getMonthlySummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
    
    @GetMapping("/summary/yearly")
    @Operation(summary = "Get yearly summary", description = "Get dashboard summary for the current year")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getYearlySummary() {
        DashboardSummaryDTO summary = dashboardService.getYearlySummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
    
    @GetMapping("/summary/custom")
    @Operation(summary = "Get custom summary", description = "Get dashboard summary for a custom date range")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getCustomSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        DashboardSummaryDTO summary = dashboardService.getCustomSummary(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
    
    @GetMapping("/category-summary")
    @Operation(summary = "Get category summary", description = "Get expense breakdown by category")
    public ResponseEntity<ApiResponse<List<CategorySummaryDTO>>> getCategorySummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<CategorySummaryDTO> summary = transactionService.getCategorySummary(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
    
    @GetMapping("/totals")
    @Operation(summary = "Get income and expense totals", description = "Get total income and expense amounts")
    public ResponseEntity<ApiResponse<TotalsResponse>> getTotals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        Double totalIncome = transactionService.getTotalIncome(startDate, endDate);
        Double totalExpense = transactionService.getTotalExpense(startDate, endDate);
        
        TotalsResponse response = new TotalsResponse(totalIncome, totalExpense, totalIncome - totalExpense);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    public record TotalsResponse(Double totalIncome, Double totalExpense, Double balance) {}
}
