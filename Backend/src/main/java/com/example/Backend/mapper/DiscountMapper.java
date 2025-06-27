package com.example.Backend.mapper;

import com.example.Backend.dto.response.DiscountResponse;
import com.example.Backend.model.Discount;
import org.springframework.stereotype.Service;

@Service
public class DiscountMapper {
    public DiscountResponse mapToResponse(Discount discount) {
        return DiscountResponse.builder()
                .id(discount.getId())
                .code(discount.getCode())
                .percent(discount.getPercent())
                .status(discount.getStatus())
                .startDate(discount.getStartDate())
                .endDate(discount.getEndDate())
                .description(discount.getDescription())
                .quantity(discount.getQuantity())
                .build();
    }
}
