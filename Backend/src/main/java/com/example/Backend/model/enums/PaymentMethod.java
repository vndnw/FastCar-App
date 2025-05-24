package com.example.Backend.model.enums;

public enum PaymentMethod {
    CASH,
    CREDIT_CARD,
    DEBIT_CARD,
    PAYPAL,
    APPLE_PAY,
    GOOGLE_PAY,
    BANK_TRANSFER,
    CRYPTOCURRENCY;

    @Override
    public String toString() {
        return name().replace("_", " ").toLowerCase();
    }
}
