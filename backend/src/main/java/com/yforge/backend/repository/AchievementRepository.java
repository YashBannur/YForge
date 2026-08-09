// AchievementRepository.java
package com.yforge.backend.repository;
import com.yforge.backend.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    Optional<Achievement> findByCode(String code);
}