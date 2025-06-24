package com.example.Backend.dto.response;

import com.example.Backend.model.enums.CarImageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ImageResponse {
    private long id;
    private String imageUrl;
}
