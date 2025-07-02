package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarConditionCheckResponse;
import com.example.Backend.model.ConditionCheck;
import org.springframework.stereotype.Service;

@Service
public class CarConditionCheckMapper {
    public CarConditionCheckResponse mapToResponse(ConditionCheck conditionCheck) {
        return CarConditionCheckResponse.builder()
                .id(conditionCheck.getId())
                .bookingCode(conditionCheck.getBooking().getBookingCode())
                .carId(conditionCheck.getCar().getId())
                .type(conditionCheck.getType())
                .odometer(conditionCheck.getOdometer())
                .fuelLevel(conditionCheck.getFuelLevel())
                .interiorStatus(conditionCheck.getInteriorStatus())
                .damageNote(conditionCheck.getDamageNote())
                .images(conditionCheck.getImages())
                .status(conditionCheck.getStatus())
                .isChecked(conditionCheck.isChecked())
                .createdAt(conditionCheck.getCreatedAt().toString()) // Assuming createdAt is a LocalDateTime
                .build();
    }
}
