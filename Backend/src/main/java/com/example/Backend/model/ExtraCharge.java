package com.example.Backend.model;

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
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "extra_charges")
public class ExtraCharge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "booking_id")
    private Booking booking; // Assuming Booking is another entity in your application

    private String reason;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private ExtraChargeStatus status; // PENDING, PAID, DISPUTED
    @CreationTimestamp
    private LocalDateTime createdAt;
}
