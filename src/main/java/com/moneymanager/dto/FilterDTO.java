package com.moneymanager.dto;

import com.moneymanager.model.Division;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterDTO {
    
    private Division division;
    private String category;
    private LocalDate startDate;
    private LocalDate endDate;
}
