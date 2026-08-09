// StudentAchievementRepository.java
package com.yforge.backend.repository;
import com.yforge.backend.entity.StudentAchievement;
import com.yforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentAchievementRepository extends JpaRepository<StudentAchievement, Long> {
    List<StudentAchievement> findByStudentOrderByEarnedAtDesc(User student);
    boolean existsByStudentAndAchievement_Code(User student, String code);
}