package pl.zawadzki.myplaces.service;

import lombok.Data;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pl.zawadzki.myplaces.dto.LoginAndRegisterRequest;
import pl.zawadzki.myplaces.dto.LoginResponse;

@Service
@Data
public class LoginService {

    private AuthenticationManager manager;

    public LoginService(AuthenticationManager manager) {
        this.manager = manager;
    }

    /**
     * Authenticates {@link pl.zawadzki.myplaces.model.User} with {@link LoginAndRegisterRequest}
     *
     * @param request {@link LoginAndRegisterRequest}
     * @return {@link LoginResponse}
     */
    public LoginResponse login(LoginAndRegisterRequest request) {
        Authentication authentication = manager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return new LoginResponse(request.getUsername());
    }
}
