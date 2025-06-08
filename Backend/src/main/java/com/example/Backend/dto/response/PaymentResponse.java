package com.example.Backend.dto.response;

import com.example.Backend.model.Booking;
import com.example.Backend.model.enums.PaymentMethod;
import com.example.Backend.model.enums.PaymentStatus;
import com.example.Backend.model.enums.PaymentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private long id;
    private BigDecimal amount;
    private PaymentType type;
    private PaymentMethod method;
    private PaymentStatus status;
    private String bookingCode;
    private String transactionCode;
    private LocalDateTime createdAt;
}
