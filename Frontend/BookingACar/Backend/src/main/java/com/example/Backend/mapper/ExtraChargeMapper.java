package com.example.Backend.mapper;

import com.example.Backend.dto.response.ExtraChargeResponse;
import com.example.Backend.model.ExtraCharge;
import org.springframework.stereotype.Service;

@Service
public class ExtraChargeMapper {
    public ExtraChargeResponse mapToResponse(ExtraCharge extraCharge) {
        return ExtraChargeResponse.builder()
                .amount(extraCharge.getAmount())
                .reason(extraCharge.getReason())
                .build();
    }

}
