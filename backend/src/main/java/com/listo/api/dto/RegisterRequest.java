package com.listo.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String fullName;
    private String email;
    // Password validation handled in AuthService or using @Size here if we want API level validation
    private String password;
    private String confirmPassword;
}
