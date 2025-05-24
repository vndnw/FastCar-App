package com.example.Backend.mapper;

import com.example.Backend.dto.response.DiscountResponse;
import com.example.Backend.model.Discount;
import org.springframework.stereotype.Service;

@Service
public class DiscountMapper {
    public DiscountResponse mapToResponse(Discount discount) {
        return DiscountResponse.builder()
                .id(discount.getId())
                .name(discount.getName())
                .price(discount.getPrice())
                .percent(discount.getPercent())
                .discription(discount.getDiscription())
                .quantity(discount.getQuantity())
                .build();
    }
}
