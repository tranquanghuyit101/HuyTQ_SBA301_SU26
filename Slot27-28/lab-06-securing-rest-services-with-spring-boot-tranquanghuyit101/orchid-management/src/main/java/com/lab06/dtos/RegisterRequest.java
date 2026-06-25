package com.lab06.dtos;

public record RegisterRequest(
        String fullName,
        String email,
        String password) {
}