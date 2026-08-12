package com.yforge.backend.controller;

import com.yforge.backend.dto.StudentSummaryResponse;
import com.yforge.backend.service.TrainerStudentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TrainerStudentController {

    private final TrainerStudentService trainerStudentService;

    public TrainerStudentController(TrainerStudentService trainerStudentService) {
        this.trainerStudentService = trainerStudentService;
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/api/trainer/students")
    public List<StudentSummaryResponse> getAllStudents() {
        return trainerStudentService.getAllStudents();
    }
}