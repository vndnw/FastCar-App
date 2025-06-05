package com.example.Backend.service;

import com.example.Backend.dto.request.CarImageRequest;
import com.example.Backend.dto.response.CarImageResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarImageMapper;
import com.example.Backend.model.Car;
import com.example.Backend.model.CarImage;
import com.example.Backend.repository.CarImageRepository;
import com.example.Backend.repository.CarRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CarImageService {
    private final CarImageRepository carImageRepository;
    private final CarImageMapper carImageMapper;
    private final CarRepository carRepository;

    public CarImageService(CarImageRepository carImageRepository,
                           CarImageMapper carImageMapper,
                           CarRepository carRepository) {
        this.carImageRepository = carImageRepository;
        this.carImageMapper = carImageMapper;
        this.carRepository = carRepository;
    }

    public CarImageResponse createCarImage (long carId , CarImageRequest carImageRequest) {
        Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
        CarImage carImage = new CarImage();
        carImage.setImageUrl(carImageRequest.getImageUrl());
        carImage.setImageType(carImageRequest.getImageType());
        carImage.setCar(car);
        return carImageMapper.mapToResponse(carImageRepository.save(carImage));
    }

    public CarImage createCarImageByCar(Car car , CarImageRequest carImageRequest) {
        CarImage carImage = new CarImage();
        carImage.setImageUrl(carImageRequest.getImageUrl());
        carImage.setImageType(carImageRequest.getImageType());
        carImage.setCar(car);
        return carImageRepository.save(carImage);
    }

    public CarImage checkCarImage(Car car , CarImageRequest carImageRequest) {
        CarImage carImage = carImageRepository.findCarImageByImageUrl(carImageRequest.getImageUrl());
        if (carImage == null) {
            return createCarImageByCar(car , carImageRequest);
        }
        return carImage;
    }

    public CarImage getCarImageById(long carImageId) {
        return carImageRepository.findById(carImageId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found"));
    }

    public CarImageResponse updateCarImage (long carImageId , CarImageRequest carImageRequest) {
        CarImage carImage = carImageRepository.findById(carImageId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found"));
        carImage.setImageUrl(carImageRequest.getImageUrl());
        carImage.setImageType(carImageRequest.getImageType());
        return carImageMapper.mapToResponse(carImageRepository.save(carImage));
    }

    public CarImageResponse getCarImageByCarId (long carId) {
        return carImageMapper.mapToResponse(carImageRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found")));
    }

//    public CarImageResponse getCarImageByImageUrl (String imageUrl) {
//        return
//    }

    public void deleteCarImageByCarId (long carImageId) {
        carImageRepository.findById(carImageId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found"));
        carImageRepository.deleteById(carImageId);
    }

    public Page<CarImageResponse> getAllCarImages (Pageable pageable) {
        Page<CarImage> carImages = carImageRepository.findAll(pageable);
        if (carImages.getTotalElements() == 0) {
            throw new ResourceNotFoundException("No car images found");
        }
        return carImages.map(carImage -> carImageMapper.mapToResponse(carImage));
    }
}
