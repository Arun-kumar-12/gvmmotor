import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from '../service/common-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

   @ViewChild('contactInfo') contactInfo!: TemplateRef<any>;
   adminInfo:any;
  constructor(private modal:NgbModal,
    private service:CommonServiceService
  ) { }

  ngOnInit(): void {
    this.getAdminInfo()
  }

  openContactInfo(){
    this.modal.open(this.contactInfo, { centered: true, windowClass : 'contact-modal'});
  }

  getAdminInfo(){
    this.service.getAllUsers().subscribe((data:any) => {
      this.adminInfo = data?.filter((item:any) => item.role === "ADMIN");
      
    })
  }

  cancel(){
    this.modal.dismissAll()
  }

}
