package com.moneymanager.exception;

public class TransactionNotEditableException extends RuntimeException {
    
    public TransactionNotEditableException(String message) {
        super(message);
    }
    
    public TransactionNotEditableException(String message, Throwable cause) {
        super(message, cause);
    }
}
