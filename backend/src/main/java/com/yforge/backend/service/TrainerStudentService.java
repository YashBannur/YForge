package com.yforge.backend.service;

import com.yforge.backend.dto.StudentSummaryResponse;
import com.yforge.backend.entity.Role;
import com.yforge.backend.entity.User;
import com.yforge.backend.repository.RoleRepository;
import com.yforge.backend.repository.SubmissionRepository;
import com.yforge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainerStudentService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SubmissionRepository submissionRepository;

    public TrainerStudentService(UserRepository userRepository, RoleRepository roleRepository,
                                   SubmissionRepository submissionRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.submissionRepository = submissionRepository;
    }

    public List<StudentSummaryResponse> getAllStudents() {
        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new IllegalStateException("STUDENT role not seeded"));

        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRole().getId().equals(studentRole.getId()))
                .toList();

        return students.stream()
                .map(s -> {
                    long solved = submissionRepository.countDistinctSolvedProblems(s);
                    long total = submissionRepository.countByStudent(s);
                    var submissions = submissionRepository.findByStudentOrderBySubmittedAtDesc(s);
                    String lastActive = submissions.isEmpty() ? "Never" : submissions.get(0).getSubmittedAt().toString();

                    return StudentSummaryResponse.builder()
                            .username(s.getUsername())
                            .email(s.getEmail())
                            .problemsSolved(solved)
                            .forgeStreakCurrent(s.getForgeStreakCurrent())
                            .forgeStreakLongest(s.getForgeStreakLongest())
                            .totalSubmissions(total)
                            .lastActive(lastActive)
                            .joinedAt(s.getCreatedAt())
                            .build();
                })
                .sorted((a, b) -> Long.compare(b.getProblemsSolved(), a.getProblemsSolved()))
                .collect(Collectors.toList());
    }
}