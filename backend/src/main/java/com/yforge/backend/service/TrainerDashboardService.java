package com.yforge.backend.service;

import com.yforge.backend.dto.TrainerDashboardResponse;
import com.yforge.backend.repository.ProblemRepository;
import com.yforge.backend.repository.RoleRepository;
import com.yforge.backend.repository.SubmissionRepository;
import com.yforge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TrainerDashboardService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    public TrainerDashboardService(UserRepository userRepository, RoleRepository roleRepository,
                                     ProblemRepository problemRepository, SubmissionRepository submissionRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.problemRepository = problemRepository;
        this.submissionRepository = submissionRepository;
    }

    public TrainerDashboardResponse getDashboard(String username) {
        var studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new IllegalStateException("STUDENT role not seeded"));

        long totalStudents = userRepository.countByRole(studentRole);
        long totalProblems = problemRepository.count();

        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        long todaysSubmissions = submissionRepository.countTodaysSubmissions(startOfDay);

        java.time.LocalDateTime sevenDaysAgo = java.time.LocalDateTime.now().minusDays(7);
        long activeStudents = submissionRepository.countActiveStudents(sevenDaysAgo);

        return TrainerDashboardResponse.builder()
                .username(username)
                .totalStudents(totalStudents)
                .activeStudents(activeStudents)
                .totalProblems(totalProblems)
                .todaysSubmissions(todaysSubmissions)
                .build();
    }
}