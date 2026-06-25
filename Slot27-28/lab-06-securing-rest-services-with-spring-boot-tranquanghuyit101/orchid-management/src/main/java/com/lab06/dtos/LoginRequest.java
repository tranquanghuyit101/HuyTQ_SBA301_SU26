package com.lab06.dtos;

public record LoginRequest(
    String email,
    String password
) {}