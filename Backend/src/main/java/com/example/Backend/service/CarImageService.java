package com.example.Backend.service;

import com.example.Backend.dto.request.CarImageRequest;
import com.example.Backend.dto.response.CarImageResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.CarImageMapper;
import com.example.Backend.model.Car;
import com.example.Backend.model.Image;
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
        Image image = new Image();
        image.setImageUrl(carImageRequest.getImageUrl());
        image.setImageType(carImageRequest.getImageType());
        image.setCar(car);
        return carImageMapper.mapToResponse(carImageRepository.save(image));
    }

    public Image createCarImageByCar(Car car , CarImageRequest carImageRequest) {
        Image image = new Image();
        image.setImageUrl(carImageRequest.getImageUrl());
        image.setImageType(carImageRequest.getImageType());
        image.setCar(car);
        return carImageRepository.save(image);
    }

    public Image checkCarImage(Car car , CarImageRequest carImageRequest) {
        Image image = carImageRepository.findCarImageByImageUrl(carImageRequest.getImageUrl());
        if (image == null) {
            return createCarImageByCar(car , carImageRequest);
        }
        return image;
    }

    public Image getCarImageById(long carImageId) {
        return carImageRepository.findById(carImageId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found"));
    }

    public CarImageResponse updateCarImage (long carImageId , CarImageRequest carImageRequest) {
        Image image = carImageRepository.findById(carImageId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found"));
        image.setImageUrl(carImageRequest.getImageUrl());
        image.setImageType(carImageRequest.getImageType());
        return carImageMapper.mapToResponse(carImageRepository.save(image));
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
        Page<Image> carImages = carImageRepository.findAll(pageable);
        if (carImages.getTotalElements() == 0) {
            throw new ResourceNotFoundException("No car images found");
        }
        return carImages.map(carImage -> carImageMapper.mapToResponse(carImage));
    }
}
