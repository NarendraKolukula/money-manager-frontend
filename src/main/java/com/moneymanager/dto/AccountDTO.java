package com.moneymanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    
    private String id;
    
    @NotBlank(message = "Account name is required")
    private String name;
    
    @NotNull(message = "Balance is required")
    private Double balance;
    
    @NotBlank(message = "Color is required")
    private String color;
}
