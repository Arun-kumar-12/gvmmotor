import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {
  reviewForm!:FormGroup
currentRate = 1;
  constructor(public dialogRef: MatDialogRef<AddReviewComponent>,
      @Inject(MAT_DIALOG_DATA) public receiveDialogData: any,
    private service:CommonServiceService,
  private snackbar:MatSnackBar) { }

  ngOnInit(): void {
    this.reviewForm = new FormGroup({
          email:new FormControl({value: this.receiveDialogData.userMail ? this.receiveDialogData.userMail : '', disabled: false},Validators.required),
          userName:new FormControl('',Validators.required),
          description:new FormControl('',Validators.required),
        });

        if (this.receiveDialogData?.userMail) {
          this.reviewForm.get('email')?.disable();   // <-- this works!
          // this.reviewForm.get('email')?.setValue(this.receiveDialogData.userMail);
        }
  }

  addReview(){ 
    if(!this.reviewForm.valid){
      this.snackbar.open("Please fill the required fields",'ok',{duration:3000});
      return;
    }
    console.log(this.reviewForm.value);
    
    let payload = {
      carId: this.receiveDialogData.carData.id,
      userEmail: this.receiveDialogData.userMail ? this.receiveDialogData.userMail : this.reviewForm.value.email,
      userName: this.reviewForm.value.userName,
      rating: this.currentRate,
      description: this.reviewForm.value.description
    }
    this.service.addReview(payload).subscribe((response)=>{
      this.snackbar.open("Review added successfully",'ok',{duration:3000});
      this.dialogRef.close();
    },
    (error)=>{
      console.log(error);
      this.snackbar.open("Only who completed the ride can add review.",'ok',{duration:3000});
    });
  }

  cancel(){
    this.dialogRef.close();
  }

}
