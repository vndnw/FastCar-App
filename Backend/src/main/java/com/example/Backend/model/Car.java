package com.example.Backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.Backend.model.enums.CarStatus;
import com.example.Backend.model.enums.CarTransmission;
import com.example.Backend.model.enums.FuelType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "carBrand_id")
    private CarBrand carBrand;

    private String model;

    private int year;

    private int seats;

    @Enumerated(EnumType.STRING)
    private CarTransmission transmission;

    private String licensePlate;

    private BigDecimal pricePerHour;
    private BigDecimal pricePer4Hour;
    private BigDecimal pricePer8Hour;
    private BigDecimal pricePer12Hour;
    private BigDecimal pricePer24Hour;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    private String fuelConsumption;//  fuel_consumption/100km

    @Enumerated(EnumType.STRING)
    private CarStatus status;

    private String color;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "car_image_id")
    private List<CarImage> images;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "car_features",
        joinColumns = @JoinColumn(name = "car_id"),
            inverseJoinColumns = @JoinColumn(name = "car_feature_id"))
    private List<CarFeature> features;

    private BigDecimal penaltyLateReturn; //   price/1hour

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

