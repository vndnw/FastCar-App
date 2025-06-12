package com.example.Backend.dto.request;

import com.example.Backend.model.enums.CheckType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarConditionCheckRequest {
    private CheckType checkType; // Loại kiểm tra: EXTERIOR, INTERIOR, ODOMETER, FUEL
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
}
