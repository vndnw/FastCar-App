package com.example.Backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class RentalFeeResponse {
    private List<Long> transactionId; // Mã giao dịch thanh toán//sau khi tích hợp thnh toan bằng VNPAY thì sẽ trả về mã doa dịch tai đây cho trụ quan
    private long bookingId; // Mã đặt chỗ
    private BigDecimal rentalFee; // Phí thuê xe
    private BigDecimal depositFee;
    private BigDecimal totalFee; // Tổng phí thuê xe (bao gồm phí đặt cọc)
    private String paymentUrl; // URL thanh toán
}
