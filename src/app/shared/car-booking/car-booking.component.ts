import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-car-booking',
  templateUrl: './car-booking.component.html',
  styleUrls: ['./car-booking.component.css']
})
export class CarBookingComponent implements OnInit {

  carBookingform!:FormGroup;
  range = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required)
  });
  // minimum selectable date for start should be today
  minDate: Date = new Date();
  constructor(public dialogRef: MatDialogRef<CarBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public receiveDialogData: any,
  private service:CommonServiceService,
private snackbar:MatSnackBar) { }

  ngOnInit(): void {
    console.log("receiveDialogData",this.receiveDialogData);
    
    this.carBookingform = new FormGroup({
      email:new FormControl(null, Validators.required),
      phone:new FormControl(null, Validators.required),
    });
  }

  cancel(){
    this.dialogRef.close();
  }

  onRangeChange() {
    // console.log('range', this.range.value)
  }

  bookCar(){
    console.log("this.carBookingform.valid",this.carBookingform.valid);
    
    if(!this.carBookingform.valid || !this.range.valid){
      this.snackbar.open("Please Fill The Required Fields",'ok',{duration:3000});
      return
    }
    const email = this.carBookingform.value.email;
    const phone = this.carBookingform.value.phone;
    const startDate = this.range.value.start;
    const endDate = this.range.value.end;
    const startMillis = new Date(startDate);
    startMillis.setHours(0, 0, 0, 0);
    const endMillis = new Date(endDate);
    endMillis.setHours(23, 59, 59, 999);

  const bookingPayload = {
    carId: this.receiveDialogData.carId,
    userEmail: email,
    userPhone: phone,
    startTimeMillis: startMillis.getTime(),
    endTimeMillis: endMillis.getTime(),
    status: 'BOOKED'
  };

  this.service.bookCar(bookingPayload).subscribe((response => {
    this.snackbar.open("Car booked successfully",'ok',{duration:3000});
    this.dialogRef.close();
  }),
  error => {
    if (error.status === 409) {
      this.snackbar.open("Sorry, this car is already booked for the selected dates. Please choose a different date range or another car.",'ok',{duration:3000});
  } else {
    this.snackbar.open("Something went wrong while booking. Please try again later.",'ok',{duration:3000});
  }
  console.error(error);   
  });
  } 

}
