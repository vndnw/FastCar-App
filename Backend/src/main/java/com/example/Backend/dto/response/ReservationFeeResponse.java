package com.example.Backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ReservationFeeResponse {
    private long transactionId; // Mã giao dịch thanh toán
    private long bookingId; // Mã đặt chỗ
    private BigDecimal reservationFee; // Phí đặt chỗ
    private String paymentUrl; // URL thanh toán
}
