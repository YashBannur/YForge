package com.yforge.backend.service;

import com.yforge.backend.entity.*;
import com.yforge.backend.repository.AchievementRepository;
import com.yforge.backend.repository.StudentAchievementRepository;
import com.yforge.backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final StudentAchievementRepository studentAchievementRepository;
    private final SubmissionRepository submissionRepository;

    public AchievementService(AchievementRepository achievementRepository,
                               StudentAchievementRepository studentAchievementRepository,
                               SubmissionRepository submissionRepository) {
        this.achievementRepository = achievementRepository;
        this.studentAchievementRepository = studentAchievementRepository;
        this.submissionRepository = submissionRepository;
    }

    /** Call this after every PASSED submission. Checks and awards any newly-earned achievements. */
    public void checkAndAwardAchievements(User student, boolean isDailyChallenge) {
        long solvedCount = submissionRepository.countDistinctSolvedProblems(student);

        awardIfEligible(student, "FIRST_SOLUTION", solvedCount >= 1);
        awardIfEligible(student, "SOLVED_10", solvedCount >= 10);
        awardIfEligible(student, "SOLVED_50", solvedCount >= 50);
        awardIfEligible(student, "SOLVED_100", solvedCount >= 100);
        awardIfEligible(student, "SOLVED_500", solvedCount >= 500);

        int streak = student.getForgeStreakCurrent();
        awardIfEligible(student, "STREAK_3", streak >= 3);
        awardIfEligible(student, "STREAK_7", streak >= 7);
        awardIfEligible(student, "STREAK_15", streak >= 15);
        awardIfEligible(student, "STREAK_30", streak >= 30);
        awardIfEligible(student, "STREAK_50", streak >= 50);
        awardIfEligible(student, "STREAK_100", streak >= 100);

        if (isDailyChallenge) {
            awardIfEligible(student, "DAILY_CHAMPION", true);
        }
    }

    private void awardIfEligible(User student, String code, boolean eligible) {
        if (!eligible) return;
        if (studentAchievementRepository.existsByStudentAndAchievement_Code(student, code)) return; // already earned

        Achievement achievement = achievementRepository.findByCode(code)
                .orElseThrow(() -> new IllegalStateException("Achievement not seeded: " + code));

        studentAchievementRepository.save(StudentAchievement.builder()
                .student(student)
                .achievement(achievement)
                .build());
    }
}