package com.moneymanager.repository;

import com.moneymanager.model.Category;
import com.moneymanager.model.TransactionType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    List<Category> findByType(TransactionType type);
    
    Optional<Category> findByName(String name);
    
    boolean existsByName(String name);
}
