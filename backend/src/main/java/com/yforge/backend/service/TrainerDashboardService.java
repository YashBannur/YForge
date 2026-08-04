package com.yforge.backend.service;

import com.yforge.backend.dto.TrainerDashboardResponse;
import com.yforge.backend.repository.RoleRepository;
import com.yforge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TrainerDashboardService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public TrainerDashboardService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public TrainerDashboardResponse getDashboard(String username) {
        var studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new IllegalStateException("STUDENT role not seeded"));

        long totalStudents = userRepository.countByRole(studentRole);

        return TrainerDashboardResponse.builder()
                .username(username)
                .totalStudents(totalStudents)
                .activeStudents(0) // TODO Phase 9: "active" = submitted in last 7 days
                .totalProblems(0)   // TODO Phase 7: real count from Problems table
                .todaysSubmissions(0) // TODO Phase 9: real count from Submissions table
                .build();
    }
}