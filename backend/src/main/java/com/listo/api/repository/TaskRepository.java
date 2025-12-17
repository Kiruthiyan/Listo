package com.listo.api.repository;

import com.listo.api.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByUserId(UUID userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId")
    long countByUserId(UUID userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = 'DONE'")
    long countCompletedByUserId(UUID userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status != 'DONE'")
    long countPendingByUserId(UUID userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status != 'DONE' AND t.dueDate < CURRENT_TIMESTAMP")
    long countOverdueByUserId(UUID userId);

    // Using H2 specific syntax or standard SQL dates
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND CAST(t.dueDate AS DATE) = CURRENT_DATE")
    long countDueTodayByUserId(UUID userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND (t.title LIKE '%Exam%' OR t.title LIKE '%Test%' OR t.subject LIKE '%Exam%')")
    long countExamsByUserId(UUID userId);

    // Simplification: We can count priority in service

}
