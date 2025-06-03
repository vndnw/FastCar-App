package com.example.Backend.service;

import com.example.Backend.dto.request.DriverRequest;
import com.example.Backend.dto.response.DriverResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.DriverMapper;
import com.example.Backend.model.Driver;
import com.example.Backend.model.User;
import com.example.Backend.repository.DriverRepository;
import com.example.Backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;
    private final UserRepository userRepository;

    public DriverService(DriverRepository driverRepository, DriverMapper driverMapper, UserRepository userRepository) {
        this.driverRepository = driverRepository;
        this.driverMapper = driverMapper;
        this.userRepository = userRepository;
    }

    public Page<DriverResponse> getAllDriver(Pageable pageable) {
        Page<Driver> drivers = driverRepository.findAll(pageable);
        return drivers.map(driver -> driverMapper.mapToResponse(driver));
    }

    public DriverResponse createDriver(long userId , DriverRequest driverRequest) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));

        Driver driver = Driver.builder()
                .user(user)
                .licenseNumber(driverRequest.getLicenseNumber())
                .status(driverRequest.getStatus())
                .build();
        return driverMapper.mapToResponse(driverRepository.save(driver));
    }

    public DriverResponse updateDriver(long userId, long driverId , DriverRequest driverRequest) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));

        Driver driver = driverRepository.findById(driverId).orElseThrow(()-> new ResourceNotFoundException("Driver Not Found"));
        driver.setLicenseNumber(driverRequest.getLicenseNumber());
        driver.setStatus(driverRequest.getStatus());
        driver.setLicenseNumber(String.valueOf(driverRequest.getLicenseNumber()));

        return driverMapper.mapToResponse(driverRepository.save(driver));
    }

    public void deleteDriver(long userId, long driverId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));
        Driver driver = driverRepository.findById(driverId).orElseThrow(()-> new ResourceNotFoundException("Driver Not Found"));
        driverRepository.deleteById(driverId);
    }

    public DriverResponse getDriver(long userId, long driverId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));
        Driver drive = driverRepository.findById(driverId).orElseThrow(()-> new ResourceNotFoundException("Driver Not Found"));
        return driverMapper.mapToResponse(drive);
    }

    public DriverResponse getDriverByUserId(long userId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));
        Driver drive = driverRepository.findByUser(user).orElseThrow(()-> new ResourceNotFoundException("Driver Not Found"));
        return driverMapper.mapToResponse(drive);
    }
}
