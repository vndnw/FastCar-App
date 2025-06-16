package com.example.Backend.repository;

import com.example.Backend.model.Car;
import com.example.Backend.model.User;
import com.example.Backend.model.enums.CarStatus;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer> , JpaSpecificationExecutor<Car> {
    Page<Car> findAll(@NotNull Pageable pageable);
    Optional<Car> findById(long id);

    long countByStatus(@NotNull CarStatus status);

    Car findCarByUser(User user);
    List<Car> findCarsByUser(User user);
    List<Car> findAllCarsByLocation_District(String location_District);

    Page<Car> findByStatus(CarStatus status, Pageable pageable);

}
