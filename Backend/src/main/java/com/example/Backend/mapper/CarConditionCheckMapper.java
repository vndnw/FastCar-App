package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarConditionCheckResponse;
import com.example.Backend.model.CarConditionCheck;
import org.springframework.stereotype.Service;

@Service
public class CarConditionCheckMapper {
    public CarConditionCheckResponse mapToResponse(CarConditionCheck carConditionCheck) {
        return CarConditionCheckResponse.builder()
                .id(carConditionCheck.getId())
                .bookingCode(carConditionCheck.getBooking().getBookingCode())
                .carId(carConditionCheck.getCar().getId())
                .type(carConditionCheck.getType())
                .odometer(carConditionCheck.getOdometer())
                .fuelLevel(carConditionCheck.getFuelLevel())
                .interiorStatus(carConditionCheck.getInteriorStatus())
                .damageNote(carConditionCheck.getDamageNote())
                .imageFrontUrl(carConditionCheck.getImageFrontUrl())
                .imageRearUrl(carConditionCheck.getImageRearUrl())
                .imageLeftUrl(carConditionCheck.getImageLeftUrl())
                .imageRightUrl(carConditionCheck.getImageRightUrl())
                .imageOdoUrl(carConditionCheck.getImageOdoUrl())
                .imageFuelUrl(carConditionCheck.getImageFuelUrl())
                .imageOtherUrl(carConditionCheck.getImageOtherUrl())
                .status(carConditionCheck.getStatus())
                .isChecked(carConditionCheck.isChecked())
                .createdAt(carConditionCheck.getCreatedAt().toString()) // Assuming createdAt is a LocalDateTime
                .build();
    }
}
