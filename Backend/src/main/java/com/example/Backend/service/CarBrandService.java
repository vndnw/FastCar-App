package com.example.Backend.service;

import com.example.Backend.dto.request.CarBrandRequest;
import com.example.Backend.dto.response.CarBrandResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarBrandMapper;
import com.example.Backend.model.CarBrand;
import com.example.Backend.repository.CarBrandRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CarBrandService {

    private final CarBrandRepository carBrandRepository;
    private final CarBrandMapper carBrandMapper;

    public CarBrandService(CarBrandRepository carBrandRepository, CarBrandMapper carBrandMapper) {
        this.carBrandRepository = carBrandRepository;
        this.carBrandMapper = carBrandMapper;
    }

    public CarBrandResponse createCarBrand(CarBrandRequest carBrandRequest) {
        CarBrand carBrand = CarBrand.builder()
                .logo(carBrandRequest.getLogo())
                .name(carBrandRequest.getName())
                .description(carBrandRequest.getDescription())
                .build();
        return carBrandMapper.mapToResponse(carBrandRepository.save(carBrand));
    }

    public CarBrandResponse updateCarBrand( long carBrandId, CarBrandRequest carBrandRequest) {
        CarBrand carBrand = carBrandRepository.findById(carBrandId).orElseThrow(()->new ResourceNotFoundException("CarBrand not found"));
        carBrand.setName(carBrandRequest.getName());
        carBrand.setDescription(carBrandRequest.getDescription());
        carBrand.setLogo(carBrandRequest.getLogo());
        return carBrandMapper.mapToResponse(carBrandRepository.save(carBrand));
    }

    public void deleteCarBrand(long carBrandId) {
        CarBrand carBrand = carBrandRepository.findById(carBrandId).orElseThrow(()->new ResourceNotFoundException("CarBrand not found"));
        carBrandRepository.deleteById(carBrandId);
    }

    public Page<CarBrandResponse> getAllCarBrands(Pageable pageable) {
        Page<CarBrand> carBrands = carBrandRepository.findAll(pageable);
        if(carBrands.getTotalElements() < 0) {
            throw new ResourceNotFoundException("No car brands found");
        }
        return carBrands.map(carBrand -> carBrandMapper.mapToResponse(carBrand));
    }

    public CarBrandResponse getCarBrandById(long carBrandId) {
        CarBrand carBrand = carBrandRepository.findById(carBrandId).orElseThrow(()->new ResourceNotFoundException("CarBrand not found"));
        return carBrandMapper.mapToResponse(carBrand);
    }
}
