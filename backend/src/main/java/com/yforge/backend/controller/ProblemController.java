package com.yforge.backend.controller;

import com.yforge.backend.dto.ProblemRequest;
import com.yforge.backend.dto.ProblemResponse;
import com.yforge.backend.dto.ProblemSummaryResponse;
import com.yforge.backend.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    // ---------- TRAINER endpoints ----------

    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping("/trainer/problems")
    public ResponseEntity<ProblemResponse> createProblem(@Valid @RequestBody ProblemRequest request) {
        String username = getCurrentUsername();
        return ResponseEntity.ok(problemService.createProblem(request, username));
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/trainer/problems")
    public ResponseEntity<List<ProblemResponse>> getAllProblemsForTrainer() {
        return ResponseEntity.ok(problemService.getAllProblemsForTrainer());
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/trainer/problems/{id}")
    public ResponseEntity<ProblemResponse> getProblemForTrainer(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemForTrainer(id));
    }

    @PreAuthorize("hasRole('TRAINER')")
    @PutMapping("/trainer/problems/{id}")
    public ResponseEntity<ProblemResponse> updateProblem(@PathVariable Long id, @Valid @RequestBody ProblemRequest request) {
        return ResponseEntity.ok(problemService.updateProblem(id, request));
    }

    @PreAuthorize("hasRole('TRAINER')")
    @DeleteMapping("/trainer/problems/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- STUDENT endpoint ----------

    @GetMapping("/problems")
    public ResponseEntity<List<ProblemSummaryResponse>> getAllProblemsForStudent() {
        return ResponseEntity.ok(problemService.getAllProblemsForStudent());
    }

    // ---------- helper ----------
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }
}