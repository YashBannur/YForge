package com.yforge.backend.service;

import com.yforge.backend.dto.DailyChallengeResponse;
import com.yforge.backend.dto.SetDailyChallengeRequest;
import com.yforge.backend.entity.DailyChallenge;
import com.yforge.backend.entity.Problem;
import com.yforge.backend.repository.DailyChallengeRepository;
import com.yforge.backend.repository.ProblemRepository;
import com.yforge.backend.repository.SubmissionRepository;
import com.yforge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DailyChallengeService {

    private final DailyChallengeRepository dailyChallengeRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public DailyChallengeService(DailyChallengeRepository dailyChallengeRepository, ProblemRepository problemRepository,
                                  UserRepository userRepository, SubmissionRepository submissionRepository) {
        this.dailyChallengeRepository = dailyChallengeRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
    }

    public DailyChallengeResponse getTodaysChallenge(String username) {
        DailyChallenge challenge = dailyChallengeRepository.findByChallengeDate(LocalDate.now())
                .orElse(null);

        if (challenge == null) {
            return null; // no challenge set for today
        }

        boolean solvedToday = username != null && submissionRepository
                .existsByStudent_UsernameAndProblem_IdAndStatusAndSubmittedAtAfter(
                        username, challenge.getProblem().getId(),
                        com.yforge.backend.entity.Submission.Status.PASSED,
                        LocalDate.now().atStartOfDay());

        return DailyChallengeResponse.builder()
                .problemId(challenge.getProblem().getId())
                .title(challenge.getProblem().getTitle())
                .difficulty(challenge.getProblem().getDifficulty().name())
                .topic(challenge.getProblem().getTopic())
                .rewardPoints(challenge.getRewardPoints())
                .solvedToday(solvedToday)
                .build();
    }

    public void setTodaysChallenge(SetDailyChallengeRequest request) {
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new IllegalArgumentException("Problem not found"));

        LocalDate today = LocalDate.now();
        DailyChallenge challenge = dailyChallengeRepository.findByChallengeDate(today)
                .orElse(DailyChallenge.builder().challengeDate(today).build());

        challenge.setProblem(problem);
        challenge.setRewardPoints(request.getRewardPoints() != null ? request.getRewardPoints() : 10);

        dailyChallengeRepository.save(challenge);
    }
}