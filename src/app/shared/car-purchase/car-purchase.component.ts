import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-car-purchase',
  templateUrl: './car-purchase.component.html',
  styleUrls: ['./car-purchase.component.css']
})
export class CarPurchaseComponent implements OnInit {

  carPurchaseForm!:FormGroup
  constructor(
    public dialogRef: MatDialogRef<CarPurchaseComponent>,
        @Inject(MAT_DIALOG_DATA) public receiveDialogData: any,
      private service:CommonServiceService,
    private snackbar:MatSnackBar
  ) { }

  ngOnInit(): void {
        this.carPurchaseForm = new FormGroup({
          email:new FormControl('', Validators.required),
          phone:new FormControl('', Validators.required),
          expectedPrice:new FormControl('', Validators.required)
        });
  }

    cancel(){
    this.dialogRef.close();
  }


  bookCar(){
    if(!this.carPurchaseForm.valid){
      this.snackbar.open("Please Fill The Required Fields",'ok',{duration:3000});
      return
    }
    const email = this.carPurchaseForm.value.email;
    const phone = this.carPurchaseForm.value.phone;
    const expectedPrice = this.carPurchaseForm.value.expectedPrice;

  this.service.bookCarForResale(this.receiveDialogData?.carId,email, phone, expectedPrice ).subscribe((response)=>{
    this.snackbar.open("Car purchase request submitted successfully",'ok',{duration:3000});
    this.dialogRef.close(); 
  },
  (error)=>{
    console.log(error);
    this.snackbar.open("Car purchase request failed. Please try again.",'ok',{duration:3000});
  });
}

}
