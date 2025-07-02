package com.example.Backend.dto.request;

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
public class CarConditionCheckRequest {
    private CheckType checkType; // Loại kiểm tra: BEFORE_RENTAL , AFTER_RENTAL
    private int odometer;
    private String fuelLevel;
    private String interiorStatus;
    private String damageNote;
    private List<String> images; // Danh sách các hình ảnh liên quan đến kiểm tra tình trạng xe
}
