package com.example.Backend.mapper;

import com.example.Backend.dto.response.ExtraChargeResponse;
import com.example.Backend.model.ExtraCharge;
import org.springframework.stereotype.Service;

@Service
public class ExtraChargeMapper {
    public ExtraChargeResponse mapToResponse(ExtraCharge extraCharge) {
        return ExtraChargeResponse.builder()
                .id(extraCharge.getId())
                .bookingCode(extraCharge.getBooking().getBookingCode())
                .amount(extraCharge.getAmount())
                .reason(extraCharge.getReason())
                .status(extraCharge.getStatus())
                .createdAt(extraCharge.getCreatedAt())
                .build();
    }

}
