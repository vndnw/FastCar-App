package com.example.Backend.repository;

import com.example.Backend.model.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarImageRepository extends JpaRepository<CarImage, Long> {
    CarImage findCarImageByImageUrl(String imageUrl);
}
