package com.moneymanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    
    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private List<CategorySummaryDTO> categoryBreakdown;
    private List<PeriodDataDTO> periodComparison;
}
