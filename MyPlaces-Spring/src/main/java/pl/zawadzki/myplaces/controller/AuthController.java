package pl.zawadzki.myplaces.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.zawadzki.myplaces.dto.LoginAndRegisterRequest;
import pl.zawadzki.myplaces.dto.LoginResponse;
import pl.zawadzki.myplaces.exception.UserAlreadyExistsException;
import pl.zawadzki.myplaces.service.LoginService;
import pl.zawadzki.myplaces.service.RegisterService;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class AuthController {

    private RegisterService registerService;
    private LoginService loginService;

    public AuthController(RegisterService registerService, LoginService loginService) {
        this.registerService = registerService;
        this.loginService = loginService;
    }

    @PostMapping("/register")
    public ResponseEntity registerNewUser(@RequestBody LoginAndRegisterRequest request) {
        registerService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).header("Info","User created successfully!").build();
    }

    @PostMapping ("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginAndRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(loginService.login(request));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> registerUserExistsExcHandler(UserAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
}
