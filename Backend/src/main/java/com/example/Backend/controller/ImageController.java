package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.service.CloudinaryService;
import com.example.Backend.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/image")
public class ImageController {

    private final ImageService imageService;
    private final CloudinaryService cloudinaryService;

    public  ImageController(ImageService imageService,
                            CloudinaryService cloudinaryService) {
        this.imageService = imageService;
        this.cloudinaryService = cloudinaryService;
    }


    @PreAuthorize("hasRole('owner')")
    @PostMapping("/upload/car/{carId}")
    public ResponseEntity<?> createCarImage(@PathVariable("carId") long carId,@RequestParam("file") List<MultipartFile> files) {
        try {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                String image = cloudinaryService.uploadImage(file); // Gọi hàm upload từng file
                if (image != null) {
                    imageUrls.add(image);
                }
            }

            if (imageUrls.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No images uploaded successfully");
            }

            ResponseData<?> response = ResponseData.builder()
                    .status(200)
                    .message("Car images created successfully")
                    .data(imageService.createCarImage(carId, imageUrls))
                    .build();
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating car image: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/delete/car/{carId}")
    public ResponseEntity<?> deleteCarImage(@PathVariable("carId") long carId) {
        try {
            imageService.deleteImageByCarId(carId);
            ResponseData<?> response = ResponseData.builder()
                    .status(200)
                    .message("Car image deleted successfully")
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting car image: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImageById(@PathVariable("id") long id) {
        try {
            imageService.deleteImageById(id);
            ResponseData<?> response = ResponseData.builder()
                    .status(200)
                    .message("Image deleted successfully")
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting image: " + e.getMessage());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadImage(file);
            if (imageUrl == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Image upload failed");
            }
            ResponseData<String> response = ResponseData.<String>builder()
                    .status(200)
                    .message("Image uploaded successfully")
                    .data(imageUrl)
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image: " + e.getMessage());
        }
    }

}
