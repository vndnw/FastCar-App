package com.example.Backend.repository;

import com.example.Backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarImageRepository extends JpaRepository<Image, Long> {
    Image findCarImageByImageUrl(String imageUrl);
    List<Image> findAllByCarId(long carId);
}
