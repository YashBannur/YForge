package com.yforge.backend.config;

import com.yforge.backend.entity.Role;
import com.yforge.backend.entity.User;
import com.yforge.backend.repository.RoleRepository;
import com.yforge.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository, UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedRole("STUDENT");
        seedRole("TRAINER");
        seedTrainerAccount(); // manual trainer seeding, see method below
    }

    private void seedRole(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = Role.builder().name(name).build();
            roleRepository.save(role);
            System.out.println("Seeded role: " + name);
        }
    }

    /**
     * Manually seed trainer accounts here. Add one line per trainer you want to create.
     * Safe to leave in — it checks existsByUsername first, so it won't duplicate on restart.
     */
    private void seedTrainerAccount() {
        createTrainerIfNotExists("yash_trainer", "yash.trainer@yforge.com", "ChangeMe123!");
    }

    private void createTrainerIfNotExists(String username, String email, String rawPassword) {
        if (userRepository.existsByUsername(username)) {
            return;
        }
        Role trainerRole = roleRepository.findByName("TRAINER")
                .orElseThrow(() -> new IllegalStateException("TRAINER role not seeded"));

        User trainer = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(trainerRole)
                .build();

        userRepository.save(trainer);
        System.out.println("Seeded trainer account: " + username);
    }
}