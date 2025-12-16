package com.listo.api.service;

import com.listo.api.dto.CreateSubtaskRequest;
import com.listo.api.dto.SubtaskDTO;
import com.listo.api.dto.UpdateSubtaskRequest;
import com.listo.api.entity.Subtask;
import com.listo.api.entity.Task;
import com.listo.api.repository.SubtaskRepository;
import com.listo.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubtaskService {
    private final SubtaskRepository subtaskRepository;
    private final TaskRepository taskRepository;

    public SubtaskDTO createSubtask(UUID taskId, CreateSubtaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Subtask subtask = new Subtask();
        subtask.setTitle(request.getTitle());
        subtask.setCompleted(request.getCompleted() != null && request.getCompleted());
        subtask.setTask(task);

        return mapToDTO(subtaskRepository.save(subtask));
    }

    public SubtaskDTO updateSubtask(UUID subtaskId, UpdateSubtaskRequest request) {
        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));

        if (request.getTitle() != null)
            subtask.setTitle(request.getTitle());
        if (request.getCompleted() != null)
            subtask.setCompleted(request.getCompleted());

        return mapToDTO(subtaskRepository.save(subtask));
    }

    public void deleteSubtask(UUID subtaskId) {
        subtaskRepository.deleteById(subtaskId);
    }

    private SubtaskDTO mapToDTO(Subtask subtask) {
        return SubtaskDTO.builder()
                .id(subtask.getId())
                .title(subtask.getTitle())
                .completed(subtask.isCompleted())
                .build();
    }
}
