package com.example.Backend.mapper;

import com.example.Backend.dto.response.CarImageResponse;
import com.example.Backend.model.Image;
import org.springframework.stereotype.Service;

@Service
public class CarImageMapper {
    public CarImageResponse mapToResponse(Image image) {
        return CarImageResponse.builder()
                .id(image.getId())
                .imageType(image.getImageType())
                .imageUrl(image.getImageUrl())
                .creationAt(image.getCreationAt())
                .updateAt( image.getUpdateAt())
                .build();
    }
}
