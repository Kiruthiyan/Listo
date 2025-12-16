package com.listo.api.dto;

import lombok.Data;

@Data
public class UpdateSubtaskRequest {
    private String title;
    private Boolean completed;
}
