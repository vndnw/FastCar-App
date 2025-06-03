package com.example.Backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class LocationRequest {
    private String name;        // Tên địa điểm (ví dụ: Quận 1 - TP.HCM)
    private String address;     // Địa chỉ cụ thể
    private Double latitude;    // Tọa độ GPS (nếu cần)
    private Double longitude;
}
