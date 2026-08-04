package com.yforge.backend.service;

import com.yforge.backend.dto.DashboardResponse;
import com.yforge.backend.entity.User;
import com.yforge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;

    public DashboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboard(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return DashboardResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().getName())
                .problemsSolved(0) // TODO Phase 9: real count from Submissions
                .forgeStreakCurrent(user.getForgeStreakCurrent())
                .forgeStreakLongest(user.getForgeStreakLongest())
                .rank(null) // TODO Phase 12: real leaderboard rank
                .build();
    }
}