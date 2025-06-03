package com.example.Backend.mapper;

import com.example.Backend.dto.response.BookingResponse;
import com.example.Backend.dto.response.CarResponse;
import com.example.Backend.dto.response.DriverResponse;
import com.example.Backend.dto.response.UserResponse;
import com.example.Backend.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingMapper {

    private final UserMapper userMapper;
    private final CarMapper carMapper;
    private final DriverMapper driverMapper;

    @Autowired
    public BookingMapper(UserMapper userMapper, CarMapper carMapper, DriverMapper driverMapper) {
        this.userMapper = userMapper;
        this.carMapper = carMapper;
        this.driverMapper = driverMapper;
    }

    public BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());

        // Map nested objects using their respective mappers
        UserResponse userResponse = userMapper.mapToResponse(booking.getUser());
        response.setUser(userResponse);

        if (booking.getDriver() != null) {
            DriverResponse driverResponse = driverMapper.mapToResponse(booking.getDriver());
            response.setDriver(driverResponse);
        }        CarResponse carResponse = carMapper.mapToResponse(booking.getCar());
        response.setCar(carResponse);        response.setPickupLocation(booking.getPickupLocation());
        response.setPickupTime(booking.getPickupTime());
        response.setReturnTime(booking.getReturnTime());
        response.setType(booking.getType());
        response.setStatus(booking.getStatus());        response.setPrice(booking.getPrice());
        response.setDiscountCode(booking.getDiscountCode());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }
}
