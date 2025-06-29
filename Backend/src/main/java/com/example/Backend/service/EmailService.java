package com.example.Backend.service;

import com.example.Backend.model.*;
import com.example.Backend.model.enums.DocumentType;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class EmailService {

    @Value("${spring.mail.username}")
    private String FROM_EMAIL;
    private String COMPANY_NAME = "FastCar";
    @Value("${link_den_trang_chu}")
    private String LINK_DEN_TRANG_CHU;

    private final JavaMailSender mailSender;
    private final DocumentService documentService;

    public EmailService(JavaMailSender mailSender,
                        DocumentService documentService) {
        this.mailSender = mailSender;
        this.documentService = documentService;
    }

    @Async
    public void sendOTPEmail(String emailTo, String otp) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setFrom(FROM_EMAIL, COMPANY_NAME);
            mimeMessageHelper.setTo(emailTo);
            mimeMessageHelper.setSubject("Xác nhận mã OTP");
            String htmlContent = loadHtmlTemplate("templates/OTP.html");
            htmlContent = htmlContent.replace("${otpCode}", otp);
            mimeMessageHelper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("OTP email sent successfully to: {}", emailTo);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", emailTo, e.getMessage(), e);
            e.printStackTrace();
        }
    }

    @Async
    public void sendMailSuccess(Booking booking, Payment payment) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setFrom(FROM_EMAIL, COMPANY_NAME);
            mimeMessageHelper.setTo(booking.getUser().getEmail());
            mimeMessageHelper.setSubject("Thông báo thanh toán thành công");
            String htmlContent = loadHtmlTemplate("templates/thanhtoanthanhcong.html");

            htmlContent = htmlContent.replace("[Tên khách hàng]", booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
            htmlContent = htmlContent.replace("[Mã đơn hàng]", booking.getBookingCode());
            htmlContent = htmlContent.replace("[Mã giao dịch]", payment.getExternalRef());
            htmlContent = htmlContent.replace("[Số tiền]", payment.getAmount().toString());
            htmlContent = htmlContent.replace("[Phương thức thanh toán]", "VNPAY");
            htmlContent = htmlContent.replace("[Thời gian giao dịch]", payment.getCreatedAt().toString());
            htmlContent = htmlContent.replace("[LINK_DEN_TRANG_CHU]", LINK_DEN_TRANG_CHU);

            mimeMessageHelper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully to: {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send Email to {}: {}", booking.getUser().getEmail(), e.getMessage(), e);
            e.printStackTrace();
        }
    }

    @Async
    public void sendMailFailed(Booking booking, Payment payment) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setFrom(FROM_EMAIL, COMPANY_NAME);
            mimeMessageHelper.setTo(booking.getUser().getEmail());
            mimeMessageHelper.setSubject("Thông báo thanh toán không thành công");
            String htmlContent = loadHtmlTemplate("templates/thanhtoanthatbai.html");

            htmlContent = htmlContent.replace("[Tên khách hàng]", booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
            htmlContent = htmlContent.replace("[Mã đơn hàng]", booking.getBookingCode());
            htmlContent = htmlContent.replace("[Mã giao dịch]", payment.getExternalRef());
            htmlContent = htmlContent.replace("[Số tiền]", payment.getAmount().toString());
            htmlContent = htmlContent.replace("[Thời gian giao dịch]", payment.getCreatedAt().toString());
            htmlContent = htmlContent.replace("[LINK_DEN_TRANG_CHU]", LINK_DEN_TRANG_CHU);

            mimeMessageHelper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully to: {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send Email to {}: {}", booking.getUser().getEmail(), e.getMessage(), e);
            e.printStackTrace();
        }
    }

    @Async
    public void sendMailRefund(Booking booking, Payment payment) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setFrom(FROM_EMAIL, COMPANY_NAME);
            mimeMessageHelper.setTo(booking.getUser().getEmail());
            mimeMessageHelper.setSubject("Thông báo hoàn tiền");
            String htmlContent = loadHtmlTemplate("templates/thongbaohoantien.html");

            htmlContent = htmlContent.replace("[Tên khách hàng]", booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
            htmlContent = htmlContent.replace("[Mã đơn hàng]", booking.getBookingCode());
            htmlContent = htmlContent.replace("[Số tiền hoàn]", payment.getAmount().toString());
            htmlContent = htmlContent.replace("[Mã giao dịch]", payment.getExternalRef());
            htmlContent = htmlContent.replace("[Phương thức thanh toán ban đầu]", "VNPAY");
            htmlContent = htmlContent.replace("[Ngày xử lý hoàn tiền]", LocalDate.now().toString());
            htmlContent = htmlContent.replace("[Số ngày]", "7");

            mimeMessageHelper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Refund email sent successfully to: {}", booking.getUser().getEmail()); // Đã sửa log info
        } catch (Exception e) {
            log.error("Failed to send Refund email to {}: {}", booking.getUser().getEmail(), e.getMessage(), e); // Đã sửa log error
            e.printStackTrace();
        }
    }

    @Async
    public void sendMailExtra(Booking booking, Payment payment, String paymentUrl) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setFrom(FROM_EMAIL, COMPANY_NAME);
            mimeMessageHelper.setTo(booking.getUser().getEmail());
            mimeMessageHelper.setSubject("Thông báo phụ phí");
            String htmlContent = loadHtmlTemplate("templates/thongbaophuphi.html");

            List<ExtraCharge> extraCharges = payment.getExtraCharges();
            StringBuilder extraChargesDetails = new StringBuilder();
            for (ExtraCharge extraCharge : extraCharges) {
                extraChargesDetails.append(extraCharge.getReason())
                        .append(": ")
                        .append(extraCharge.getAmount())
                        .append("<br>");
            }

            htmlContent = htmlContent.replace("[Tên khách hàng]", booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
            htmlContent = htmlContent.replace("[Mã đơn hàng]", booking.getBookingCode());
            htmlContent = htmlContent.replace("[Số tiền phụ phí]", payment.getAmount().toString());
            htmlContent = htmlContent.replace("[Mã giao dịch]", payment.getExternalRef());
            htmlContent = htmlContent.replace("[Mô tả chi tiết phụ phí, ví dụ: Phí quá giờ, Phí vệ sinh, Phí hư hỏng...]", extraChargesDetails.toString());
            htmlContent = htmlContent.replace("[Ngày phát sinh]", LocalDate.now().toString());
            htmlContent = htmlContent.replace("[LINK_DEN_TRANG_THANH_TOAN_PHU_PHI]", paymentUrl);

            mimeMessageHelper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully to: {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send Email to {}: {}", booking.getUser().getEmail(), e.getMessage(), e);
            e.printStackTrace();
        }
    }

    @Async
    public void sendMailCheckIn(Booking booking) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setFrom(FROM_EMAIL, COMPANY_NAME);
            mimeMessageHelper.setTo(booking.getUser().getEmail());
            mimeMessageHelper.setSubject("Thông báo nhận xe thành công");
            String htmlContent = loadHtmlTemplate("templates/thongbaonhanxe.html");

            htmlContent = htmlContent.replace("[Tên khách hàng]", booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
            htmlContent = htmlContent.replace("[Mã đơn hàng]", booking.getBookingCode());
            htmlContent = htmlContent.replace("[Tên xe / Loại xe]", booking.getCar().getName());
            htmlContent = htmlContent.replace("[Biển số xe]", booking.getCar().getLicensePlate());
            htmlContent = htmlContent.replace("[Thời gian nhận xe]", LocalDateTime.now().toString());
            htmlContent = htmlContent.replace("[Địa điểm nhận xe]", booking.getPickupLocation().getAddress());

            mimeMessageHelper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully to: {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send Email to {}: {}", booking.getUser().getEmail(), e.getMessage(), e);
            e.printStackTrace();
        }
    }

    @Async
    public void sendMailCheckOut(Booking booking) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setFrom(FROM_EMAIL, COMPANY_NAME);
            mimeMessageHelper.setTo(booking.getUser().getEmail());
            mimeMessageHelper.setSubject("Thông báo trả xe thành công");
            String htmlContent = loadHtmlTemplate("templates/thongbaotraxe.html");

            htmlContent = htmlContent.replace("[Tên khách hàng]", booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
            htmlContent = htmlContent.replace("[Mã đơn hàng]", booking.getBookingCode());
            htmlContent = htmlContent.replace("[Tên xe / Loại xe]", booking.getCar().getName());
            htmlContent = htmlContent.replace("[Biển số xe]", booking.getCar().getLicensePlate());
            htmlContent = htmlContent.replace("[Thời gian nhận xe]", LocalDateTime.now().toString());
            htmlContent = htmlContent.replace("[Địa điểm nhận xe]", booking.getPickupLocation().getAddress());

            mimeMessageHelper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully to: {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send Email to {}: {}", booking.getUser().getEmail(), e.getMessage(), e);
            e.printStackTrace();
        }
    }

    @Async
    public void sendMailContract(Booking booking) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            mimeMessageHelper.setFrom(FROM_EMAIL, COMPANY_NAME);
            mimeMessageHelper.setTo(booking.getUser().getEmail());
            mimeMessageHelper.setSubject("Hợp đồng thuê xe");
            String htmlContent = loadHtmlTemplate("templates/contract.html");

            String numberContract = booking.getBookingCode();

            htmlContent = htmlContent.replace("[SỐ HỢP ĐỒNG]", numberContract);

            Car car = booking.getCar();
            User userOwner = car.getUser();
            Document documentOwner = documentService.getDocumentByUserAndType(userOwner, DocumentType.CCCD);
            User user = booking.getUser();
            Document documentUser = documentService.getDocumentByUserAndType(user, DocumentType.CCCD);

            htmlContent = htmlContent.replace("[CÁ NHÂN BÊN A]", userOwner.getFirstName() + " " + userOwner.getLastName());
            htmlContent = htmlContent.replace("[ĐỊA CHỈ BÊN A]", userOwner.getAddress().getAddress());
            htmlContent = htmlContent.replace("[SỐ ĐIỆN THOẠI BÊN A]", userOwner.getPhone());
            htmlContent = htmlContent.replace("[EMAIL BÊN A]", userOwner.getEmail());
            htmlContent = htmlContent.replace("[CCCD BÊN A]", documentOwner.getSerialNumber());
            htmlContent = htmlContent.replace("[NGƯỜI ĐẠI DIỆN BÊN A]", userOwner.getFirstName() + " " + userOwner.getLastName());

            htmlContent = htmlContent.replace("[CÁ NHÂN BÊN B]", user.getFirstName() + " " + user.getLastName());
            htmlContent = htmlContent.replace("[ĐỊA CHỈ BÊN B]", user.getAddress().getAddress());
            htmlContent = htmlContent.replace("[SỐ ĐIỆN THOẠI BÊN B]", user.getPhone());
            htmlContent = htmlContent.replace("[EMAIL BÊN B]", user.getEmail());
            htmlContent = htmlContent.replace("[CCCD BÊN B]", documentUser.getSerialNumber());
            htmlContent = htmlContent.replace("[NGƯỜI ĐẠI DIỆN BÊN B]", user.getFirstName() + " " + user.getLastName());

            htmlContent = htmlContent.replace("[LOẠI XE]", car.getCarType().toString());
            htmlContent = htmlContent.replace("[BIỂN KIỂM SOÁT]", car.getLicensePlate());
            htmlContent = htmlContent.replace("[MÀU SẮC]", car.getColor());
            htmlContent = htmlContent.replace("[NĂM SẢN XUẤT]", String.valueOf(car.getYear()));

            Duration duration = Duration.between(booking.getPickupTime(), booking.getReturnTime());
            long hours = duration.toHours();

            htmlContent = htmlContent.replace("[SỐ NGÀY/THÁNG]", String.valueOf(hours));
            htmlContent = htmlContent.replace("[NGÀY BẮT ĐẦU THUÊ]", booking.getPickupTime().toString());
            htmlContent = htmlContent.replace("[NGÀY KẾT THÚC THUÊ]", booking.getReturnTime().toString());
            htmlContent = htmlContent.replace("[SỐ TIỀN BẰNG SỐ]", booking.getRentalPrice().toString());
            htmlContent = htmlContent.replace("[TIỀN GIỮ CHỖ]", booking.getReservationFee().toString());
            htmlContent = htmlContent.replace("[TIỀN CỌC]", booking.getDepositAmount().toString());
            htmlContent = htmlContent.replace("[TIỀN GIẢM GIÁ]", booking.getTotalDiscount().toString());


            mimeMessageHelper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully to: {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send Email to {}: {}", booking.getUser().getEmail(), e.getMessage(), e);
            log.error("Error details: ", e);
        }
    }

    // Phương thức đã được chỉnh sửa để đọc tài nguyên từ InputStream
    private String loadHtmlTemplate(String path) throws IOException {
        ClassPathResource resource = new ClassPathResource(path);
        try (InputStream inputStream = resource.getInputStream()) {
            byte[] bytes = FileCopyUtils.copyToByteArray(inputStream);
            return new String(bytes, StandardCharsets.UTF_8);
        }
    }

}