package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarImageResponse;
import com.example.Backend.model.CarImage;
import org.springframework.stereotype.Service;

@Service
public class CarImageMapper {
    public CarImageResponse mapToResponse(CarImage carImage) {
        return CarImageResponse.builder()
                .id(carImage.getId())
                .imageType(carImage.getImageType())
                .imageUrl(carImage.getImageUrl())
                .creationAt(carImage.getCreationAt())
                .updateAt( carImage.getUpdateAt())
                .build();
    }
}
