package com.yforge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TrainerDashboardResponse {
    private String username;
    private long totalStudents;
    private long activeStudents;
    private long totalProblems;
    private long todaysSubmissions;
}