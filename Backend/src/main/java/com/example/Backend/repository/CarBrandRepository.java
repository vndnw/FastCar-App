package com.example.Backend.repository;

import com.example.Backend.model.Car;
import com.example.Backend.model.CarBrand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarBrandRepository extends JpaRepository<CarBrand, Long> {
    Optional<CarBrand> findById(long id);
    Page<CarBrand> findAll(Pageable pageable);
}
