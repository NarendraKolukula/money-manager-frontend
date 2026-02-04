package com.moneymanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "categories")
public class Category {
    
    @Id
    private String id;
    
    @NotBlank(message = "Category name is required")
    private String name;
    
    @NotBlank(message = "Icon is required")
    private String icon;
    
    @NotNull(message = "Transaction type is required")
    private TransactionType type;
}
