package com.listo.api.controller;

import com.listo.api.dto.ChangePasswordRequest;
import com.listo.api.dto.UpdateUserRequest;
import com.listo.api.dto.UserResponse;
import com.listo.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Principal connectedUser) {
        return ResponseEntity.ok(service.getCurrentUser(connectedUser));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            Principal connectedUser,
            @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(service.updateUser(connectedUser, request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(
            Principal connectedUser,
            @RequestBody ChangePasswordRequest request) {
        service.changePassword(connectedUser, request);
        return ResponseEntity.ok().build();
    }
}
