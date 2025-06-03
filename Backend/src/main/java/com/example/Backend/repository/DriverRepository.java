package com.example.Backend.repository;

import com.example.Backend.model.Driver;
import com.example.Backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Page<Driver> findAll(Pageable pageable);

    Optional<Driver> findByUser(User user);
//    @Query("SELECT d FROM Driver d WHERE d.status = com.example.Backend.model.enums.DriverStatus.available")
//    List<Driver> findAvailableDrivers();
    @Query("SELECT d FROM Driver d WHERE d.status = 'available'")
    List<Driver> findAvailableDrivers();

}
