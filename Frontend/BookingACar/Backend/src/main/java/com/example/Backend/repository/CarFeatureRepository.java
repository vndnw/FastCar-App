package com.example.Backend.repository;

import com.example.Backend.model.CarFeature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarFeatureRepository extends JpaRepository<CarFeature, Long> {
}
