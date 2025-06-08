package com.example.Backend.dto.response;

import com.example.Backend.model.Location;
import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.BookingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class BookingResponse {
    private long id;
    private String bookingCode;
    private UserResponse user;
    private DriverResponse driver;
    private CarResponse car;
    private LocationResponse location;
    private LocalDateTime pickupTime;
    private LocalDateTime returnTime;
    private BookingType type;
    private BookingStatus status;
    private BigDecimal rentalPrice;
    private BigDecimal reservationFee;
    private BigDecimal depositAmount;
    private BigDecimal totalAmount;
    private BigDecimal totalPaid;
    private BigDecimal totalRefunded;
    private BigDecimal totalExtraCharges;
    private BigDecimal totalDiscount;
    private BigDecimal totalLateFee;
    private String discountCode;
    private LocalDateTime createdAt;
}
