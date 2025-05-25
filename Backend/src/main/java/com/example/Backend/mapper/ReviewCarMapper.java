package com.example.Backend.mapper;

import com.example.Backend.dto.response.ReviewCarResponse;
import com.example.Backend.model.ReviewCar;
import org.springframework.stereotype.Service;

@Service
public class ReviewCarMapper {

    private final UserMapper userMapper;

    public ReviewCarMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public ReviewCarResponse mapToResponse(ReviewCar reviewCar) {
        return ReviewCarResponse.builder()
                .id(reviewCar.getId())
                .user(userMapper.mapToResponse(reviewCar.getUser()))
                .comment(reviewCar.getComment())
                .rating(reviewCar.getRating())
                .createdAt(reviewCar.getCreatedAt())
                .updatedAt(reviewCar.getUpdatedAt())
                .build();
    }
}
