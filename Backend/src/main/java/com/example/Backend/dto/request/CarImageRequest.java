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
    private long carId;     //có thể dùng hoặc không nếu ko cần thiết ( mà chắc cũng chẳng cần thiết)
    private String imageUrl;
    private CarImageType imageType;
}
