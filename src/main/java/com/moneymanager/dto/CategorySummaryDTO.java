package com.moneymanager.dto;

import com.moneymanager.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategorySummaryDTO {
    
    private String categoryId;
    private String categoryName;
    private String icon;
    private TransactionType type;
    private Double amount;
    private Integer count;
}
