import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from '../service/common-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  @ViewChild('amountModal') private amountModal:any;
  orderList:any;
  resaleList:any;
  bookingStatus = ['BOOKED','CANCELLED','ONGOING','COMPLETED'];
  resaleStatus = ['PENDING', 'IN_PROGRESS', 'CANCELLED', 'COMPLETED'];
  selectedOrder:any;
  finalAmount:any;
  resale:boolean = false;
  constructor(private service:CommonServiceService,
    private modalService:NgbModal
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.getResaleOrders();
  }

  getOrders(){
    this.service.getAllBookings().subscribe((res:any)=>{
      this.orderList = res;
    })  
  }

  getResaleOrders(){
    this.service.getAllResaleBookings().subscribe((res:any)=>{
      this.resaleList = res;
    })  
  }

  formatDate(ms: number): string {
    return new Date(ms).toLocaleString();
  }

  changeBookingStatus(order:any, event:any){
    const bookingStatus = event.target.value;
    this.resale = false;
    if (bookingStatus === 'COMPLETED') {
      order.finalAmount = 0; // ask for value later
      this.openAmountPopup(order);
    }else{
      const bookStatus = bookingStatus as string;
      this.service.updateBookingStatus(order.id, bookStatus).subscribe((res:any)=>{
        order.status = bookingStatus;
        order.finalAmount = 0;
      })
    }
  }

  changeResaleStatus(order:any, event:any){
    const bookingStatus = event.target.value;
    this.resale = true;
    if (bookingStatus === 'COMPLETED') {
      order.finalAmount = 0; // ask for value later
      this.openAmountPopup(order);
    }else{
      const bookStatus = bookingStatus as string;
      this.service.updateResaleStatus(order.id, bookStatus).subscribe((res:any)=>{
        order.status = bookingStatus;
        order.finalAmount = 0;
      })
    }
  }

  openAmountPopup(order:any){
    this.selectedOrder = order;
    this.modalService.open(this.amountModal,{ centered: true, size:'md'})
  }

  saveBookingWithAmount(order:any, finalAmount:any){
    this.service.updateBookingAmount(order.id, finalAmount).subscribe({
      next: (res) => {
       this.cancel();
        this.getOrders()
      },
      error: (err) => {
        this.cancel();
        this.getOrders()
      }
    });
  }

  saveResaleWithAmount(order:any, finalAmount:any){
    this.service.updateResaleStatusWithAmount(order.id, finalAmount).subscribe({
      next: (res) => {
       this.cancel();
        this.getResaleOrders()
      },
      error: (err) => {
        this.cancel();
        this.getResaleOrders()
      }
    });
  }

  cancel(){
    this.getOrders()
    this.modalService.dismissAll()
  }

  save(){
    if(this.resale){
      this.saveResaleWithAmount(this.selectedOrder,this.finalAmount)
    }else{

      this.saveBookingWithAmount(this.selectedOrder,this.finalAmount)
    }
  }
}
