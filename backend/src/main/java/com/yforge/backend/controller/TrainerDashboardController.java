package com.yforge.backend.controller;

import com.yforge.backend.dto.TrainerDashboardResponse;
import com.yforge.backend.service.TrainerDashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trainer")
public class TrainerDashboardController {

    private final TrainerDashboardService trainerDashboardService;

    public TrainerDashboardController(TrainerDashboardService trainerDashboardService) {
        this.trainerDashboardService = trainerDashboardService;
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/dashboard")
    public TrainerDashboardResponse getDashboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return trainerDashboardService.getDashboard(auth.getName());
    }
}