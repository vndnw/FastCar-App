package com.example.Backend.dto.request;

import com.example.Backend.model.enums.PaymentMethod;
import com.example.Backend.model.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
    private BigDecimal amount;
    private PaymentType type;
    private List<ExtraChargeRequest> extraChargeRequest;
}
