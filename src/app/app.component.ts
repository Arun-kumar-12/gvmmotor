import { Component } from '@angular/core';
import { CommonServiceService } from './service/common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gvmmotor';
  constructor(private service:CommonServiceService){}

  ngOnInit(): void {
    if(sessionStorage.getItem("userId")){
      this.service.emitUserLogin(true);
    }
  }
}
