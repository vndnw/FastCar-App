package com.example.Backend.service;

import com.example.Backend.dto.request.CarConditionCheckRequest;
import com.example.Backend.dto.response.CarConditionCheckResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarConditionCheckMapper;
import com.example.Backend.model.Booking;
import com.example.Backend.model.ConditionCheck;
import com.example.Backend.model.enums.CheckStatus;
import com.example.Backend.repository.BookingRepository;
import com.example.Backend.repository.CarConditionCheckRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarConditionCheckService {
    private final CarConditionCheckRepository carConditionCheckRepository;
    private final CarConditionCheckMapper carConditionCheckMapper;
    private final BookingRepository bookingRepository;

    public CarConditionCheckService(CarConditionCheckRepository carConditionCheckRepository,
                                    CarConditionCheckMapper carConditionCheckMapper,
                                    BookingRepository bookingRepository) {
        this.carConditionCheckRepository = carConditionCheckRepository;
        this.carConditionCheckMapper = carConditionCheckMapper;
        this.bookingRepository = bookingRepository;
    }

    public CarConditionCheckResponse createCarConditionCheck(long bookingId , @NotNull CarConditionCheckRequest carConditionCheckRequest) {

        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        ConditionCheck conditionCheck = new ConditionCheck();
        conditionCheck.setBooking(booking);
        conditionCheck.setCar(booking.getCar());
        conditionCheck.setType(carConditionCheckRequest.getCheckType());
        conditionCheck.setOdometer(carConditionCheckRequest.getOdometer());
        conditionCheck.setFuelLevel(carConditionCheckRequest.getFuelLevel());
        conditionCheck.setInteriorStatus(carConditionCheckRequest.getInteriorStatus());
        conditionCheck.setDamageNote(carConditionCheckRequest.getDamageNote());
        conditionCheck.setImageFrontUrl(carConditionCheckRequest.getImageFrontUrl());
        conditionCheck.setImageRearUrl(carConditionCheckRequest.getImageRearUrl());
        conditionCheck.setImageLeftUrl(carConditionCheckRequest.getImageLeftUrl());
        conditionCheck.setImageRightUrl(carConditionCheckRequest.getImageRightUrl());
        conditionCheck.setImageOdoUrl(carConditionCheckRequest.getImageOdoUrl());
        conditionCheck.setImageFuelUrl(carConditionCheckRequest.getImageFuelUrl());
        conditionCheck.setImageOtherUrl(carConditionCheckRequest.getImageOtherUrl());
        conditionCheck.setStatus(CheckStatus.PENDING);
        conditionCheck.setChecked(false);

        return carConditionCheckMapper.mapToResponse(carConditionCheckRepository.save(conditionCheck));
    }

    public List<CarConditionCheckResponse> getCarConditionCheckByBookingId(long bookingId) {
        List<ConditionCheck> conditionCheck = carConditionCheckRepository.findCarConditionCheckByBookingId(bookingId);
        if(conditionCheck.isEmpty()) {
            throw new ResourceNotFoundException("Car condition checks not found for booking id: " + bookingId);
        }
        return conditionCheck.stream()
                .map(carConditionCheckMapper::mapToResponse)
                .toList();
    }

    public Page<CarConditionCheckResponse> getAllCarConditionChecks(Pageable pageable) {
        return carConditionCheckRepository.findAll(pageable)
                .map(carConditionCheckMapper::mapToResponse);
    }

    public CarConditionCheckResponse getCarConditionCheckById(long id) {
        ConditionCheck conditionCheck = carConditionCheckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car condition check not found with id: " + id));
        return carConditionCheckMapper.mapToResponse(conditionCheck);
    }

    public boolean isCarConditionCheckExists(long bookingId) {
        if(carConditionCheckRepository.existsByBookingId(bookingId)){
            return true;
        } else {
            //thực hiện gửi mail hoặc thông báo cho chủ xe
            return false;
        }
    }

    public void deleteCarConditionCheckById(long id) {
        ConditionCheck conditionCheck = carConditionCheckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car condition check not found with id: " + id));
        carConditionCheckRepository.delete(conditionCheck);
    }

    public void deleteCarConditionCheckByBookingId(long bookingId) {
        List<ConditionCheck> conditionCheck = carConditionCheckRepository.findCarConditionCheckByBookingId(bookingId);
        if(conditionCheck.isEmpty()) {
            throw new ResourceNotFoundException("Car condition checks not found for booking id: " + bookingId);
        }
        carConditionCheckRepository.deleteAll(conditionCheck);
    }

    public CarConditionCheckResponse updateCarConditionCheckByBookingId(long id, @NotNull CarConditionCheckRequest carConditionCheckRequest) {
        ConditionCheck conditionCheck = carConditionCheckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car condition check not found with id: " + id));

        conditionCheck.setOdometer(carConditionCheckRequest.getOdometer());
        conditionCheck.setFuelLevel(carConditionCheckRequest.getFuelLevel());
        conditionCheck.setInteriorStatus(carConditionCheckRequest.getInteriorStatus());
        conditionCheck.setDamageNote(carConditionCheckRequest.getDamageNote());
        conditionCheck.setImageFrontUrl(carConditionCheckRequest.getImageFrontUrl());
        conditionCheck.setImageRearUrl(carConditionCheckRequest.getImageRearUrl());
        conditionCheck.setImageLeftUrl(carConditionCheckRequest.getImageLeftUrl());
        conditionCheck.setImageRightUrl(carConditionCheckRequest.getImageRightUrl());
        conditionCheck.setImageOdoUrl(carConditionCheckRequest.getImageOdoUrl());
        conditionCheck.setImageFuelUrl(carConditionCheckRequest.getImageFuelUrl());
        conditionCheck.setImageOtherUrl(carConditionCheckRequest.getImageOtherUrl());

        return carConditionCheckMapper.mapToResponse(carConditionCheckRepository.save(conditionCheck));
    }

    public CarConditionCheckResponse acceptedCarConditionCheck(long id, CheckStatus checkStatus) {
        ConditionCheck conditionCheck = carConditionCheckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car condition check not found with id: " + id));
        conditionCheck.setStatus(checkStatus);
        conditionCheck.setChecked(true);
        return carConditionCheckMapper.mapToResponse(carConditionCheckRepository.save(conditionCheck));
    }
}
