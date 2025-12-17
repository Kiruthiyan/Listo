package com.listo.api.controller;

import com.listo.api.dto.CreateTaskRequest;
import com.listo.api.dto.TaskDTO;
import com.listo.api.dto.UpdateTaskRequest;
import com.listo.api.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getAllTasks(authentication.getName()));
    }

    @GetMapping("/stats")
    public ResponseEntity<com.listo.api.dto.TaskStatisticsDTO> getTaskStatistics(Authentication authentication) {
        return ResponseEntity.ok(taskService.getTaskStatistics(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(
            @RequestBody CreateTaskRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(taskService.createTask(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable UUID id,
            @RequestBody UpdateTaskRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(taskService.updateTask(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID id,
            Authentication authentication) {
        taskService.deleteTask(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
