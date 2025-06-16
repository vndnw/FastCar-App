package com.example.Backend.repository;

import com.example.Backend.model.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarBrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findById(long id);
    Page<Brand> findAll(Pageable pageable);
}
