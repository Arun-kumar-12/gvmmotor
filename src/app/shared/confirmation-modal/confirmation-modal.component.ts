import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,
      @Inject(MAT_DIALOG_DATA) public receiveDialogData: any) { }

  ngOnInit(): void {
    console.log("data",this.receiveDialogData);
    
  }

  cancel(){
    this.dialogRef.close()
    // Close modal without action
  }

  confirm(){
    this.dialogRef.close({delete:true})
  }

}
