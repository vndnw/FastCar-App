package com.example.Backend.model;


import com.example.Backend.dto.request.BookingRequest;
import com.example.Backend.model.enums.DiscountStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "discounts")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String code;
    private int percent;
    private int quantity;
    @Enumerated(EnumType.STRING)
    private DiscountStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Column(columnDefinition = "TEXT")
    private String description;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
