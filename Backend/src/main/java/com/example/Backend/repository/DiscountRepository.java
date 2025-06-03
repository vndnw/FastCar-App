package com.example.Backend.repository;

import com.example.Backend.model.Discount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    Optional<Discount> findById(Long id);
    Optional<Discount> findByName(String name);
    Page<Discount> findAll(Pageable pageable);
}
