package com.listo.api.dto;

import com.listo.api.entity.TaskPriority;
import com.listo.api.entity.TaskStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TaskDTO {
    private UUID id;
    private String title;
    private String description;
    private String subject;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private java.util.List<SubtaskDTO> subtasks;
}
