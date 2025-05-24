package com.example.Backend.service;

import com.example.Backend.model.Car;
import org.springframework.data.repository.Repository;

interface CarRepository extends Repository<Car, Long> {
}
