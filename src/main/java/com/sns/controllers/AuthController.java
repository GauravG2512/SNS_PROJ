package com.sns.controllers;

import com.sns.models.Citizen;
import com.sns.repositories.CitizenRepository;
import com.sns.security.JwtUtils;
import com.sns.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CitizenRepository citizenRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.get("email"), loginRequest.get("password")));

        String jwt = jwtUtils.generateJwtToken(authentication);
        return ResponseEntity.ok(Map.of("token", jwt, "email", loginRequest.get("email")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCitizen(@RequestBody Citizen citizen) {
        if (citizenRepository.existsByEmail(citizen.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Encode password and save to database
        String rawPassword = citizen.getPasswordHash();
        citizen.setPasswordHash(encoder.encode(rawPassword));
        citizenRepository.save(citizen);

        // Trigger real-time welcome email
        try {
            emailService.sendRegistrationEmail(citizen.getEmail(), citizen.getFullName());
        } catch (Exception e) {
            // Log the error but don't fail the registration if only email fails
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        return ResponseEntity.ok("Citizen registered successfully! A welcome email has been dispatched.");
    }
}