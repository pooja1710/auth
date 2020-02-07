import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { Errors } from '../shared/models/error.model';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './style.bundle.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }
  resetPWD: boolean = false;
  copyRight: number = new Date().getFullYear();
  loginform: boolean = true;
  userName: string = "";
  password: string = "";
  userid: any;
  errors: any;
  errorMsg: string = "";
  error_msg: boolean = false;
  mask: boolean = true;

  ngOnInit() {
  }
  resetpwd(e) {
    if (e == 'reset') this.resetPWD = true;
    else if (e == 'login') this.resetPWD = false;
  }


  eyemask() {
    var pw = document.getElementsByClassName("input-password")[0];
    var em = document.getElementById("eyemask");

    if (this.mask === true) {
      this.mask = false;
      pw.setAttribute("type", "text");
      em.setAttribute("class", "fa fa-eye open-close-eye");

    } else {
      this.mask = true;
      pw.setAttribute("type", "password");
      em.setAttribute("class", "fa fa-eye-slash open-close-eye");
    }
  };

  btnLogin() {
    this.errors = new Errors();
    const credentials = {
      'username': this.userName,
      'password': this.password
    }
    this.userService
      .attemptAuth(credentials)
      .subscribe(

        data => {
          this.userid = data;
          console.log(this.userid)
          window.localStorage['clientMasterType'] = this.userid.item.appRole;

          if (this.userid.item.appRole === "ADMIN") {
            this.router.navigate(['/admin/dashboard']);
          }
          if (this.userid.item.appRole === "CLIENT") {
            this.router.navigate(['/client/clientdashboard']);

          } else if (this.userid.item.appRole === "CUSTOMER") {
            this.router.navigate(['/customer']);
          }
          err => {
            this.errors = err;
            this.errorMsg = "Authentication Failed";
            this.error_msg = true
            /* this.errors.message.replace('Authentication Failed:','') */
          }
        });

  }
  forgot() {
    this.loginform = false;
  }
  login() {
    this.loginform = true;
  }
}

