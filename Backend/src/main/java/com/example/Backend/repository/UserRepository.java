package com.example.Backend.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import com.example.Backend.model.enums.CarStatus;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);

    Page<User> findAll(Pageable pageable);

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    Page<User> findByCreatedAtAfter(LocalDateTime createdAtAfter, Pageable pageable);

//    Page<User> searchUser(String name, String email, String phone, Pageable pageable);
}
