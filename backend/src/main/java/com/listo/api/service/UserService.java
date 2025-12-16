package com.listo.api.service;

import com.listo.api.dto.ChangePasswordRequest;
import com.listo.api.dto.UpdateUserRequest;
import com.listo.api.dto.UserResponse;
import com.listo.api.entity.User;
import com.listo.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getCurrentUser(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        return mapToUserResponse(user);
    }

    public UserResponse updateUser(Principal connectedUser, UpdateUserRequest request) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // Fetch fresh from DB to ensure attached state
        var savedUser = repository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) {
            savedUser.setFullName(request.getFullName());
        }

        // Handle Email Update (Note: This will invalidate current JWT)
        if (request.getEmail() != null && !request.getEmail().isEmpty()
                && !request.getEmail().equals(savedUser.getEmail())) {
            if (repository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already taken");
            }
            savedUser.setEmail(request.getEmail());
        }

        repository.save(savedUser);
        return mapToUserResponse(savedUser);
    }

    public void changePassword(Principal connectedUser, ChangePasswordRequest request) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        // Verify match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repository.save(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
