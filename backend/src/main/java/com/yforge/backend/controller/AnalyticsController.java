// AnalyticsController.java
package com.yforge.backend.controller;

import com.yforge.backend.dto.AnalyticsResponse;
import com.yforge.backend.service.AnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/api/trainer/analytics")
    public AnalyticsResponse getAnalytics() {
        return analyticsService.getAnalytics();
    }
}