package com.example.Backend.dto.response;

import com.example.Backend.model.Car;
import com.example.Backend.model.enums.CarImageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CarImageResponse {
    private long id;
    private String imageUrl;
    private CarImageType imageType;
    private LocalDateTime creationAt;
    private LocalDateTime updateAt;
}
