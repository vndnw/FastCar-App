package com.example.Backend.dto.response;


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
public class CarFeatureResponse {
    private long id;
    private String name;
    private String iconUrl;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
