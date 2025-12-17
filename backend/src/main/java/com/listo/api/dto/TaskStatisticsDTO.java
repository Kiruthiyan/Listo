package com.listo.api.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class TaskStatisticsDTO {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;
    private long dueToday;
    private long dueThisWeek;
    private long examCount;
    private Map<String, Long> priorityBreakdown;
    private long completedThisWeek;
}
