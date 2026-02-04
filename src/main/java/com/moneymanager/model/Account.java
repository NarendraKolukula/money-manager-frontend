package com.moneymanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "accounts")
public class Account {
    
    @Id
    private String id;
    
    @NotBlank(message = "Account name is required")
    private String name;
    
    @NotNull(message = "Balance is required")
    private Double balance;
    
    @NotBlank(message = "Color is required")
    private String color;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
