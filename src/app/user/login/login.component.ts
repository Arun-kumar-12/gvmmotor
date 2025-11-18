import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup

  constructor(private snackbar:MatSnackBar, private service:CommonServiceService,
    private router:Router, private modalDialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    });
  }

  onSubmit(){
    if(this.loginForm.valid){
      let payload = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.service.loginUser(payload).subscribe((response)=>{
        if(response === 'User is present'){
          this.service.getUserByEmail(this.loginForm.value.email).subscribe((user:any) => {
            sessionStorage.setItem("userId",user.id)
            sessionStorage.setItem("userEmail",user.email)
            sessionStorage.setItem("userRole",user.role);
            this.service.emitUserLogin(true);
            this.router.navigate(['/home'])
          })
        }else{
          this.snackbar.open(response,'ok',{duration:3000});
        }
      },
      (error)=>{
        console.log(error);
        this.snackbar.open("Login Failed. Please try again.",'ok',{duration:3000});
      });
    }else{
      this.snackbar.open("Please fill all the required fields",'ok',{duration:3000});
    }
  }

  addUser(){
    const dialogRef = this.modalDialog.open(AddUserComponent, {
      panelClass: 'car-booking-modal',
      data: {
        userData: null,
        userRole: 'CUSTOMER'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('AddUser dialog result', result);
      if (result) {
        this.snackbar.open('Please Login', 'ok', { duration: 3000 });
      }
    });
  }

}
