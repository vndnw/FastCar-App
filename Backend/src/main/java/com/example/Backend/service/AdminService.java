package com.example.Backend.service;

import com.example.Backend.dto.response.*;
import com.example.Backend.mapper.BookingMapper;
import com.example.Backend.mapper.CarMapper;
import com.example.Backend.mapper.DocumentMapper;
import com.example.Backend.mapper.UserMapper;
import com.example.Backend.model.User;
import com.example.Backend.model.enums.BookingStatus;
import com.example.Backend.model.enums.CarStatus;
import com.example.Backend.model.enums.DocumentStatus;
import com.example.Backend.repository.BookingRepository;
import com.example.Backend.repository.CarRepository;
import com.example.Backend.repository.DocumentRepository;
import com.example.Backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;
    private final DocumentRepository documentRepository;
    private final UserMapper userMapper;
    private final BookingMapper bookingMapper;
    private final CarMapper carMapper;
    private final DocumentMapper documentMapper;

    public AdminService(UserRepository userRepository,
                        CarRepository carRepository,
                        BookingRepository bookingRepository,
                        UserMapper userMapper,
                        BookingMapper bookingMapper,
                        CarMapper carMapper,
                        DocumentRepository documentRepository,
                        DocumentMapper documentMapper) {
        this.userRepository = userRepository;
        this.carRepository = carRepository;
        this.bookingRepository = bookingRepository;
        this.userMapper = userMapper;
        this.bookingMapper = bookingMapper;
        this.carMapper = carMapper;
        this.documentRepository = documentRepository;
        this.documentMapper = documentMapper;
    }

    @Transactional
    public DashboardResponse getDashboardStatistics() {
        long totalUsers = userRepository.count();
        long totalCars = carRepository.count();
        long totalBookings = bookingRepository.count();
        BigDecimal totalRevenue = bookingRepository.calculateTotalRevenue().orElse(BigDecimal.ZERO);
        long carsPending = carRepository.countByStatus(CarStatus.PENDING);
        long documentsPending = documentRepository.countByStatus(DocumentStatus.PENDING);

        List<BookingStatus> statusesToCount = List.of(
                BookingStatus.WAITING_REFUND,
                BookingStatus.WAITING_EXTRA_CHARGE
        );

        long bookingsAwaitingAction = bookingRepository.countByStatusIn(statusesToCount);

        return DashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalCars(totalCars)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .carsPendingApproval(carsPending)
                .documentsPendingApproval(documentsPending)
                .bookingsAwaitingAction(bookingsAwaitingAction)
                .build();
    }

    public Page<BookingResponse> getBookingsAwaitingAction(Pageable pageable) {
        List<BookingStatus> statusesToCount = List.of(
                BookingStatus.WAITING_REFUND,
                BookingStatus.WAITING_EXTRA_CHARGE
        );
        return bookingRepository.findByStatusIn(statusesToCount, pageable)
                .map(bookingMapper::mapToResponse);
    }

    public Page<CarResponse> getCarsPendingApproval(Pageable pageable) {
        return carRepository.findByStatus(CarStatus.PENDING, pageable)
                .map(carMapper::mapToResponse);
    }

    public Page<DocumentResponse> getDocumentsPendingApproval(Pageable pageable) {
        return documentRepository.findByStatus(DocumentStatus.PENDING, pageable)
                .map(documentMapper::mapToResponse);
    }

    public Page<UserResponse> getNewUsers(LocalDateTime since, Pageable pageable) {
        Page<User> newUsersPage = userRepository.findByCreatedAtAfter(since, pageable);
        return newUsersPage.map(userMapper::mapToResponse);
    }

    public Page<UserResponse> getNewUsersInLast7Days(Pageable pageable) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return this.getNewUsers(sevenDaysAgo, pageable);
    }
}
