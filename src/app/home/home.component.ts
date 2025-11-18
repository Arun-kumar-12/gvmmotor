import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonServiceService } from '../service/common-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddReviewComponent } from '../shared/add-review/add-review.component';
import { start } from 'repl';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(null,Validators.required),
    end: new FormControl(null,Validators.required)
  });
  // minimum selectable date for start should be today
  minDate: Date = new Date();
  carList:any[] = [];
  adminRole:boolean = false;
  selectedFilter:string = 'all';
  carReviewData:any;
  @ViewChild('filters') filters!: TemplateRef<any>;

  constructor(private service:CommonServiceService,
    private router:Router,
    private modalDialog:MatDialog,
    private modal:NgbModal,
    private snackbar:MatSnackBar
  ) { }

  ngOnInit(): void {
    // optionally subscribe to value changes:
    this.adminRole = sessionStorage.getItem("userRole") === 'ADMIN';
    this.range.valueChanges.subscribe(val => {
    this.onSearch()
    });

    // ensure end date is not before start; clear end if it's before new start
    this.range.get('start')?.valueChanges.subscribe((start: Date | null) => {
      if (start) {
        const endControl = this.range.get('end');
        const endVal = endControl?.value;
        if (endVal && new Date(endVal) < new Date(start)) {
          endControl?.setValue(null);
        }
      }
    });
    this.getCars();
    this.getRatings();
  }

  onRangeChange() {
    console.log('range', this.range.value);
  }

  getCars(){
    //fetch cars from backend
    this.service.getAllCars().subscribe((cars:any)=>{
      this.carList = cars?.filter((car:any) => car.active);
      this.filterCarList(this.carList)
    })
  }

  getRatings(){
    this.service.getAllRatings().subscribe((cars:any) => {
      this.carReviewData = cars;
      console.log("carReviewData",this.carReviewData);
      
    }, error => {
      this.snackbar.open("Error getting data",'ok',{duration:3000});
    })
  }

  getCarsAsset(index:any){
    return "assets/car" + (index + 1) + ".jpg" || 'assets/car1.jpg' ;
  }

  routeToCarInfo(id:any){
    this.router.navigate(['/car/info/'+id]);
  }

  goToAddNewCar(){
    this.router.navigate(['/car/add']);
  }

  addReviewPopup(carData:any){
    this.modalDialog.open(AddReviewComponent,{
          panelClass:'car-booking-modal',
          data: {
            carData: carData
          }
        });
  }

  onSearch(){
    if(this.range.valid){
      this.carList = []
      const startMillis = new Date(this.range.value.start).getTime();
      const endMillis = new Date(this.range.value.start).getTime();
      this.service.getCarForSelectedDates(startMillis,endMillis).subscribe((response:any) => {
        this.carList = response?.filter((car:any) => car.active);
        this.filterCarList(this.carList)
      })
    }else{
      this.snackbar.open("Please select the end date",'ok',{duration:3000});
    }
  }

  filterChange(){
    if(this.range.valid){
      this.onSearch()
    }else{
      this.getCars()
    }
  }

  filterCarList(carList:any){
    if(this.selectedFilter == 'all'){
      this.carList = carList
    }else if(this.selectedFilter == 'rent'){
      this.carList = carList?.filter((car:any) => car?.availableForRent)
    }else if(this.selectedFilter == 'sale'){
      this.carList = carList?.filter((car:any) => car?.availableForResale)
    }
  }

  openFilter(){
    // this.modal.open(this.filters)
    this.modal.open(this.filters, { centered: true, size: 'sm'});
  }

  cancel(){
    this.modal.dismissAll()
  }

  getAvgRating(carId:any){
    if(this.carReviewData?.length > 0){
      let reviewData = this.carReviewData?.filter((car:any) => car.carId === carId)
      console.log(reviewData);
      if(reviewData?.length > 0){
        let totalRating = 0;
        reviewData?.forEach((res:any) =>{
          totalRating = totalRating + (res.rating)
        })
        return totalRating / (reviewData?.length)
      }else{
        return 0
      }
    }else{
      return 0
    }
  }
}
