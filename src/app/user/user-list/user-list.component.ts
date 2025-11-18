import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList:any;
  adminRole:boolean = false;
  constructor(private service:CommonServiceService,
    private modalDialog:MatDialog
  ) { }

  ngOnInit(): void {
     this.adminRole = sessionStorage.getItem("userRole") === 'ADMIN';
    this.getUsers()
  }

  getUsers(){
    // Dummy data for demonstration
    this.service.getAllUsers().subscribe((res:any)=>{
      this.userList = res;
    })
  }

  addNewUser(userData?:any){
    // Navigate to add user page
    this.modalDialog.open(AddUserComponent,{
          panelClass:'car-booking-modal',
          data: {
            userData: userData,
            userRole:'USER'
          }
        });
    this.modalDialog.afterAllClosed.subscribe((response:any)=>{
        this.getUsers();
    });
  }

  openDeleteUserModal(userData:any){
    // Call service to delete user
    const dialogRef = this.modalDialog.open(ConfirmationModalComponent,{
      panelClass:'car-booking-modal',
      data: {
        userData: userData,
        heading:"Delete User",
        message:"Are you sure you want to delete this user?"
      }
    });
    dialogRef.afterClosed().subscribe((response:any)=>{
      if(response?.delete){
        this.deleteUser(userData)
      }
    });
  }

  deleteUser(userData:any){
    this.service.deleteUserById(userData?.id).subscribe((response:any) => {
      this.getUsers()
    },error => {
      console.log(error);
      alert(error)
    })
  }

}
