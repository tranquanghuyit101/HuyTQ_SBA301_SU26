package com.lab04.orchid_management.exception;

public class OrchidNotFoundException extends RuntimeException {
    public OrchidNotFoundException(String message) {
        super(message);
    }
}
