package com.example.Backend.dto.request;

import com.example.Backend.model.Car;
import com.example.Backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ReviewCarRequest {
    private long userId;
    private String comment;
    private int rating;
}
