package com.example.Backend.dto.request;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CarSearchCriteriaRequest {
    private Long brandId;
    private String name;
    private String carType;
    private String fuelType;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer minSeats;
    // Lọc theo ngày có sẵn
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;
    // --- Lọc địa điểm (sẽ được xử lý theo thứ tự ưu tiên) ---
    // Ưu tiên 1: Lọc theo bán kính địa lý (chính xác nhất)
    private Double latitude;
    private Double longitude;
    private Double radiusInKm;
    // Ưu tiên 2: Lọc theo thành phố/quận (có cấu trúc)
    private String city;
    private String district;
    // Ưu tiên 3: Lọc theo chuỗi văn bản chung (ít chính xác nhất)
    private String location;
}
