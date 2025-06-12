package com.example.Backend.service;

import com.example.Backend.dto.request.ReviewCarRequest;
import com.example.Backend.dto.response.ReviewCarResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.ReviewCarMapper;
import com.example.Backend.model.Car;
import com.example.Backend.model.ReviewCar;
import com.example.Backend.model.User;
import com.example.Backend.repository.CarRepository;
import com.example.Backend.repository.ReviewCarRepository;
import com.example.Backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ReviewCarService {
    private final ReviewCarRepository reviewCarRepository;
    private final ReviewCarMapper reviewCarMapper;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public ReviewCarService(ReviewCarRepository reviewCarRepository, ReviewCarMapper reviewCarMapper, CarRepository carRepository, UserRepository userRepository) {
        this.reviewCarRepository = reviewCarRepository;
        this.reviewCarMapper = reviewCarMapper;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    public Page<ReviewCarResponse> findAllByCarId(long carId, Pageable pageable) {
        Page<ReviewCar> reviewCars = reviewCarRepository.findAllByCarId(carId, pageable);
        return reviewCars.map(reviewCar -> reviewCarMapper.mapToResponse(reviewCar));
    }

    public ReviewCarResponse createReviewCar(long carId, ReviewCarRequest reviewCarRequest) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        User user = userRepository.findById(reviewCarRequest.getUserId()).orElseThrow(()-> new ResourceNotFoundException("User not found"));
        ReviewCar reviewCar = ReviewCar.builder()
                .rating(reviewCarRequest.getRating())
                .comment(reviewCarRequest.getComment())
                .car(car)
                .user(user)
                .build();
        return reviewCarMapper.mapToResponse(reviewCarRepository.save(reviewCar));
    }

    
}
