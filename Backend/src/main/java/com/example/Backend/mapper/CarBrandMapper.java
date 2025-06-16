package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarBrandResponse;
import com.example.Backend.model.Brand;
import org.springframework.stereotype.Service;

@Service
public class CarBrandMapper {

    public CarBrandResponse mapToResponse(Brand brand) {
        return CarBrandResponse.builder()
                .id(brand.getId())
                .description(brand.getDescription())
                .name(brand.getName())
                .logo(brand.getLogo())
                .createAt(brand.getCreateAt())
                .updateAt(brand.getUpdateAt())
                .build();
    }
}
