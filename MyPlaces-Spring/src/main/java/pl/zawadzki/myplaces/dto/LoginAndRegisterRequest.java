package pl.zawadzki.myplaces.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginAndRegisterRequest {
    private String username;
    private String password;
}
