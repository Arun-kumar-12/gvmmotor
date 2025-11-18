import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonServiceService } from '../service/common-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddReviewComponent } from '../shared/add-review/add-review.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userForm!:FormGroup;
  userData:any;
  orderData:any;
  constructor(private service:CommonServiceService,
    private router:Router,
    private snackbar:MatSnackBar,
    private modal:MatDialog
  ) { }

  ngOnInit(): void {
    this.getUserDetails()
  }

  getUserDetails(){
    const userEmail =  sessionStorage.getItem("userEmail")
    this.service.getUserByEmail(userEmail).subscribe((res:any)=>{
      this.userData = res;
      this.createUserForm(this.userData);
      this.getOrderByEmailId(this.userData?.email)
    })
  }

  getOrderByEmailId(email:any){
    this.service.getOrderByEmail(email).subscribe((data:any) => {
      console.log("order",data);
      this.orderData = data
    })
  }

    createUserForm(userData?:any){
  
      this.userForm = new FormGroup({
        firstName: new FormControl(userData ? userData.firstName : ''),
        lastName: new FormControl(userData ? userData.lastName : ''),
        email: new FormControl(userData ? userData.email : ''),
        password: new FormControl(userData ? userData.password : ''),
        mobile:new FormControl(userData ? userData.mobile : ''),
        role: new FormControl(userData ? userData.role : ''),
      });
    }

    goBack(){
      this.router.navigate(['/home']);
    }

    goToCarInfo(carId:any){
      this.router.navigate(['/car/info/'+ carId]);
      
    }

    editUser(){
       if(this.userForm.valid){
      const userPayload = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        mobile:this.userForm.value.mobile,
        role: this.userData.role
      };
      // Call service to add or update user
      this.service.editUser(this.userData?.id,userPayload).subscribe((response)=>{
        this.snackbar.open("User Edited Successfully",'ok',{duration:3000});
      },
      (error)=>{
        console.log("Error adding/updating user:", error);
      });
    }
    }

    addReviewPopup(order:any){
          this.modal.open(AddReviewComponent,{
                panelClass:'car-booking-modal',
                data: {
                  carData: order.cars,
                  userMail: sessionStorage.getItem("userEmail")
                }
              });
    
              this.modal.afterAllClosed.subscribe((response:any)=>{
                  this.getUserDetails();
              });
        }

}
