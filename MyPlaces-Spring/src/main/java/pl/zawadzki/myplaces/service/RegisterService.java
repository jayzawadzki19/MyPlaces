package pl.zawadzki.myplaces.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.zawadzki.myplaces.dto.LoginAndRegisterRequest;
import pl.zawadzki.myplaces.exception.UserAlreadyExistsException;
import pl.zawadzki.myplaces.model.User;
import pl.zawadzki.myplaces.repository.UserRepository;

@Service
public class RegisterService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public RegisterService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public void signUp(LoginAndRegisterRequest request) {
        if (doesUserExist(request)) {
            throw new UserAlreadyExistsException("User " + request.getUsername() + " already exists!");
        }
        User newUser = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()));
        userRepository.save(newUser);
    }


    /**
     * Checks if User already exists
     */
    private boolean doesUserExist(LoginAndRegisterRequest request) {
        return userRepository.getUserByUsername(request.getUsername()).isPresent();
    }
}
