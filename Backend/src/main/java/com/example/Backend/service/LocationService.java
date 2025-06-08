package com.example.Backend.service;

import com.example.Backend.dto.request.LocationRequest;
import com.example.Backend.dto.response.LocationResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.LocationMapper;
import com.example.Backend.model.Location;
import com.example.Backend.repository.LocationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class LocationService {
    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    public LocationService(LocationRepository locationRepository, LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    public Page<LocationResponse> getAllLocations(Pageable pageable) {
        Page<Location> locations = locationRepository.findAll(pageable);
        return locations.map(location -> locationMapper.mapToResponse(location));
    }

    public LocationResponse getLocationById(Long id) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        return locationMapper.mapToResponse(location);
    }

    public LocationResponse addLocation(LocationRequest locationRequest) {
        String street, ward, district, city, address;

        if (locationRequest.getAddress() != null && !locationRequest.getAddress().trim().isEmpty()) {
            Map<String, String> addressParts = parseAddress(locationRequest.getAddress());
            street = normalize(addressParts.get("street"));
            ward = normalize(addressParts.get("ward"));
            district = normalize(addressParts.get("district"));
            city = normalize(addressParts.get("city"));
        } else if (locationRequest.getStreet() != null && locationRequest.getWard() != null
                && locationRequest.getDistrict() != null && locationRequest.getCity() != null) {
            street = normalize(locationRequest.getStreet());
            ward = normalize(locationRequest.getWard());
            district = normalize(locationRequest.getDistrict());
            city = normalize(locationRequest.getCity());
        } else {
            throw new IllegalArgumentException("Yêu cầu location không hợp lệ: cần cung cấp địa chỉ hoặc đầy đủ các thành phần (street, ward, district, city)");
        }

        address = street + ", " + ward + ", " + district + ", " + city;

        Location location = Location.builder()
                .address(address)
                .street(street)
                .ward(ward)
                .district(district)
                .city(city)
                // .latitude(locationRequest.getLatitude())
                // .longitude(locationRequest.getLongitude())
                .build();

        return locationMapper.mapToResponse(locationRepository.save(location));
    }

    public Location createLocation(LocationRequest locationRequest) {
        String street, ward, district, city, address;

        if (locationRequest.getAddress() != null && !locationRequest.getAddress().trim().isEmpty()) {
            Map<String, String> addressParts = parseAddress(locationRequest.getAddress());
            street = normalize(addressParts.get("street"));
            ward = normalize(addressParts.get("ward"));
            district = normalize(addressParts.get("district"));
            city = normalize(addressParts.get("city"));
        } else if (locationRequest.getStreet() != null && locationRequest.getWard() != null
                && locationRequest.getDistrict() != null && locationRequest.getCity() != null) {
            street = normalize(locationRequest.getStreet());
            ward = normalize(locationRequest.getWard());
            district = normalize(locationRequest.getDistrict());
            city = normalize(locationRequest.getCity());
        } else {
            throw new IllegalArgumentException("Yêu cầu location không hợp lệ: cần cung cấp địa chỉ hoặc đầy đủ các thành phần (street, ward, district, city)");
        }

        address = street + ", " + ward + ", " + district + ", " + city;

        Location location = Location.builder()
                .address(address)
                .street(street)
                .ward(ward)
                .district(district)
                .city(city)
                // .latitude(locationRequest.getLatitude())
                // .longitude(locationRequest.getLongitude())
                .build();

        return locationRepository.save(location);
    }

    public Location checkLocation(LocationRequest locationRequest) {
        String address = "";
        if(locationRequest.getStreet() != null && locationRequest.getWard() != null && locationRequest.getDistrict() != null && locationRequest.getCity() != null) {
            String street = normalize(locationRequest.getStreet());
            String ward = normalize(locationRequest.getWard());
            String district = normalize(locationRequest.getDistrict());
            String city = normalize(locationRequest.getCity());
            address = street + ", " + ward + ", " + district + ", " + city;
        }else {
            address = locationRequest.getAddress();
        }
        Location location = locationRepository.findLocationByAddress(address);
        if (location == null) {
            return createLocation(locationRequest);
        }else return location;
    }


    public LocationResponse updateLocation(Long id, LocationRequest locationRequest) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        location.setAddress(locationRequest.getAddress());

//        location.setLongitude(locationRequest.getLongitude());
//        location.setLatitude(locationRequest.getLatitude());
        return locationMapper.mapToResponse(locationRepository.save(location));
    }

    public void deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Location not found");
        }
        locationRepository.deleteById(id);
    }


    private String normalize(String input) {
        if (input == null) return null;
        // Xoá khoảng trắng thừa, viết thường toàn bộ, sau đó viết hoa chữ cái đầu
        String cleaned = input.trim().toLowerCase().replaceAll("\\s+", " ");
        String[] words = cleaned.split(" ");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (!word.isBlank()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }

        return result.toString().trim();
    }

    private Map<String , String> parseAddress(String fullAddress) {
        String[] parts = fullAddress.split(",");
        Map<String, String> address = new HashMap<>();

        if (parts.length >= 4) {
            address.put("street", parts[0].trim());
            address.put("ward", parts[1].trim());
            address.put("district", parts[2].trim());
            address.put("city", parts[3].trim());
//            address.setStreet(parts[0].trim());
//            address.setWard(parts[1].trim());
//            address.setDistrict(parts[2].trim());
//            address.setCity(parts[3].trim());
        } else {
            throw new IllegalArgumentException("Invalid address format. Expected format: 'Street, Ward, District, City'");
        }
        return address;
    }

    private Map<String, String> extractCoordinates(String address) {
        Map<String, String> coordinates = new HashMap<>();

        // cập nhật phương thức để trích xuất tọa độ từ địa chỉ update sau giờ lười chưa bt làm
        // Giả sử địa chỉ có định dạng "Latitude, Longitude"

        String[] parts = address.split(",");
        if (parts.length >= 2) {
            coordinates.put("latitude", parts[0].trim());
            coordinates.put("longitude", parts[1].trim());
        } else {
            throw new IllegalArgumentException("Invalid address format for coordinates. Expected format: 'Latitude, Longitude'");
        }
        return coordinates;
    }
}
