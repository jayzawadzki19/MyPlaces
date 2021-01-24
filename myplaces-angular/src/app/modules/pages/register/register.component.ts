import {Component, OnInit} from '@angular/core';
import {Credentials} from '../../../shared/model/auth/credentials';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../core/service/authentication/auth.service';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)])),
    });
  }

  signUp() {
    this.credentials.username = this.loginForm.get('username').value;
    this.credentials.password = this.loginForm.get('password').value;
    if (this.loginForm.valid) {
      this.authService.signUp(this.credentials).subscribe(data => {
        this.isError = false;
        this.router.navigateByUrl('').then();
      }, error => {
        this.isError = true;
        throwError(error);
      });
    } else {
      this.isError = false;
    }

  }
}
