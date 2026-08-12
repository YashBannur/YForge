// StudentSummaryResponse.java
package com.yforge.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor
public class StudentSummaryResponse {
    private String username;
    private String email;
    private long problemsSolved;
    private int forgeStreakCurrent;
    private int forgeStreakLongest;
    private long totalSubmissions;
    private String lastActive; // ISO string or "Never"
    private LocalDateTime joinedAt;
}