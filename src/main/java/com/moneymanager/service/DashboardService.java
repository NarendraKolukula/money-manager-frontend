package com.moneymanager.service;

import com.moneymanager.dto.CategorySummaryDTO;
import com.moneymanager.dto.DashboardSummaryDTO;
import com.moneymanager.dto.PeriodDataDTO;
import com.moneymanager.model.Transaction;
import com.moneymanager.model.TransactionType;
import com.moneymanager.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
    
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    
    public DashboardSummaryDTO getWeeklySummary() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfWeek = startOfWeek.plusDays(6).withHour(23).withMinute(59).withSecond(59);
        
        return getSummary(startOfWeek, endOfWeek, "weekly");
    }
    
    public DashboardSummaryDTO getMonthlySummary() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth())
                .withHour(23).withMinute(59).withSecond(59);
        
        return getSummary(startOfMonth, endOfMonth, "monthly");
    }
    
    public DashboardSummaryDTO getYearlySummary() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfYear = now.withDayOfYear(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfYear = now.with(TemporalAdjusters.lastDayOfYear())
                .withHour(23).withMinute(59).withSecond(59);
        
        return getSummary(startOfYear, endOfYear, "yearly");
    }
    
    public DashboardSummaryDTO getCustomSummary(LocalDateTime start, LocalDateTime end) {
        return getSummary(start, end, "custom");
    }
    
    private DashboardSummaryDTO getSummary(LocalDateTime start, LocalDateTime end, String periodType) {
        Double totalIncome = transactionService.getTotalIncome(start, end);
        Double totalExpense = transactionService.getTotalExpense(start, end);
        Double balance = totalIncome - totalExpense;
        
        List<CategorySummaryDTO> categoryBreakdown = transactionService.getCategorySummary(start, end);
        List<PeriodDataDTO> periodComparison = getPeriodComparison(periodType);
        
        return DashboardSummaryDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .categoryBreakdown(categoryBreakdown)
                .periodComparison(periodComparison)
                .build();
    }
    
    private List<PeriodDataDTO> getPeriodComparison(String periodType) {
        List<PeriodDataDTO> comparison = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter;
        
        int periods;
        switch (periodType) {
            case "weekly":
                periods = 4;
                formatter = DateTimeFormatter.ofPattern("MMM d");
                for (int i = periods - 1; i >= 0; i--) {
                    LocalDateTime weekStart = now.minusWeeks(i)
                            .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                            .withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime weekEnd = weekStart.plusDays(6).withHour(23).withMinute(59).withSecond(59);
                    
                    comparison.add(createPeriodData(formatter.format(weekStart), weekStart, weekEnd));
                }
                break;
                
            case "monthly":
                periods = 6;
                formatter = DateTimeFormatter.ofPattern("MMM yyyy");
                for (int i = periods - 1; i >= 0; i--) {
                    LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1)
                            .withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime monthEnd = monthStart.with(TemporalAdjusters.lastDayOfMonth())
                            .withHour(23).withMinute(59).withSecond(59);
                    
                    comparison.add(createPeriodData(formatter.format(monthStart), monthStart, monthEnd));
                }
                break;
                
            case "yearly":
                periods = 3;
                formatter = DateTimeFormatter.ofPattern("yyyy");
                for (int i = periods - 1; i >= 0; i--) {
                    LocalDateTime yearStart = now.minusYears(i).withDayOfYear(1)
                            .withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime yearEnd = yearStart.with(TemporalAdjusters.lastDayOfYear())
                            .withHour(23).withMinute(59).withSecond(59);
                    
                    comparison.add(createPeriodData(formatter.format(yearStart), yearStart, yearEnd));
                }
                break;
                
            default:
                break;
        }
        
        return comparison;
    }
    
    private PeriodDataDTO createPeriodData(String label, LocalDateTime start, LocalDateTime end) {
        List<Transaction> transactions = transactionRepository.findByDateRange(start, end);
        
        double income = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        double expense = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        return PeriodDataDTO.builder()
                .period(label)
                .income(income)
                .expense(expense)
                .build();
    }
}
