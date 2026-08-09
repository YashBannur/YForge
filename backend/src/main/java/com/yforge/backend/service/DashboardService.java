package com.yforge.backend.service;

import com.yforge.backend.dto.AchievementResponse;
import com.yforge.backend.dto.DashboardResponse;
import com.yforge.backend.entity.User;
import com.yforge.backend.repository.UserRepository;
import com.yforge.backend.repository.SubmissionRepository;
import com.yforge.backend.repository.StudentAchievementRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final LeaderboardService leaderboardService;
    private final StudentAchievementRepository studentAchievementRepository;

    public DashboardService(
            UserRepository userRepository,
            SubmissionRepository submissionRepository,
            LeaderboardService leaderboardService,
            StudentAchievementRepository studentAchievementRepository) {

        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
        this.leaderboardService = leaderboardService;
        this.studentAchievementRepository = studentAchievementRepository;
    }

    public DashboardResponse getDashboard(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        long solvedCount =
                submissionRepository.countDistinctSolvedProblems(user);

        return DashboardResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().getName())
                .problemsSolved((int) solvedCount)
                .forgeStreakCurrent(user.getForgeStreakCurrent())
                .forgeStreakLongest(user.getForgeStreakLongest())
                .rank(leaderboardService.getRankForUser(username))
                .build();
    }

    public List<AchievementResponse> getAchievements(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return studentAchievementRepository
                .findByStudentOrderByEarnedAtDesc(user)
                .stream()
                .map(sa -> AchievementResponse.builder()
                        .code(sa.getAchievement().getCode())
                        .name(sa.getAchievement().getName())
                        .description(sa.getAchievement().getDescription())
                        .icon(sa.getAchievement().getIcon())
                        .earnedAt(sa.getEarnedAt())
                        .build())
                .collect(Collectors.toList());
    }
}