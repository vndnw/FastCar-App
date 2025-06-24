package com.example.Backend.dto.request;

import com.example.Backend.model.enums.CarImageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarImageRequest {
    private String imageUrl;
}
