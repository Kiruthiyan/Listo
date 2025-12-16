package com.listo.api.controller;

import com.listo.api.dto.CreateSubtaskRequest;
import com.listo.api.dto.SubtaskDTO;
import com.listo.api.dto.UpdateSubtaskRequest;
import com.listo.api.service.SubtaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SubtaskController {
    private final SubtaskService subtaskService;

    @PostMapping("/tasks/{taskId}/subtasks")
    public ResponseEntity<SubtaskDTO> createSubtask(
            @PathVariable UUID taskId,
            @RequestBody CreateSubtaskRequest request) {
        return ResponseEntity.ok(subtaskService.createSubtask(taskId, request));
    }

    @PutMapping("/subtasks/{subtaskId}")
    public ResponseEntity<SubtaskDTO> updateSubtask(
            @PathVariable UUID subtaskId,
            @RequestBody UpdateSubtaskRequest request) {
        return ResponseEntity.ok(subtaskService.updateSubtask(subtaskId, request));
    }

    @DeleteMapping("/subtasks/{subtaskId}")
    public ResponseEntity<Void> deleteSubtask(@PathVariable UUID subtaskId) {
        subtaskService.deleteSubtask(subtaskId);
        return ResponseEntity.noContent().build();
    }
}
