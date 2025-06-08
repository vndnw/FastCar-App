package com.example.Backend.model;


import com.example.Backend.dto.request.BookingRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "Discounts")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private double price;
    private double percent;
    private int quantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Column(columnDefinition = "TEXT")
    private String description;
    private LocalDateTime createdAt;
}
