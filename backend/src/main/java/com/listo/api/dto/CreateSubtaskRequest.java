package com.listo.api.dto;

import lombok.Data;

@Data
public class CreateSubtaskRequest {
    private String title;
    private Boolean completed; // Allow setting status if needed, defaults to false
}
