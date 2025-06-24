package com.example.Backend.service;

import com.example.Backend.dto.response.ImageResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.ImageMapper;
import com.example.Backend.model.Car;
import com.example.Backend.model.Image;
import com.example.Backend.repository.CarImageRepository;
import com.example.Backend.repository.CarRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService {
    private final CarImageRepository carImageRepository;
    private final ImageMapper imageMapper;
    private final CarRepository carRepository;

    public ImageService(CarImageRepository carImageRepository,
                        ImageMapper imageMapper,
                        CarRepository carRepository) {
        this.carImageRepository = carImageRepository;
        this.imageMapper = imageMapper;
        this.carRepository = carRepository;
    }

    public boolean createCarImage (long carId , List<String> imageUrls) {
        try{
            Car car = carRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("Car not found"));
            imageUrls.forEach(imageUrl -> {
                Image image = new Image();
                image.setImageUrl(imageUrl);
                image.setCar(car);
                carImageRepository.save(image);
            });
            return true;
        }catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Car not found with ID: " + carId);
        } catch (Exception e) {
            throw new RuntimeException("Error creating car images: " + e.getMessage());
        }
    }

    public Image createCarImageByCar(Car car , String carImageRequest) {
        Image image = new Image();
        image.setImageUrl(carImageRequest);
        image.setCar(car);
        return carImageRepository.save(image);
    }

    public Image getCarImageById(long carImageId) {
        return carImageRepository.findById(carImageId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found"));
    }

    public ImageResponse updateImage (long carImageId , @NotNull String carImageRequest) {
        Image image = carImageRepository.findById(carImageId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found"));
        image.setImageUrl(carImageRequest);
        return imageMapper.mapToResponse(carImageRepository.save(image));
    }

    public ImageResponse getCarImageByCarId (long carId) {
        return imageMapper.mapToResponse(carImageRepository.findById(carId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found")));
    }

    public void deleteImageById (long carImageId) {
        carImageRepository.findById(carImageId).orElseThrow(()-> new ResourceNotFoundException("CarImage not found"));
        carImageRepository.deleteById(carImageId);
    }

    public Page<ImageResponse> getAllCarImages (Pageable pageable) {
        Page<Image> carImages = carImageRepository.findAll(pageable);
        if (carImages.getTotalElements() == 0) {
            throw new ResourceNotFoundException("No car images found");
        }
        return carImages.map(imageMapper::mapToResponse);
    }

    public void deleteImageByCarId(long carId) {
        List<Image> images = carImageRepository.findAllByCarId(carId);
        if (images.isEmpty()) {
            throw new ResourceNotFoundException("No images found for car with ID: " + carId);
        }
        images.forEach(image -> carImageRepository.deleteById(image.getId()));
    }
}
