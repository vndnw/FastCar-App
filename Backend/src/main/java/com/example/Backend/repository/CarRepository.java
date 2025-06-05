package com.example.Backend.repository;

import com.example.Backend.model.Car;
import com.example.Backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer> {
    Page<Car> findAll(Pageable pageable);
    Optional<Car> findById(long id);

    Car findCarByUser(User user);
    List<Car> findCarsByUser(User user);

}
