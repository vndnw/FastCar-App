package com.example.Backend.dto.response;

import com.example.Backend.model.Booking;
import com.example.Backend.model.enums.PaymentMethod;
import com.example.Backend.model.enums.PaymentStatus;
import com.example.Backend.model.enums.PaymentType;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
