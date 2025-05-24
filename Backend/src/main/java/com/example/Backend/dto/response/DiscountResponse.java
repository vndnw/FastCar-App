package com.example.Backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class DiscountResponse {
    private long id;
    private String name;
    private double price;
    private double percent;
    private int quantity;
    private String discription;
}
