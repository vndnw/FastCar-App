package com.example.Backend.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class LocationResponse {
    private long id;
    private String address;     // Địa chỉ cụ thể
    private Double latitude;    // Tọa độ GPS (nếu cần)
    private Double longitude;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
