import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  private baseUrl = 'http://localhost:8080/api/';
  userLoggedIn: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http:HttpClient) { }

  emitUserLogin(value:boolean){
    this.userLoggedIn.emit(value)
  }

  loginUser(user:any): Observable<any> {
    return this.http.post(`${this.baseUrl}users/login`,user, {
      responseType: 'text',
      withCredentials: true
    });
  }

  getUserByEmail(email:any){
    return this.http.get(`${this.baseUrl}users/email/${email}`)
  }

  getAllUsers(){
    return this.http.get(`${this.baseUrl}users/all`)
  }

  addUser(user:any): Observable<any> {
    return this.http.post(`${this.baseUrl}users/register`,user, { responseType: 'text' })
  }

  editUser(id:any,user:any): Observable<any> {
    return this.http.put(`${this.baseUrl}users/edit/${id}`,user, { responseType: 'text' })
  }

  getAllCars(){
    return this.http.get(`${this.baseUrl}cars/all`)
  }

  getCarInfoById(id:any){
    return this.http.get(`${this.baseUrl}cars/${id}`)
  }

  addNewCar(car:any){
    return this.http.post(`${this.baseUrl}cars/add`,car, { responseType: 'text' })
  }

  updateCar(id:any,car:any){
    return this.http.put(`${this.baseUrl}cars/edit/${id}`,car, { responseType: 'text' })
  }

  uploadCarImage(formData: FormData) {
    return this.http.post(`${this.baseUrl}cars/upload-image`, formData);
  }

  bookCar(bookingData: any) {
    return this.http.post(`${this.baseUrl}bookings/book`, bookingData, { responseType: 'text' });
  }

  getAllBookings() {
    return this.http.get(`${this.baseUrl}bookings/orders`);
  }

  updateBookingStatus(bookingId: any, status: string) {
    return this.http.put(`${this.baseUrl}bookings/update-status/${bookingId}?status=${status}&finalAmount=0`, {}, { responseType: 'text' });
  }

  updateBookingAmount(id: number, finalAmount: number) {
    return this.http.put(`${this.baseUrl}bookings/update-status/${id}?status=COMPLETED&finalAmount=${finalAmount}`, {});
  }

  addReview(reviewData: any) {
    return this.http.post(`${this.baseUrl}reviews/add`, reviewData, { responseType: 'text' });
  }

  getRatingForCar(carId: any) {
    return this.http.get(`${this.baseUrl}reviews/car/${carId}/rating`);
  }

  getReviewsForCar(carId: any) {
    return this.http.get(`${this.baseUrl}reviews/car/${carId}`);
  }

  getAllRatings(){
    return this.http.get(`${this.baseUrl}reviews/all`);
  }

  deleteReview(reviewID:any){
    return this.http.delete(`${this.baseUrl}reviews/delete/${reviewID}`, { responseType: 'text' });
  }

  deleteUserById(userId: any) {
    return this.http.delete(`${this.baseUrl}users/delete/${userId}`, { responseType: 'text' });
  }

  bookCarForResale(carId: number, userEmail: string, userPhone: string, expectedPrice: number) {
    return this.http.post(`${this.baseUrl}resale/book`, {
      carId, userEmail, userPhone, expectedPrice
    });
  }

  getAllResaleBookings() {
    return this.http.get(`${this.baseUrl}resale/orders`);
  }

  updateResaleStatus(id: number, status: string) {
    return this.http.put(`${this.baseUrl}resale/update-status/${id}?status=${status}&finalAmount=0`, {});
  }

  updateResaleStatusWithAmount(id: number, finalAmount: number) {
  return this.http.put(`${this.baseUrl}resale/update-status/${id}?status=COMPLETED&finalAmount=${finalAmount}`, {});
}

getCarForSelectedDates(startMillis:any, endMillis:any){
  return this.http.get(`${this.baseUrl}cars/available?startMillis=${startMillis}&endMillis=${endMillis}`);
}


getOrderByEmail(email:any){
  return this.http.get(`${this.baseUrl}orders/customer/${email}`);
}

getBookedDatesForCar(carId:any){
  return this.http.get<string[]>(`${this.baseUrl}bookings/booked-dates/${carId}`); 
}


}
