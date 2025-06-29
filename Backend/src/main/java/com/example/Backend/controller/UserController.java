package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.*;
import com.example.Backend.dto.response.BankInformationResponse;
import com.example.Backend.model.enums.DocumentType;
import com.example.Backend.service.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final CarService carService;
    private final BookingService bookingService;
    private final BankInformationService bankInformationService;
    private final CloudinaryService cloudinaryService;
    private final DocumentService documentService;

    public UserController(UserService userService,
                          CarService carService,
                          BookingService bookingService,
                          BankInformationService bankInformationService,
                          CloudinaryService cloudinaryService,
                          DocumentService documentService) {
        this.userService = userService;
        this.carService = carService;
        this.bookingService = bookingService;
        this.bankInformationService = bankInformationService;
        this.cloudinaryService = cloudinaryService;
        this.documentService = documentService;
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping
    public ResponseEntity<?> getAllUsers(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.getAllUsers(pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.getMe())
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.getUserById(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequest userRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Success")
                .data(userService.createUser(userRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('admin')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable long id, @RequestBody UpdateUserRequest userRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.updateUser(id, userRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    // Helper method để validate và upload ảnh
    private String uploadAndValidateImage(MultipartFile imageFile, String fieldName) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new RuntimeException( "File " + fieldName + " không được để trống.");
        }
        if (!Objects.requireNonNull(imageFile.getContentType()).startsWith("image/")) {
            throw new RuntimeException( "File " + fieldName + " phải là hình ảnh.");
        }
        if (imageFile.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException(
                    "Kích thước file " + fieldName + " ( " + imageFile.getOriginalFilename() + " ) vượt quá giới hạn " + (MAX_FILE_SIZE / (1024 * 1024)) + "MB.");
        }

        try {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            if (imageUrl == null) {
                // Điều này xảy ra nếu uploadImage không ném lỗi nhưng trả về null
                throw new RuntimeException( "Không thể tải lên file " + fieldName + ". Vui lòng thử lại.");
            }
            return imageUrl;
        } catch (Exception e) {
            // Xử lý các ngoại lệ trong quá trình tải lên (ví dụ: lỗi mạng, lỗi Cloudinary)
            System.err.println("Lỗi khi tải lên file " + fieldName + ": " + e.getMessage());
            throw new RuntimeException("Lỗi khi tải lên file " + fieldName + ": " + e.getMessage(), e);
        }
    }

    @PostMapping("/{id}/add-cccd")
    public ResponseEntity<ResponseData<?>> addCccd(
            @PathVariable long id,
            @RequestPart("documentRequest") DocumentRequest cccdRequest, // Đặt tên khớp với frontend
            @RequestPart("imageFront") MultipartFile imageFront,
            @RequestPart("imageBack") MultipartFile imageBack) {

        // Tải lên và validate ảnh mặt trước
        String imageFrontUrl = uploadAndValidateImage(imageFront, "ảnh mặt trước CCCD");
        // Tải lên và validate ảnh mặt sau
        String imageBackUrl = uploadAndValidateImage(imageBack, "ảnh mặt sau CCCD");

        cccdRequest.setImageFrontUrl(imageFrontUrl);
        cccdRequest.setImageBackUrl(imageBackUrl);
        cccdRequest.setDocumentType(DocumentType.CCCD); // Đảm bảo enum DocumentType được định nghĩa

        ResponseData<?> responseData = ResponseData.builder()
                .status(HttpStatus.CREATED.value()) // Sử dụng value() để nhất quán
                .message("Đã thêm CCCD thành công")
                .data(documentService.createDocumentUser(id, cccdRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/cccd")
    public ResponseEntity<ResponseData<?>> getCccdByUserId(@PathVariable long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Lấy CCCD thành công")
                .data(documentService.getDocumentByUserIdAndDocumentType(id, DocumentType.CCCD))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("/{id}/update-cccd")
    public ResponseEntity<ResponseData<?>> updateCccd(
            @PathVariable long id,
            @RequestPart("documentRequest")  DocumentRequest cccdRequest, // Đặt tên khớp với frontend
            @RequestPart("imageFront") MultipartFile imageFront,
            @RequestPart("imageBack") MultipartFile imageBack) {

        // Tải lên và validate ảnh mặt trước
        String imageFrontUrl = uploadAndValidateImage(imageFront, "ảnh mặt trước CCCD");
        // Tải lên và validate ảnh mặt sau
        String imageBackUrl = uploadAndValidateImage(imageBack, "ảnh mặt sau CCCD");

        cccdRequest.setImageFrontUrl(imageFrontUrl);
        cccdRequest.setImageBackUrl(imageBackUrl);
        cccdRequest.setDocumentType(DocumentType.CCCD);

        ResponseData<?> responseData = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Đã cập nhật CCCD thành công")
                .data(documentService.updateDocument(id, cccdRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/{id}/add-license")
    public ResponseEntity<ResponseData<?>> addLicense(
            @PathVariable long id,
            @RequestPart("documentRequest")  DocumentRequest licenseRequest, // Đặt tên khớp với frontend
            @RequestPart("imageFront") MultipartFile imageFront,
            @RequestPart("imageBack") MultipartFile imageBack) {

        // Tải lên và validate ảnh mặt trước
        String imageFrontUrl = uploadAndValidateImage(imageFront, "ảnh mặt trước bằng lái");
        // Tải lên và validate ảnh mặt sau
        String imageBackUrl = uploadAndValidateImage(imageBack, "ảnh mặt sau bằng lái");

        licenseRequest.setImageFrontUrl(imageFrontUrl);
        licenseRequest.setImageBackUrl(imageBackUrl);
        licenseRequest.setDocumentType(DocumentType.LICENSE); // Đảm bảo enum DocumentType được định nghĩa

        ResponseData<?> responseData = ResponseData.builder()
                .status(HttpStatus.CREATED.value())
                .message("Đã thêm bằng lái xe thành công")
                .data(documentService.createDocumentUser(id, licenseRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/license")
    public ResponseEntity<ResponseData<?>> getLicenseByUserId(@PathVariable long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Lấy bằng lái thành công")
                .data(documentService.getDocumentByUserIdAndDocumentType(id, DocumentType.LICENSE))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("/{id}/update-license")
    public ResponseEntity<ResponseData<?>> updateLicense(
            @PathVariable long id,
            @RequestPart("documentRequest") DocumentRequest licenseRequest, // Đặt tên khớp với frontend
            @RequestPart("imageFront") MultipartFile imageFront,
            @RequestPart("imageBack") MultipartFile imageBack) {

        // Tải lên và validate ảnh mặt trước
        String imageFrontUrl = uploadAndValidateImage(imageFront, "ảnh mặt trước bằng lái");
        // Tải lên và validate ảnh mặt sau
        String imageBackUrl = uploadAndValidateImage(imageBack, "ảnh mặt sau bằng lái");

        licenseRequest.setImageFrontUrl(imageFrontUrl);
        licenseRequest.setImageBackUrl(imageBackUrl);
        licenseRequest.setDocumentType(DocumentType.LICENSE);

        ResponseData<?> responseData = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Đã cập nhật bằng lái xe thành công")
                .data(documentService.updateDocument(id, licenseRequest))
                .build();

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @PutMapping("/{id}/update-info-user")
    public ResponseEntity<?> updateUserInfo(@PathVariable long id, @RequestBody UpdateInfoRequest userRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully updated user information")
                .data(userService.updateUserInfo(id, userRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @PatchMapping("/me/update-avatar")
    public ResponseEntity<?> updateUserAvatar(@RequestParam("avatar") MultipartFile avatar) {
        String avatarUrl = cloudinaryService.uploadImage(avatar);
        log.info("Avatar URL: {}", avatarUrl);
        if(userService.updateAvatar(avatarUrl)){
            ResponseData<?> responseData = ResponseData.builder()
                    .status(200)
                    .message("Successfully updated user avatar")
                    .build();
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        else {
            ResponseData<?> responseData = ResponseData.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Updated user avatar failse")
                    .build();
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasRole('admin')")
    @PatchMapping("/{email}/activate")
    public ResponseEntity<?> activateUser(@PathVariable String email) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully activated user")
                .data(userService.activeUser(email))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @PatchMapping("/{email}/in-activate")
    public ResponseEntity<?> inActivateUser(@PathVariable String email) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully activated user")
                .data(userService.inActiveUser(email))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully deleted user")
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @PostMapping("/{id}/bank-information")
    public ResponseEntity<?> addBankInformation(@PathVariable Long id, BankInformationRequest bankInformationRequest) {
        ResponseData<?> response = ResponseData.builder()
                .status(201)
                .message("Bank information added successfully")
                .data(bankInformationService.addBankInformation(id, bankInformationRequest))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasRole('user')")
    @PutMapping("/{id}/bank-information")
    public ResponseEntity<?> updateBankInformation(@PathVariable Long id, BankInformationRequest bankInformationRequest) {
        ResponseData<?> response = ResponseData.builder()
                .status(200)
                .message("Bank information updated successfully")
                .data(bankInformationService.updateBankInformation(id, bankInformationRequest))
                .build();
        return ResponseEntity.ok(response);
    }

    // khởi tạo kí gửi xe với các thông tin basic  của car sau đó sẽ update thông tin sau
    @PreAuthorize("hasRole('user')")
    @PostMapping("/{id}/create-car")
    public ResponseEntity<?> depositCar(@PathVariable long id,
                                        @RequestPart("carData") CarRequest carRequest,
                                        @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String image = cloudinaryService.uploadImage(file);
                if (image != null) {
                    imageUrls.add(image);
                } else {
                    // Ghi log cảnh báo hoặc xử lý trường hợp cụ thể khi tải lên trả về null
                    System.err.println("Cảnh báo: Tải lên Cloudinary trả về null cho tệp: " + file.getOriginalFilename());
                }
            } catch (Exception e) {
                // Ghi log lỗi, có thể ném một ngoại lệ tùy chỉnh, hoặc bỏ qua tệp này
                System.err.println("Lỗi khi tải lên tệp " + file.getOriginalFilename() + ": " + e.getMessage());
                // Tùy chọn: throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Tải ảnh thất bại");
            }
        }

        carRequest.setImages(imageUrls);

        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Car added successfully")
                .data(carService.createCar(id, carRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('owner')")
    @GetMapping("/{id}/list-car")
    public ResponseEntity<?> getAllCarByUserId(@PathVariable long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(carService.getAllCarsByUserId(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @PostMapping("/{id}/book-car")
    public ResponseEntity<?> bookCar(HttpServletRequest request, @PathVariable long id, @RequestBody BookingRequest bookingRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Booking created successfully")
                .data(bookingService.createBooking(request, id, bookingRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }
}
