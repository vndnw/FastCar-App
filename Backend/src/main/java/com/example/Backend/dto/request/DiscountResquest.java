package com.example.Backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class DiscountResquest {
    private String code;
    private int percent;
    private int quantity;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String discription;
}
