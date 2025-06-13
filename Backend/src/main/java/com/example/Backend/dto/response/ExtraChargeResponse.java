package com.example.Backend.dto.response;

import com.example.Backend.model.Booking;
import com.example.Backend.model.enums.ExtraChargeStatus;
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
public class ExtraChargeResponse {
    private BigDecimal amount;
    private String reason;

}
