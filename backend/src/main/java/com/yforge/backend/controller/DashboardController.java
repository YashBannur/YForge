package com.yforge.backend.controller;

import com.yforge.backend.dto.AchievementProgressResponse;
import com.yforge.backend.dto.AchievementResponse;
import com.yforge.backend.dto.ActivityHeatmapResponse;
import com.yforge.backend.dto.DashboardResponse;
import com.yforge.backend.entity.User;
import com.yforge.backend.repository.UserRepository;
import com.yforge.backend.service.AchievementService;
import com.yforge.backend.service.DashboardService;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AchievementService achievementService;
    private final UserRepository userRepository;

    public DashboardController(
            DashboardService dashboardService,
            AchievementService achievementService,
            UserRepository userRepository) {

        this.dashboardService = dashboardService;
        this.achievementService = achievementService;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard() {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = auth.getName();

        return dashboardService.getDashboard(username);
    }

    // =========================================================
    // GET EARNED ACHIEVEMENTS
    // =========================================================

    @GetMapping("/achievements")
    public List<AchievementResponse> getMyAchievements() {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = auth.getName();

        return dashboardService.getAchievements(username);
    }

    // =========================================================
    // GET ALL ACHIEVEMENTS WITH PROGRESS
    // =========================================================

    @GetMapping("/achievements/all")
    public List<AchievementProgressResponse> getAllAchievements() {

        String username = getCurrentUsername();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found: " + username
                                )
                        );

        return achievementService
                .getAllAchievementsWithProgress(user);
    }

    // =========================================================
    // GET ACTIVITY HEATMAP
    // =========================================================

    @GetMapping("/activity")
    public ActivityHeatmapResponse getActivity() {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = auth.getName();

        return dashboardService
                .getActivityHeatmap(username);
    }

    // =========================================================
    // GET CURRENT USERNAME
    // =========================================================

    private String getCurrentUsername() {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException(
                    "User is not authenticated"
            );
        }

        return auth.getName();
    }
}