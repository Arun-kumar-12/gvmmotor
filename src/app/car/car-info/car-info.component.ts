import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CarBookingComponent } from 'src/app/shared/car-booking/car-booking.component';
import { AddReviewComponent } from 'src/app/shared/add-review/add-review.component';
import { CarPurchaseComponent } from 'src/app/shared/car-purchase/car-purchase.component';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css']
})
export class CarInfoComponent implements OnInit {

  carId:any;
  carData:any;
  adminRole:boolean = false;
  carRatings:any;
  carImages:any = [];
  bookedDates: Date[] = [];
  carBookedDate:boolean = false;
  constructor(private router:Router,
    private route:ActivatedRoute,
    private service:CommonServiceService,
    private modal:MatDialog,
    private snackbar:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('id');
    this.adminRole = sessionStorage.getItem("userRole") === 'ADMIN';
    this.getCarDetails(this.carId);
    this.loadBookedDates()
    this.getRatingsForCar();
  }

  getCarDetails(id:any){
    //fetch car details from backend using id
    this.service.getCarInfoById(id).subscribe((car:any)=>{
      this.carData = car;
      console.log("this.carData",this.carData);
      
      this.carImages = 
      [
        this.carData?.fullView || this.carData?.imageUrl,
        this.carData?.frontView,
        this.carData?.backView,
        this.carData?.rightSideView,
        this.carData?.leftSideView,
        this.carData?.interiorFrontSeat,
        this.carData?.interiorBackSeat,
        this.carData?.interiorDashboard
      ].filter(img => img);

      console.log("carImages", this.carImages);
      
    })
  }

  goToHome(){
    // this.router.navigate(['/home']);
    window.history.back()
  }

  goToEdit(){
    this.router.navigate(['/car/edit/'+this.carId]);
  }

  openBookingModal(){
    this.modal.open(CarBookingComponent,{
      panelClass:'car-booking-modal',
      data: {
        carId: this.carId,
        carData: this.carData
      }
    });

    this.modal.afterAllClosed.subscribe((response:any)=>{
        this.loadBookedDates();
    });
  }

  openBuyModal(){
    this.modal.open(CarPurchaseComponent,{
      panelClass:'car-booking-modal',
      data: {
        carId: this.carId,
        carData: this.carData
      }
    });
  }

  addReviewPopup(){
      this.modal.open(AddReviewComponent,{
            panelClass:'car-booking-modal',
            data: {
              carData: this.carData
            }
          });

          this.modal.afterAllClosed.subscribe((response:any)=>{
              this.getRatingsForCar();
          });
    }

    getRatingsForCar(){
      this.service.getReviewsForCar(this.carId).subscribe((res:any)=>{
        this.carRatings = res;
      })
    }  

  // getUserColor(name: string): string {
  //   const colors = ['#89CFF0', '#0047AB','#9FE2BF', '#7393B3', '#CCCCFF', '#0818A8'];
  //   const index = name.charCodeAt(0) % colors.length;
  //   return colors[index];
  // }


    getAvgRating(){
      if(this.carRatings?.length > 0){
        let totalRating = 0;
        this.carRatings?.forEach((res:any) =>{
          totalRating = totalRating + (res.rating)
        })
        return totalRating / (this.carRatings?.length)
      }else{
        return 0
      }
    }

    deleteReviewModal(rating:any){
      const dialogRef = this.modal.open(ConfirmationModalComponent,{
            panelClass:'car-booking-modal',
            data: {
              userData: rating,
              heading:"Delete Review",
              message:"Are you sure you want to delete this review?"
            }
          });
          dialogRef.afterClosed().subscribe((response:any)=>{
            if(response?.delete){
              this.deleteReview(rating)
            }
          });
    }

    deleteReview(rating:any){
      this.service.deleteReview(rating?.id).subscribe((data) => {
        this.snackbar.open("Review Deleted Successfully",'ok',{duration:3000});
        this.getRatingsForCar();
      }, error => {
        this.snackbar.open("Error Deleting Review",'ok',{duration:3000});
      })
    }

    loadBookedDates() {
      console.log("Called");
      
      this.carBookedDate = false;
      this.service.getBookedDatesForCar(this.carId).subscribe((dates: string[]) => {
        this.bookedDates = dates.map(d => new Date(d));
        console.log("this.bookedDates",this.bookedDates);
        this.carBookedDate = true;
      });
    }

    /** This function will be called by the calendar for every date */
    dateClass: MatCalendarCellClassFunction<Date>  = (cellDate: Date): string => {
      console.log("cellDate",cellDate);
      // const cellDateStr = cellDate.toDateString();
      // console.log("cellDateStr",cellDateStr);
      console.log("bookedDates",this.bookedDates);
      
      const isBooked = this.bookedDates.some(d =>
        new Date(d).toDateString() == new Date(cellDate).toDateString() 
      );
      console.log("isBooked",isBooked);
      
      return isBooked ? 'booked-date' : '';
    };
}
