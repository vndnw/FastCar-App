package com.example.Backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class DiscountResponse {
    private long id;
    private String name;
    private double price;
    private double percent;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int quantity;
    private String description;
}
