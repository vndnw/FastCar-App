package com.example.Backend.model;

import java.time.LocalDateTime;
import java.util.List;

import com.example.Backend.model.enums.FuelType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.Backend.model.enums.VehicleStatus;

import lombok.Builder;
import lombok.Data;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "Cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String model;

    @ManyToOne
    @JoinColumn(name = "carBrand_id")
    private CarBrand carBrand;

    private String licensePlate;

    private int capacity;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private List<String> imageUrl;
    
    private double basePrice; // Base price per day for the car

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
