package pl.zawadzki.myplaces.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.zawadzki.myplaces.model.User;
import pl.zawadzki.myplaces.repository.UserRepository;

@Service
public class CurrentUserService {

    private UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        org.springframework.security.core.userdetails.User principal =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        return userRepository.getUserByUsername(
                principal.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User " + principal.getUsername() + " not found"));
    }
}
