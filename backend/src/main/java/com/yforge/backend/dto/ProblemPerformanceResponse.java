// ProblemPerformanceResponse.java
package com.yforge.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data @Builder @AllArgsConstructor
public class ProblemPerformanceResponse {
    private String problemTitle;
    private double successRate;
    private long totalAttempts;
}