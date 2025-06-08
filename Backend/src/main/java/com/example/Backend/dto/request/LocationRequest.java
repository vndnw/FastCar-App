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
    private String address;     // Địa chỉ cụ thể(nếu có )
    // chia nhỏ các thành phần địa chỉ sử dụng 1 trong 2 // street, ward, district, city
    private String street;
    private String ward;
    private String district;
    private String city;
}
