package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarBrandResponse;
import com.example.Backend.model.CarBrand;
import org.springframework.stereotype.Service;

@Service
public class CarBrandMapper {

    public CarBrandResponse mapToResponse(CarBrand carBrand) {
        return CarBrandResponse.builder()
                .id(carBrand.getId())
                .description(carBrand.getDescription())
                .name(carBrand.getName())
                .logo(carBrand.getLogo())
                .createAt(carBrand.getCreateAt())
                .updateAt(carBrand.getUpdateAt())
                .build();
    }
}
