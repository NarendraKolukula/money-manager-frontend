package com.moneymanager.repository;

import com.moneymanager.model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
    
    Optional<Account> findByName(String name);
    
    boolean existsByName(String name);
}
