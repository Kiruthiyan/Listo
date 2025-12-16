package com.listo.api.repository;

import com.listo.api.entity.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SubtaskRepository extends JpaRepository<Subtask, UUID> {
}
