package com.example.Backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.BookingType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name  = "car_id")
    private Car car;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location pickupLocation;

    @Column(name = "pickup_time", nullable = false)
    private LocalDateTime pickupTime;

    private LocalDateTime returnTime;

    @Enumerated(EnumType.STRING)
    private BookingType type;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private double price;

    @Column(name = "discount_code")
    private String discountCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime startTime;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
