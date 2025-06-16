package com.example.Backend.dto.response;

import com.example.Backend.model.enums.PaymentStatus;
import com.example.Backend.model.enums.PaymentType;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentResponse {
    private long id;
    private String externalRef;
    private BigDecimal amount;
    private PaymentType type;
    private PaymentStatus status;
    private List<ExtraChargeResponse> charges;

}
