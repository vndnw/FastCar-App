package com.example.Backend.dto.response;

import com.example.Backend.model.enums.DriverStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class DriverResponse {
    private long id;
    private UserResponse user;
    private String licenseNumber;
    private String imageCCCDBefore;
    private String imageCCCDAfter;
    private String imageFaceID;
    private DriverStatus status;
    private boolean active;
    private boolean online;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
