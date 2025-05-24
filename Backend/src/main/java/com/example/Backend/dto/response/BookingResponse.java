package com.example.Backend.dto.response;

import com.example.Backend.model.Car;
import com.example.Backend.model.Driver;
import com.example.Backend.model.User;
import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.BookingType;
import jakarta.persistence.*;
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
public class BookingResponse {
    private long id;
    private User user;
    private Driver driver;
    private Car car;
    private String pickupLocation;
    private LocalDateTime pickupTime;
    private BookingType type;
    private BookingStatus status;
    private double price;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime createdAt;
}
