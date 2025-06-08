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
    private final LocationMapper locationMapper;

    @Autowired
    public BookingMapper(UserMapper userMapper, CarMapper carMapper, DriverMapper driverMapper, LocationMapper locationMapper)  {
        this.userMapper = userMapper;
        this.carMapper = carMapper;
        this.driverMapper = driverMapper;
        this.locationMapper = locationMapper;
    }

    public BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setBookingCode(booking.getBookingCode());
        // Map nested objects using their respective mappers
        UserResponse userResponse = userMapper.mapToResponse(booking.getUser());
        response.setUser(userResponse);

        if (booking.getDriver() != null) {
            DriverResponse driverResponse = driverMapper.mapToResponse(booking.getDriver());
            response.setDriver(driverResponse);
        }
        CarResponse carResponse = carMapper.mapToResponse(booking.getCar());
        response.setCar(carResponse);
        response.setLocation(locationMapper.mapToResponse(booking.getPickupLocation()));
        response.setPickupTime(booking.getPickupTime());
        response.setReturnTime(booking.getReturnTime());
        response.setType(booking.getType());
        response.setStatus(booking.getStatus());
        response.setRentalPrice(booking.getRentalPrice());
        response.setReservationFee(booking.getReservationFee());
        response.setDepositAmount(booking.getDepositAmount());
        response.setTotalAmount(booking.getTotalAmount());
        response.setTotalPaid(booking.getTotalPaid());
        response.setTotalRefunded(booking.getTotalRefunded());
        response.setTotalExtraCharges(booking.getTotalExtraCharges());
        response.setTotalDiscount(booking.getTotalDiscount());
        response.setTotalLateFee(booking.getTotalLateFee());
        response.setDiscountCode(booking.getDiscountCode());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }
}
