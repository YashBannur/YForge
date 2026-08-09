package com.yforge.backend.service;

import com.yforge.backend.dto.DashboardResponse;
import com.yforge.backend.entity.User;
import com.yforge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.yforge.backend.repository.SubmissionRepository;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public DashboardService(UserRepository userRepository,
                            SubmissionRepository submissionRepository) {
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
    }

    public DashboardResponse getDashboard(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        long solvedCount = submissionRepository.countDistinctSolvedProblems(user);

        return DashboardResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().getName())
                .problemsSolved((int) solvedCount)
                .forgeStreakCurrent(user.getForgeStreakCurrent())
                .forgeStreakLongest(user.getForgeStreakLongest())
                .rank(null)
                .build();
    }
}