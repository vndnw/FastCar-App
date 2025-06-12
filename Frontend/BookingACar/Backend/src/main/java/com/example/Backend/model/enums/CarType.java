package com.example.Backend.model.enums;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public enum CarType {
    STANDARD("Xe thường", new BigDecimal("2000000")),
    LUXURY("Xe sang", new BigDecimal("10000000")),
    SUPER_LUXURY("Xe siêu sang", new BigDecimal("20000000"));

    private final String displayName;
    private final BigDecimal defaultDepositAmount;

    CarType(String displayName, BigDecimal defaultDepositAmount) {
        this.displayName = displayName;
        this.defaultDepositAmount = defaultDepositAmount;
    }

}
