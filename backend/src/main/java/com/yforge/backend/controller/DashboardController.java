package com.yforge.backend.controller;



import com.yforge.backend.dto.AchievementResponse;
import com.yforge.backend.dto.ActivityHeatmapResponse;
import com.yforge.backend.dto.DashboardResponse;
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

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return dashboardService.getDashboard(username);
    }
    
    @GetMapping("/achievements")
    public List<AchievementResponse> getMyAchievements() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return dashboardService.getAchievements(username);
    }
    
    
    
    @GetMapping("/activity")
    public ActivityHeatmapResponse getActivity() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return dashboardService.getActivityHeatmap(username);
    }
}