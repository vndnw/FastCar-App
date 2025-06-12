package com.example.Backend.mapper;

import com.example.Backend.dto.response.PaymentResponse;
import com.example.Backend.model.Payment;
import org.springframework.stereotype.Service;

@Service
public class PaymentMapper {
    public PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .type(payment.getType())
                .status(payment.getStatus())
                .build();
    }

}
