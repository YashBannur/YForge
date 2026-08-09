package com.yforge.backend.repository;

import com.yforge.backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
	long countByDifficulty(Problem.Difficulty difficulty);
}