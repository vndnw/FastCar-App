package com.example.Backend.service;

import com.example.Backend.dto.request.LocationRequest;
import com.example.Backend.dto.response.LocationResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.LocationMapper;
import com.example.Backend.model.Location;
import com.example.Backend.repository.LocationRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class LocationService {
    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    public LocationService(LocationRepository locationRepository, LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    public Page<LocationResponse> getAllLocations(Pageable pageable) {
        return locationRepository.findAll(pageable)
                .map(locationMapper::mapToResponse);
    }

    public LocationResponse getLocationById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        return locationMapper.mapToResponse(location);
    }

    @Transactional
    public LocationResponse addLocation(LocationRequest locationRequest) {
        Location location = buildLocationEntity(locationRequest);
        return locationMapper.mapToResponse(locationRepository.save(location));
    }

    @Transactional
    public Location createLocation(LocationRequest locationRequest) {
        Location location = buildLocationEntity(locationRequest);
        return locationRepository.save(location);
    }

    @Transactional
    public Location checkLocation(LocationRequest request) {
        String address = buildNormalizedAddress(request);

        if (request.getLatitude() != null && request.getLongitude() != null) {
            Location existing = locationRepository
                    .findByAddressAndLatitudeAndLongitude(address, request.getLatitude(), request.getLongitude());
            return existing != null ? existing : createLocation(request);
        }

        Location existing = locationRepository.findLocationByAddress(address);
        return existing != null ? existing : createLocation(request);
    }
    public Location checkLocationA(LocationRequest request) {
        String address = buildNormalizedAddress(request);

        if (request.getLatitude() != null && request.getLongitude() != null) {
            Location existing = locationRepository
                    .findByAddressAndLatitudeAndLongitude(address, request.getLatitude(), request.getLongitude());
            return existing != null ? existing : buildLocationEntity(request);
        }

        Location existing = locationRepository.findLocationByAddress(address);
        return existing != null ? existing : buildLocationEntity(request);
    }


    public LocationResponse updateLocation(Long id, LocationRequest locationRequest) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        Location updated = buildLocationEntity(locationRequest);
        location.setAddress(updated.getAddress());
        location.setStreet(updated.getStreet());
        location.setWard(updated.getWard());
        location.setDistrict(updated.getDistrict());
        location.setCity(updated.getCity());
        location.setLatitude(updated.getLatitude());
        location.setLongitude(updated.getLongitude());

        return locationMapper.mapToResponse(locationRepository.save(location));
    }

    public void deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Location not found");
        }
        locationRepository.deleteById(id);
    }


    public Location buildLocationEntity(LocationRequest request) {
        String normalizedAddress = buildNormalizedAddress(request);

        log.info("Normalized address: " + request);

        // Nếu người dùng chỉ nhập address, thì tách ra các phần
        String street = request.getStreet();
        String ward = request.getWard();
        String district = request.getDistrict();
        String city = request.getCity();

        if (street == null || ward == null || district == null || city == null) {
            Map<String, String> parts = parseAddress(normalizedAddress);
            street = parts.get("street");
            ward = parts.get("ward");
            district = parts.get("district");
            city = parts.get("city");
        }

        Location.LocationBuilder builder = Location.builder()
                .address(normalizedAddress)
                .street(normalize(street))
                .ward(normalize(ward))
                .district(normalize(district))
                .city(normalize(city));

        // Nếu có tọa độ thì set thêm
        if (request.getLatitude() != null && request.getLongitude() != null) {
            builder.latitude(request.getLatitude());
            builder.longitude(request.getLongitude());
//            builder.geom(geometryFactory.createPoint(
//                    new Coordinate(request.getLongitude(), request.getLatitude())
//            ));
        }
        return builder.build();
    }

    private String buildNormalizedAddress(LocationRequest request) {
        if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
            Map<String, String> parts = parseAddress(request.getAddress());
            return normalize(parts.get("street")) + ", " +
                    normalize(parts.get("ward")) + ", " +
                    normalize(parts.get("district")) + ", " +
                    normalize(parts.get("city"));
        } else if (request.getStreet() != null && request.getWard() != null &&
                request.getDistrict() != null && request.getCity() != null) {
            return normalize(request.getStreet()) + ", " +
                    normalize(request.getWard()) + ", " +
                    normalize(request.getDistrict()) + ", " +
                    normalize(request.getCity());
        } else {
            throw new IllegalArgumentException("Địa chỉ không hợp lệ: cần đủ thông tin.");
        }
    }

    private Map<String, String> parseAddress(String fullAddress) {
        String[] parts = fullAddress.split(",");
        if (parts.length < 4) {
            throw new IllegalArgumentException("Invalid address format. Expected format: 'Street, Ward, District, City'");
        }
        Map<String, String> address = new HashMap<>();
        address.put("street", parts[0].trim());
        address.put("ward", parts[1].trim());
        address.put("district", parts[2].trim());
        address.put("city", parts[3].trim());
        return address;
    }

    private String normalize(String input) {
        if (input == null) return "";
        String cleaned = input.trim().toLowerCase().replaceAll("\\s+", " ");
        StringBuilder result = new StringBuilder();
        for (String word : cleaned.split(" ")) {
            if (!word.isBlank()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }
        return result.toString().trim();
    }

    // Optional future use:
    private Map<String, String> extractCoordinates(String address) {
        String[] parts = address.split(",");
        if (parts.length >= 2) {
            Map<String, String> coordinates = new HashMap<>();
            coordinates.put("latitude", parts[0].trim());
            coordinates.put("longitude", parts[1].trim());
            return coordinates;
        } else {
            throw new IllegalArgumentException("Invalid address format for coordinates. Expected format: 'Latitude, Longitude'");
        }
    }
}
