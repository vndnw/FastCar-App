package com.example.Backend.dto.response;

import com.example.Backend.model.enums.CheckStatus;
import com.example.Backend.model.enums.CheckType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private List<String> images; // Assuming images is a List of Strings, adjust if it's a different type
    private CheckStatus status; // Assuming status is a String, adjust if it's an enum or different type
    private boolean isChecked; // Assuming isChecked is a boolean, adjust if it's a different type
    private String createdAt; // Assuming createdAt is a String, adjust if it's a different type

}
