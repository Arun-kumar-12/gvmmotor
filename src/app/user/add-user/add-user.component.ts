import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm!:FormGroup;
  editMode: boolean = false;
  userRole:any;
  constructor(public dialogRef: MatDialogRef<AddUserComponent>,
      @Inject(MAT_DIALOG_DATA) public receiveDialogData: any,
    private service:CommonServiceService, 
  private snackbar:MatSnackBar) { }

  ngOnInit(): void {
    if(this.receiveDialogData && this.receiveDialogData.userData){
      this.editMode = true
      this.createUserForm(this.receiveDialogData.userData);
      // Populate form with user data for editing
    } else {
      this.editMode = false;
      this.createUserForm();
      // Initialize empty form for adding new user
    }
    this.userRole = this.receiveDialogData?.userRole || 'CUSTOMER'
  }

  createUserForm(userData?:any){

    // Create form group and controls here
    this.userForm = new FormGroup({
      firstName: new FormControl(userData ? userData.firstName : ''),
      lastName: new FormControl(userData ? userData.lastName : ''),
      email: new FormControl(userData ? userData.email : ''),
      password: new FormControl(userData ? userData.password : ''),
      mobile:new FormControl(userData ? userData.mobile : ''),
      role: new FormControl(userData ? userData.role : ''),
    });
  }

  cancel(){
    this.dialogRef.close();
  }

  addUser(){
    if(this.userForm.valid){
      const userPayload = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        mobile:this.userForm.value.mobile,
        role: this.userRole
      };
      // Call service to add or update user
      this.service.addUser(userPayload).subscribe((response)=>{
        this.snackbar.open("User Added Sucessfulyy",'ok',{duration:3000});
        this.dialogRef.close({delete:true}); // Close dialog and indicate success
      },
      (error)=>{
        console.log("Error adding/updating user:", error);
      });
    }
  }

  editUser(){
    // Similar to addUser but for editing existing user
    if(this.userForm.valid){
      const userPayload = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        mobile:this.userForm.value.mobile,
        role: this.userRole
      };
      // Call service to add or update user
      this.service.editUser(this.receiveDialogData?.userData?.id,userPayload).subscribe((response)=>{
        this.snackbar.open("User Edited Successfully",'ok',{duration:3000});
        this.dialogRef.close(true); // Close dialog and indicate success
      },
      (error)=>{
        console.log("Error adding/updating user:", error);
      });
    }
  }

}
