import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonServiceService } from 'src/app/service/common-service.service';

interface MediaSlot {
  key: string;
  label: string;
  type: 'image' | 'video';
  file?: File | null;
  preview?: string | ArrayBuffer | null;
  url?: string;
}

@Component({
  selector: 'app-car-media-dialog',
  templateUrl: './car-media-dialog.component.html',
  styleUrls: ['./car-media-dialog.component.css']
})
export class CarMediaDialogComponent {

  slots: MediaSlot[] = [
    { key: 'fullView', label: 'Full view', type: 'image' },
    { key: 'frontView', label: 'Front view', type: 'image' },
    { key: 'backView', label: 'Back view', type: 'image' },
    { key: 'rightSideView', label: 'Right Side View', type: 'image' },
    { key: 'leftSideView', label: 'Left Side View', type: 'image' },
    { key: 'interiorFrontSeat', label: 'Interior front seat', type: 'image' },
    { key: 'interiorBackSeat', label: 'Interior Back seat', type: 'image' },
    { key: 'interiorDashboard', label: 'Interior Dashboard', type: 'image' },
    { key: 'video', label: 'Video', type: 'video' }
  ];

  uploading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CarMediaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CommonServiceService
  ) {
    // populate existing urls if provided
    if (data) {
      const incoming = data.media || {};
      this.slots.forEach(s => {
        if (incoming[s.key]) {
          s.url = incoming[s.key];
        }
      });
    }
  }

  onFileChange(event: any, slot: MediaSlot) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    slot.file = file;

    // preview
    if (slot.type === 'image') {
      const reader = new FileReader();
      reader.onload = () => slot.preview = reader.result;
      reader.readAsDataURL(file);
      // upload immediately
      this.uploadSlot(slot);
    } else if (slot.type === 'video') {
      // show a simple preview (object URL)
      slot.preview = URL.createObjectURL(file);
      this.uploadSlot(slot);
    }
  }

  uploadSlot(slot: MediaSlot) {
    if (!slot.file) return;
    this.uploading = true;
    const formData = new FormData();
    formData.append('file', slot.file as Blob);

    // reuse uploadCarImage endpoint for both image and video if backend supports it
    this.service.uploadCarImage(formData).subscribe((res: any) => {
      const url = res.filePath?.split('/').pop();
      slot.url = 'assets/' + url;
      this.uploading = false;
    }, (err:any) => {
      console.error('Upload error', err);
      this.uploading = false;
    });
  }

  removeSlot(slot: MediaSlot) {
    slot.file = null;
    slot.preview = null;
    slot.url = '';
  }

  save() {
    // create a map of urls
    const result: any = {};
    this.slots.forEach(s => {
      result[s.key] = s.url || '';
    });
    this.dialogRef.close(result);
  }

  close() {
    this.dialogRef.close(null);
  }

}
