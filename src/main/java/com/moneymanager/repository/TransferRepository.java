package com.moneymanager.repository;

import com.moneymanager.model.Transfer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransferRepository extends MongoRepository<Transfer, String> {
    
    List<Transfer> findByFromAccountId(String fromAccountId);
    
    List<Transfer> findByToAccountId(String toAccountId);
    
    List<Transfer> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<Transfer> findAllByOrderByDateTimeDesc();
}
