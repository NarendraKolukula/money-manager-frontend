package com.moneymanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferDTO {
    
    private String id;
    
    @NotBlank(message = "From account ID is required")
    private String fromAccountId;
    
    @NotBlank(message = "To account ID is required")
    private String toAccountId;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
    
    private String description;
    
    @NotNull(message = "Date and time is required")
    private LocalDateTime dateTime;
    
    private LocalDateTime createdAt;
}
