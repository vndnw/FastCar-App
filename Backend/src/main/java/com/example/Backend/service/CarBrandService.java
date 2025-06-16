package com.example.Backend.service;

import com.example.Backend.dto.request.CarBrandRequest;
import com.example.Backend.dto.response.CarBrandResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarBrandMapper;
import com.example.Backend.model.Brand;
import com.example.Backend.repository.CarBrandRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class CarBrandService {

    private final CarBrandRepository carBrandRepository;
    private final CarBrandMapper carBrandMapper;

    public CarBrandService(CarBrandRepository carBrandRepository, CarBrandMapper carBrandMapper) {
        this.carBrandRepository = carBrandRepository;
        this.carBrandMapper = carBrandMapper;
    }

    public CarBrandResponse createCarBrand(@RequestBody CarBrandRequest carBrandRequest) {
        Brand brand = Brand.builder()
                .logo(carBrandRequest.getLogo())
                .name(carBrandRequest.getName())
                .description(carBrandRequest.getDescription())
                .build();
        return carBrandMapper.mapToResponse(carBrandRepository.save(brand));
    }

    public CarBrandResponse updateCarBrand( long carBrandId, CarBrandRequest carBrandRequest) {
        Brand brand = carBrandRepository.findById(carBrandId).orElseThrow(()->new ResourceNotFoundException("CarBrand not found"));
        brand.setName(carBrandRequest.getName());
        brand.setDescription(carBrandRequest.getDescription());
        brand.setLogo(carBrandRequest.getLogo());
        return carBrandMapper.mapToResponse(carBrandRepository.save(brand));
    }

    public void deleteCarBrand(long carBrandId) {
        Brand brand = carBrandRepository.findById(carBrandId).orElseThrow(()->new ResourceNotFoundException("CarBrand not found"));
        carBrandRepository.deleteById(carBrandId);
    }

    public Page<CarBrandResponse> getAllCarBrands(Pageable pageable) {
        Page<Brand> carBrands = carBrandRepository.findAll(pageable);
        if(carBrands.getTotalElements() < 0) {
            throw new ResourceNotFoundException("No car brands found");
        }
        return carBrands.map(brand -> carBrandMapper.mapToResponse(brand));
    }

    public CarBrandResponse getCarBrandById(long carBrandId) {
        Brand brand = carBrandRepository.findById(carBrandId).orElseThrow(()->new ResourceNotFoundException("CarBrand not found"));
        return carBrandMapper.mapToResponse(brand);
    }
}
