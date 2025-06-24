package com.example.Backend.mapper;

import com.example.Backend.dto.response.ImageResponse;
import com.example.Backend.model.Image;
import org.springframework.stereotype.Service;

@Service
public class ImageMapper {
    public ImageResponse mapToResponse(Image image) {
        return ImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .build();
    }
}
