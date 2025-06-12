package com.example.Backend.dto.response;

import com.example.Backend.model.enums.CheckStatus;
import com.example.Backend.model.enums.CheckType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarConditionCheckResponse {
    private long id;
    private String bookingCode; // Assuming bookingId is a String, adjust if it's a different type
    private long carId; // Assuming carId is a String, adjust if it's a different type
    private CheckType type; // Assuming type is a String, adjust if it's an enum or different type
    private int odometer;
    private String fuelLevel;
    private String interiorStatus;
    private String damageNote;
    private String imageFrontUrl;
    private String imageRearUrl;
    private String imageLeftUrl;
    private String imageRightUrl;
    private String imageOdoUrl;
    private String imageFuelUrl;
    private String imageOtherUrl;
    private CheckStatus status; // Assuming status is a String, adjust if it's an enum or different type
    private boolean isChecked; // Assuming isChecked is a boolean, adjust if it's a different type
    private String createdAt; // Assuming createdAt is a String, adjust if it's a different type

}
