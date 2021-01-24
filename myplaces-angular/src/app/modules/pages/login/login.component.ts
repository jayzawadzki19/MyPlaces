import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../core/service/authentication/auth.service';
import {Router} from '@angular/router';
import {Credentials} from '../../../shared/model/auth/credentials';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials: Credentials;
  loginForm: FormGroup;
  isError: boolean;

  constructor(private authService: AuthService,
              private router: Router) {
    this.credentials = {
      username: '',
      password: ''
    };
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)]))
    });
  }

  login() {
    this.credentials.username = this.loginForm.get('username').value;
    this.credentials.password = this.loginForm.get('password').value;
    this.authService.login(this.credentials)
      .subscribe(data => {
        this.isError = false;
        this.router.navigateByUrl('').then();
      }, error => {
        this.isError = true;
        throwError(error);
      });
  }
}
