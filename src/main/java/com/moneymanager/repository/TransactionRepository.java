package com.moneymanager.repository;

import com.moneymanager.model.Division;
import com.moneymanager.model.Transaction;
import com.moneymanager.model.TransactionType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    
    List<Transaction> findByType(TransactionType type);
    
    List<Transaction> findByDivision(Division division);
    
    List<Transaction> findByCategory(String category);
    
    List<Transaction> findByAccountId(String accountId);
    
    List<Transaction> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<Transaction> findByDivisionAndCategory(Division division, String category);
    
    @Query("{ 'dateTime': { $gte: ?0, $lte: ?1 } }")
    List<Transaction> findByDateRange(LocalDateTime start, LocalDateTime end);
    
    @Query("{ 'division': ?0, 'dateTime': { $gte: ?1, $lte: ?2 } }")
    List<Transaction> findByDivisionAndDateRange(Division division, LocalDateTime start, LocalDateTime end);
    
    @Query("{ 'category': ?0, 'dateTime': { $gte: ?1, $lte: ?2 } }")
    List<Transaction> findByCategoryAndDateRange(String category, LocalDateTime start, LocalDateTime end);
    
    @Query("{ 'division': ?0, 'category': ?1, 'dateTime': { $gte: ?2, $lte: ?3 } }")
    List<Transaction> findByDivisionAndCategoryAndDateRange(Division division, String category, LocalDateTime start, LocalDateTime end);
    
    List<Transaction> findAllByOrderByDateTimeDesc();
}
