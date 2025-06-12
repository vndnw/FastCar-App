package com.example.Backend.repository;

import com.example.Backend.model.CarConditionCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarConditionCheckRepository extends JpaRepository<CarConditionCheck, Long>{
    List<CarConditionCheck> findCarConditionCheckByBookingId(long bookingId);

    boolean existsByBookingId(long bookingId);

    Page<CarConditionCheck> findAll(Pageable pageable);

}
