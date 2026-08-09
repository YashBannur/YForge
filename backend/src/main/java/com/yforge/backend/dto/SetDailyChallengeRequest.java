// SetDailyChallengeRequest.java
package com.yforge.backend.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SetDailyChallengeRequest {
    @NotNull
    private Long problemId;
    private Integer rewardPoints;
}