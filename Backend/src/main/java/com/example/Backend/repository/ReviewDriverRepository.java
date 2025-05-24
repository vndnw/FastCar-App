package com.example.Backend.repository;

import com.example.Backend.model.ReviewDriver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewDriverRepository extends JpaRepository<ReviewDriver, Long> {
}
