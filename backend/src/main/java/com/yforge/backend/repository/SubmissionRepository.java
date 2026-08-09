package com.yforge.backend.repository;

import com.yforge.backend.entity.Submission;
import com.yforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentOrderBySubmittedAtDesc(User student);
    long countByStudent(User student);
    long countByProblemId(Long problemId);
    long countByStudentAndStatus(User student, Submission.Status status);
    @org.springframework.data.jpa.repository.Query(
    	    "SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.student = :student AND s.status = 'PASSED'"
    	)
    	long countDistinctSolvedProblems(@org.springframework.data.repository.query.Param("student") User student);
    
    
    @org.springframework.data.jpa.repository.Query(
    	    "SELECT COUNT(s) FROM Submission s WHERE s.submittedAt >= :startOfDay"
    	)
    	long countTodaysSubmissions(@org.springframework.data.repository.query.Param("startOfDay") java.time.LocalDateTime startOfDay);

    	@org.springframework.data.jpa.repository.Query(
    	    "SELECT COUNT(DISTINCT s.student.id) FROM Submission s WHERE s.submittedAt >= :since"
    	)
    	long countActiveStudents(@org.springframework.data.repository.query.Param("since") java.time.LocalDateTime since);
    	
    	
    	@org.springframework.data.jpa.repository.Query(
    		    "SELECT s.student.id, COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.status = 'PASSED' GROUP BY s.student.id"
    		)
    		List<Object[]> countSolvedGroupedByStudent();
}