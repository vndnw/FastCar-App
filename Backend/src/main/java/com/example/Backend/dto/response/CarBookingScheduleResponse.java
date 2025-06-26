package com.example.Backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CarBookingScheduleResponse {
    private LocalDateTime pickupTime;
    private LocalDateTime returnTime;
}
