package com.example.Backend.service;

import com.example.Backend.dto.request.CarConditionCheckRequest;
import com.example.Backend.dto.response.CarConditionCheckResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarConditionCheckMapper;
import com.example.Backend.model.Booking;
import com.example.Backend.model.CarConditionCheck;
import com.example.Backend.model.enums.CheckStatus;
import com.example.Backend.model.enums.CheckType;
import com.example.Backend.repository.BookingRepository;
import com.example.Backend.repository.CarConditionCheckRepository;
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

    public CarConditionCheckResponse createCarConditionCheckBeforeRental(long bookingId , CarConditionCheckRequest carConditionCheckRequest) {

        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        CarConditionCheck carConditionCheck = new CarConditionCheck();
        carConditionCheck.setBooking(booking);
        carConditionCheck.setCar(booking.getCar());
        carConditionCheck.setType(CheckType.BEFORE_RENTAL);
        carConditionCheck.setOdometer(carConditionCheckRequest.getOdometer());
        carConditionCheck.setFuelLevel(carConditionCheckRequest.getFuelLevel());
        carConditionCheck.setInteriorStatus(carConditionCheckRequest.getInteriorStatus());
        carConditionCheck.setDamageNote(carConditionCheckRequest.getDamageNote());
        carConditionCheck.setImageFrontUrl(carConditionCheckRequest.getImageFrontUrl());
        carConditionCheck.setImageRearUrl(carConditionCheckRequest.getImageRearUrl());
        carConditionCheck.setImageLeftUrl(carConditionCheckRequest.getImageLeftUrl());
        carConditionCheck.setImageRightUrl(carConditionCheckRequest.getImageRightUrl());
        carConditionCheck.setImageOdoUrl(carConditionCheckRequest.getImageOdoUrl());
        carConditionCheck.setImageFuelUrl(carConditionCheckRequest.getImageFuelUrl());
        carConditionCheck.setImageOtherUrl(carConditionCheckRequest.getImageOtherUrl());
        carConditionCheck.setStatus(CheckStatus.PENDING);
        carConditionCheck.setChecked(false);

        return carConditionCheckMapper.mapToResponse(carConditionCheckRepository.save(carConditionCheck));
    }

    public CarConditionCheckResponse createCarConditionCheckAfterRental(long bookingId, CarConditionCheckRequest carConditionCheckRequest) {

        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        CarConditionCheck carConditionCheck = new CarConditionCheck();
        carConditionCheck.setBooking(booking);
        carConditionCheck.setCar(booking.getCar());
        carConditionCheck.setType(CheckType.AFTER_RENTAL);
        carConditionCheck.setOdometer(carConditionCheckRequest.getOdometer());
        carConditionCheck.setFuelLevel(carConditionCheckRequest.getFuelLevel());
        carConditionCheck.setInteriorStatus(carConditionCheckRequest.getInteriorStatus());
        carConditionCheck.setDamageNote(carConditionCheckRequest.getDamageNote());
        carConditionCheck.setImageFrontUrl(carConditionCheckRequest.getImageFrontUrl());
        carConditionCheck.setImageRearUrl(carConditionCheckRequest.getImageRearUrl());
        carConditionCheck.setImageLeftUrl(carConditionCheckRequest.getImageLeftUrl());
        carConditionCheck.setImageRightUrl(carConditionCheckRequest.getImageRightUrl());
        carConditionCheck.setImageOdoUrl(carConditionCheckRequest.getImageOdoUrl());
        carConditionCheck.setImageFuelUrl(carConditionCheckRequest.getImageFuelUrl());
        carConditionCheck.setImageOtherUrl(carConditionCheckRequest.getImageOtherUrl());
        carConditionCheck.setStatus(CheckStatus.PENDING);
        carConditionCheck.setChecked(false);

        return carConditionCheckMapper.mapToResponse(carConditionCheckRepository.save(carConditionCheck));
    }

    public List<CarConditionCheckResponse> getCarConditionCheckByBookingId(long bookingId) {
        List<CarConditionCheck> carConditionCheck = carConditionCheckRepository.findCarConditionCheckByBookingId(bookingId);
        if(carConditionCheck.isEmpty()) {
            throw new ResourceNotFoundException("Car condition checks not found for booking id: " + bookingId);
        }
        return carConditionCheck.stream()
                .map(carConditionCheckMapper::mapToResponse)
                .toList();
    }

    public Page<CarConditionCheckResponse> getAllCarConditionChecks(Pageable pageable) {
        return carConditionCheckRepository.findAll(pageable)
                .map(carConditionCheckMapper::mapToResponse);
    }

    public CarConditionCheckResponse getCarConditionCheckById(long id) {
        CarConditionCheck carConditionCheck = carConditionCheckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car condition check not found with id: " + id));
        return carConditionCheckMapper.mapToResponse(carConditionCheck);
    }
    
    public void deleteCarConditionCheckById(long id) {
        CarConditionCheck carConditionCheck = carConditionCheckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car condition check not found with id: " + id));
        carConditionCheckRepository.delete(carConditionCheck);
    }

    public void deleteCarConditionCheckByBookingId(long bookingId) {
        List<CarConditionCheck> carConditionCheck = carConditionCheckRepository.findCarConditionCheckByBookingId(bookingId);
        if(carConditionCheck.isEmpty()) {
            throw new ResourceNotFoundException("Car condition checks not found for booking id: " + bookingId);
        }
        carConditionCheckRepository.deleteAll(carConditionCheck);
    }

    public CarConditionCheckResponse updateCarConditionCheckByBookingId(long id, CarConditionCheckRequest carConditionCheckRequest) {
        CarConditionCheck carConditionCheck = carConditionCheckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car condition check not found with id: " + id));

        carConditionCheck.setOdometer(carConditionCheckRequest.getOdometer());
        carConditionCheck.setFuelLevel(carConditionCheckRequest.getFuelLevel());
        carConditionCheck.setInteriorStatus(carConditionCheckRequest.getInteriorStatus());
        carConditionCheck.setDamageNote(carConditionCheckRequest.getDamageNote());
        carConditionCheck.setImageFrontUrl(carConditionCheckRequest.getImageFrontUrl());
        carConditionCheck.setImageRearUrl(carConditionCheckRequest.getImageRearUrl());
        carConditionCheck.setImageLeftUrl(carConditionCheckRequest.getImageLeftUrl());
        carConditionCheck.setImageRightUrl(carConditionCheckRequest.getImageRightUrl());
        carConditionCheck.setImageOdoUrl(carConditionCheckRequest.getImageOdoUrl());
        carConditionCheck.setImageFuelUrl(carConditionCheckRequest.getImageFuelUrl());
        carConditionCheck.setImageOtherUrl(carConditionCheckRequest.getImageOtherUrl());

        return carConditionCheckMapper.mapToResponse(carConditionCheckRepository.save(carConditionCheck));
    }

    public CarConditionCheckResponse acceptedCarConditionCheck(long id, CheckStatus checkStatus) {
        CarConditionCheck carConditionCheck = carConditionCheckRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car condition check not found with id: " + id));
        carConditionCheck.setStatus(checkStatus);
        carConditionCheck.setChecked(true);
        return carConditionCheckMapper.mapToResponse(carConditionCheckRepository.save(carConditionCheck));
    }
}
