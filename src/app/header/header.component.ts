import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonServiceService } from '../service/common-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showLoginButton: boolean = true;
  showLogoutButton:boolean = false;
  adminRole:boolean = false;
  constructor(private router:Router,
    private service:CommonServiceService
  ) {
    this.service.userLoggedIn.subscribe(res => {
      this.showLogoutButton = res;
      this.adminRole = sessionStorage.getItem("userRole") === 'ADMIN';
    })
   }

  ngOnInit(): void {
    this.updateButtons(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEnd = event as NavigationEnd;
      this.updateButtons(navEnd.urlAfterRedirects);
    });
  }

  private updateButtons(url: string) {
    this.showLoginButton = !url.includes('login');
  }

  goToLogin(){
    this.showLoginButton = false;
    this.router.navigate(['/user']);
  }

  goToHome(){
    this.showLoginButton = true;
    this.router.navigate(['/home']);
  }

  logout(){
    sessionStorage.clear();
    this.showLoginButton = false;
    this.service.emitUserLogin(false)
    this.goToLogin()
  }

  goToOrders(){
    this.router.navigate(['/orders']);
  }

  goToUsers(){
    this.router.navigate(['/user/list']);
  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }

}
