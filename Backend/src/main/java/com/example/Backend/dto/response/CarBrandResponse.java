package com.example.Backend.dto.response;

import jakarta.persistence.Column;
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
public class CarBrandResponse {
    private long id;
    private String name;
    private String logo;
    private String description;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
