package com.example.Backend.dto.request;

import com.example.Backend.model.enums.DriverStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class DriverRequest {
    private long id;
    private long userId;
    private String licenseNumber;
    private String imageCCCDBefore;
    private String imageCCCDAfter;
    private String imageFaceID;
    private DriverStatus status;
    private boolean active;
    private boolean online;
}
