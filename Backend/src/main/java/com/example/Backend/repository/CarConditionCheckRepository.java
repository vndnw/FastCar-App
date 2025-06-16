package com.example.Backend.repository;

import com.example.Backend.model.ConditionCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarConditionCheckRepository extends JpaRepository<ConditionCheck, Long>{
    List<ConditionCheck> findCarConditionCheckByBookingId(long bookingId);

    boolean existsByBookingId(long bookingId);

    Page<ConditionCheck> findAll(Pageable pageable);

}
