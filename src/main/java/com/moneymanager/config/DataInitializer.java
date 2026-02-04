package com.moneymanager.config;

import com.moneymanager.model.*;
import com.moneymanager.repository.AccountRepository;
import com.moneymanager.repository.CategoryRepository;
import com.moneymanager.repository.TransactionRepository;
import com.moneymanager.repository.TransferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final TransferRepository transferRepository;
    
    @Bean
    @Profile("!test")
    public CommandLineRunner initializeData() {
        return args -> {
            // Initialize categories if empty
            if (categoryRepository.count() == 0) {
                initializeCategories();
            }
            
            // Initialize accounts if empty
            if (accountRepository.count() == 0) {
                initializeAccounts();
            }
            
            // Initialize sample transactions if empty
            if (transactionRepository.count() == 0) {
                initializeSampleTransactions();
            }
            
            log.info("Data initialization completed");
        };
    }
    
    private void initializeCategories() {
        List<Category> categories = Arrays.asList(
                // Expense categories
                Category.builder().id("fuel").name("Fuel").icon("Fuel").type(TransactionType.EXPENSE).build(),
                Category.builder().id("movie").name("Movie").icon("Film").type(TransactionType.EXPENSE).build(),
                Category.builder().id("food").name("Food").icon("UtensilsCrossed").type(TransactionType.EXPENSE).build(),
                Category.builder().id("loan").name("Loan").icon("Landmark").type(TransactionType.EXPENSE).build(),
                Category.builder().id("medical").name("Medical").icon("Stethoscope").type(TransactionType.EXPENSE).build(),
                Category.builder().id("shopping").name("Shopping").icon("ShoppingBag").type(TransactionType.EXPENSE).build(),
                Category.builder().id("transport").name("Transport").icon("Car").type(TransactionType.EXPENSE).build(),
                Category.builder().id("utilities").name("Utilities").icon("Zap").type(TransactionType.EXPENSE).build(),
                Category.builder().id("entertainment").name("Entertainment").icon("Gamepad2").type(TransactionType.EXPENSE).build(),
                Category.builder().id("education").name("Education").icon("GraduationCap").type(TransactionType.EXPENSE).build(),
                Category.builder().id("other-expense").name("Other Expense").icon("Receipt").type(TransactionType.EXPENSE).build(),
                
                // Income categories
                Category.builder().id("salary").name("Salary").icon("Briefcase").type(TransactionType.INCOME).build(),
                Category.builder().id("freelance").name("Freelance").icon("Laptop").type(TransactionType.INCOME).build(),
                Category.builder().id("investment").name("Investment").icon("TrendingUp").type(TransactionType.INCOME).build(),
                Category.builder().id("bonus").name("Bonus").icon("Gift").type(TransactionType.INCOME).build(),
                Category.builder().id("rental").name("Rental Income").icon("Home").type(TransactionType.INCOME).build(),
                Category.builder().id("other-income").name("Other Income").icon("Coins").type(TransactionType.INCOME).build()
        );
        
        categoryRepository.saveAll(categories);
        log.info("Initialized {} categories", categories.size());
    }
    
    private void initializeAccounts() {
        List<Account> accounts = Arrays.asList(
                Account.builder()
                        .id("cash")
                        .name("Cash")
                        .balance(5000.0)
                        .color("#10b981")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Account.builder()
                        .id("bank")
                        .name("Bank Account")
                        .balance(25000.0)
                        .color("#3b82f6")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Account.builder()
                        .id("credit")
                        .name("Credit Card")
                        .balance(0.0)
                        .color("#ef4444")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        );
        
        accountRepository.saveAll(accounts);
        log.info("Initialized {} accounts", accounts.size());
    }
    
    private void initializeSampleTransactions() {
        LocalDateTime now = LocalDateTime.now();
        
        List<Transaction> transactions = Arrays.asList(
                Transaction.builder()
                        .type(TransactionType.INCOME)
                        .amount(75000.0)
                        .description("Monthly salary")
                        .category("salary")
                        .division(Division.OFFICE)
                        .accountId("bank")
                        .dateTime(now.minusDays(25))
                        .createdAt(now.minusDays(25))
                        .updatedAt(now.minusDays(25))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(3500.0)
                        .description("Grocery shopping")
                        .category("food")
                        .division(Division.PERSONAL)
                        .accountId("cash")
                        .dateTime(now.minusDays(20))
                        .createdAt(now.minusDays(20))
                        .updatedAt(now.minusDays(20))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(2000.0)
                        .description("Fuel for car - office commute")
                        .category("fuel")
                        .division(Division.OFFICE)
                        .accountId("cash")
                        .dateTime(now.minusDays(18))
                        .createdAt(now.minusDays(18))
                        .updatedAt(now.minusDays(18))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(800.0)
                        .description("Movie with family")
                        .category("movie")
                        .division(Division.PERSONAL)
                        .accountId("cash")
                        .dateTime(now.minusDays(15))
                        .createdAt(now.minusDays(15))
                        .updatedAt(now.minusDays(15))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(1500.0)
                        .description("Doctor consultation")
                        .category("medical")
                        .division(Division.PERSONAL)
                        .accountId("bank")
                        .dateTime(now.minusDays(12))
                        .createdAt(now.minusDays(12))
                        .updatedAt(now.minusDays(12))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.INCOME)
                        .amount(15000.0)
                        .description("Freelance project payment")
                        .category("freelance")
                        .division(Division.PERSONAL)
                        .accountId("bank")
                        .dateTime(now.minusDays(10))
                        .createdAt(now.minusDays(10))
                        .updatedAt(now.minusDays(10))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(5000.0)
                        .description("Online shopping")
                        .category("shopping")
                        .division(Division.PERSONAL)
                        .accountId("credit")
                        .dateTime(now.minusDays(8))
                        .createdAt(now.minusDays(8))
                        .updatedAt(now.minusDays(8))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(1200.0)
                        .description("Electricity bill")
                        .category("utilities")
                        .division(Division.PERSONAL)
                        .accountId("bank")
                        .dateTime(now.minusDays(7))
                        .createdAt(now.minusDays(7))
                        .updatedAt(now.minusDays(7))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(2500.0)
                        .description("Fuel for weekend trip")
                        .category("fuel")
                        .division(Division.PERSONAL)
                        .accountId("cash")
                        .dateTime(now.minusDays(5))
                        .createdAt(now.minusDays(5))
                        .updatedAt(now.minusDays(5))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(3000.0)
                        .description("Team lunch")
                        .category("food")
                        .division(Division.OFFICE)
                        .accountId("bank")
                        .dateTime(now.minusDays(4))
                        .createdAt(now.minusDays(4))
                        .updatedAt(now.minusDays(4))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.INCOME)
                        .amount(5000.0)
                        .description("Investment returns")
                        .category("investment")
                        .division(Division.PERSONAL)
                        .accountId("bank")
                        .dateTime(now.minusDays(3))
                        .createdAt(now.minusDays(3))
                        .updatedAt(now.minusDays(3))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(1800.0)
                        .description("Uber rides to office")
                        .category("transport")
                        .division(Division.OFFICE)
                        .accountId("cash")
                        .dateTime(now.minusDays(2))
                        .createdAt(now.minusDays(2))
                        .updatedAt(now.minusDays(2))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(500.0)
                        .description("Netflix subscription")
                        .category("entertainment")
                        .division(Division.PERSONAL)
                        .accountId("credit")
                        .dateTime(now.minusDays(1))
                        .createdAt(now.minusDays(1))
                        .updatedAt(now.minusDays(1))
                        .build(),
                Transaction.builder()
                        .type(TransactionType.EXPENSE)
                        .amount(2000.0)
                        .description("Online course")
                        .category("education")
                        .division(Division.PERSONAL)
                        .accountId("bank")
                        .dateTime(now)
                        .createdAt(now)
                        .updatedAt(now)
                        .build()
        );
        
        transactionRepository.saveAll(transactions);
        log.info("Initialized {} sample transactions", transactions.size());
        
        // Initialize sample transfers
        List<Transfer> transfers = Arrays.asList(
                Transfer.builder()
                        .fromAccountId("bank")
                        .toAccountId("cash")
                        .amount(10000.0)
                        .description("ATM withdrawal")
                        .dateTime(now.minusDays(22))
                        .createdAt(now.minusDays(22))
                        .build(),
                Transfer.builder()
                        .fromAccountId("bank")
                        .toAccountId("credit")
                        .amount(5000.0)
                        .description("Credit card payment")
                        .dateTime(now.minusDays(6))
                        .createdAt(now.minusDays(6))
                        .build()
        );
        
        transferRepository.saveAll(transfers);
        log.info("Initialized {} sample transfers", transfers.size());
    }
}
