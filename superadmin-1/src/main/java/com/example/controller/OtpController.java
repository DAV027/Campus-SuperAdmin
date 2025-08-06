package com.example.controller;

import com.example.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin
public class OtpController {

    // Store OTPs in memory for demo (use Redis or DB for production)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        String otp = String.valueOf(100000 + (int)(Math.random() * 900000));
        otpStore.put(email, otp);

        // Send email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your OTP Code");
            message.setText("Your OTP code is: " + otp);
            System.out.println(otp);
            mailSender.send(message);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email");
        }
        return ResponseEntity.ok("OTP sent");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");
        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("verified", false));
        }
        String expected = otpStore.get(email);
        boolean verified = expected != null && expected.equals(otp);
        if (verified) {
            otpStore.remove(email);
        }
        return ResponseEntity.ok(Map.of("verified", verified));
    }
}
