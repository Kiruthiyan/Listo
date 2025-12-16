package com.listo.api.dto;

import com.listo.api.entity.TaskPriority;
import com.listo.api.entity.TaskStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateTaskRequest {
    private String title;
    private String description;
    private String subject;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
}
