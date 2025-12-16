package com.listo.api.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class SubtaskDTO {
    private UUID id;
    private String title;
    private boolean completed;
}
