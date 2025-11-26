import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CarMediaDialogComponent } from './car-media-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.css']
})
export class EditCarComponent implements OnInit {

  carForm!:FormGroup;
  carId:any = 0;
  carData:any;
  editCar:boolean = false;
  imageFile!: File;
  imagePreview: string | ArrayBuffer | null = null;
  previewImage:any;
  issueText:any;
  angularEditorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '0',
    maxHeight: '30vh',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['undo',
        'redo',
        'strikeThrough',
        'subscript',
        'superscript',
        'indent',
        'outdent',
        'insertOrderedList',
        'heading',
        'fontName',
        'textColor',
        'link',
        'unlink',
        'justifyCenter',
        'justifyRight',
        'removeFormat'
      ],
      [
        'fontSize',
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'toggleEditorMode'
      ]
    ]
  };
  carImages:any = [];

  constructor(private router:Router,
    private route:ActivatedRoute,
    private service:CommonServiceService,
    private snackbar:MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('id');
    if(this.carId){
      //fetch car details from backend and populate the form for editing
      this.editCar = true;
      this.getCarDetails(this.carId);
    }else{
      this.editCar = false;
      this.createForm()
    }
  }

  getCarDetails(id:any){
    //fetch car details from backend using id
    this.service.getCarInfoById(id).subscribe((car:any)=>{
      this.carData = car;
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
      this.createForm(this.carData);
    })
  }

  createForm(carData?:any){
    console.log("carData",carData);
    
    this.carForm = new FormGroup({
      brand:new FormControl(carData ? carData.brand : '', Validators.required),
      model:new FormControl(carData ? carData.model : '', Validators.required),
      year:new FormControl(carData ? carData.year : '', Validators.required),
      image:new FormControl(carData ? carData.imageUrl : '', Validators.required),
      registrationNumber:new FormControl(carData ? carData.registrationNumber : '', Validators.required),
      mileage:new FormControl(carData ? carData.mileage : '', Validators.required),
      color:new FormControl(carData ? carData.color : '', Validators.required),
      fuelType:new FormControl(carData ? carData.fuelType : 'Petrol', Validators.required),
      type:new FormControl(carData ? carData.type : 'Manual', Validators.required),
      seatCapacity:new FormControl(carData ? carData.seatCapacity : '', Validators.required),
      costPrice:new FormControl(carData ? carData.costPrice : '', Validators.required),
      resalePrice:new FormControl(carData ? carData.resalePrice : '', Validators.required),
      rentPerDay:new FormControl(carData ? carData.rentPerDay : '', Validators.required),
      rentPerKm:new FormControl(carData ? carData.rentPerKm : '', Validators.required),
      buyingDate:new FormControl(carData ? carData.buyingDate : '', Validators.required),
      availableForSale:new FormControl(carData ? carData.availableForResale : false),
      availableForRent:new FormControl(carData ? carData.availableForRent : false),
      description:new FormControl(carData ? carData.description : '', Validators.required),
      carIssues:new FormControl(carData ? carData?.carIssues : '', Validators.required),
      totalKilometer:new FormControl(carData ? carData.totalKilometer : '', Validators.required),
      owners:new FormControl(carData ? carData.owners : '', Validators.required),
      images: new FormControl(carData ? carData.images || {} : {}),
      video: new FormControl(carData ? carData.videoUrl || '' : ''),
      fullView: new FormControl((carData?.fullView && carData?.fullView != '') ? carData.fullView : null),
        frontView: new FormControl(carData?.frontView && carData?.frontView != '' ? carData.frontView : null),
        backView: new FormControl(carData?.backView && carData?.backView != '' ? carData.backView : null),
        rightSideView: new FormControl(carData?.rightSideView  && carData?.rightSideView != '' ? carData.rightSideView : null),
        leftSideView: new FormControl(carData?.leftSideView && carData?.leftSideView != ''? carData.leftSideView : null),
        interiorFrontSeat: new FormControl(carData?.interiorFrontSeat && carData?.interiorFrontSeat != ''? carData.interiorFrontSeat : null),
        interiorBackSeat: new FormControl(carData?.interiorBackSeat && carData?.interiorBackSeat != ''? carData.interiorBackSeat : null),
        interiorDashboard: new FormControl(carData?.interiorDashboard && carData?.interiorDashboard != ''? carData.interiorDashboard : null),
    });
    // choose preview image priority: images.fullView -> existing imageUrl -> null
    this.previewImage = (carData?.images?.fullView) ? carData.images.fullView : (carData ? carData.imageUrl : null);
    console.log("carForm",this.carForm);
    
  }

  openMediaDialog(){
    const currentMedia = {
        fullView: this.carForm.value.fullView != '' ? this.carForm.value.fullView : null,
        frontView: this.carForm.value.frontView != '' ? this.carForm.value.frontView : null,
        backView: this.carForm.value.backView != ''? this.carForm.value.backView : null,
        rightSideView: this.carForm.value.rightSideView != '' ? this.carForm.value.rightSideView : null,
        leftSideView: this.carForm.value.leftSideView != ''? this.carForm.value.leftSideView : null,
        interiorFrontSeat: this.carForm.value.interiorFrontSeat != ''? this.carForm.value.interiorFrontSeat : null,
        interiorBackSeat: this.carForm.value.interiorBackSeat != ''? this.carForm.value.interiorBackSeat : null,
        interiorDashboard: this.carForm.value.interiorDashboard != ''? this.carForm.value.interiorDashboard : null,
        video: this.carForm.value.video
    }
    if(this.carForm.value.video){
      currentMedia['video'] = this.carForm.value.video;
    }
    console.log(currentMedia);
    
    const dialogRef = this.dialog.open(CarMediaDialogComponent, {
      width: '850px',
      height:'90vh',
      data: { media: currentMedia }
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        // patch images and video
        const images = {
          fullView: result.fullView || '',
          frontView: result.frontView || '',
          backView: result.backView || '',
          rightSideView: result.rightSideView || '',
          leftSideView: result.leftSideView || '',
          interiorFrontSeat: result.interiorFrontSeat || '',
          interiorBackSeat: result.interiorBackSeat || '',
          interiorDashboard: result.interiorDashboard || ''
        };
        this.carForm.patchValue(
          { images: images, video: result.video || '',
            fullView: result.fullView || '',
            frontView: result.frontView || '',
            backView: result.backView || '',
            rightSideView: result.rightSideView || '',
            leftSideView: result.leftSideView || '',
            interiorFrontSeat: result.interiorFrontSeat || '',
            interiorBackSeat: result.interiorBackSeat || '',
            interiorDashboard: result.interiorDashboard || '',
           });
        // update main previewImage if fullView present
        if(images.fullView){
          this.previewImage = images.fullView;
          this.carForm.patchValue({ image: images.fullView });
        }
      }
    });
  }

  
goToHome(){
    this.router.navigate(['/home']);
  }

onFileSelected(event: any) {
  this.imageFile = event.target.files[0];

  // for preview
  const reader = new FileReader();
  reader.onload = () => (this.imagePreview = reader.result);
  reader.readAsDataURL(this.imageFile);

  // for saving the file name in form (optional)
  this.carForm.patchValue({
    image: this.imageFile.name
  });
  this.uploadImage(this.imageFile)
}

uploadImage(file:Blob) {
  const formData = new FormData();
  formData.append('file', file);

  this.service.uploadCarImage(formData).subscribe((res: any) => {
    const url = res.filePath?.split('/').pop();
    this.carForm.patchValue({ image: 'assets/'+ url });
    this.previewImage = 'assets/' + url;
    
  });
}

  addNewCar(){
    if(this.carForm.valid){
      const availability = this.carForm.value.availableForRent || this.carForm.value.availableForSale
      if(!availability){
        this.snackbar.open("Please Choose Any Availability",'ok',{duration:3000});
        return 
      }
      let payload = {
        brand: this.carForm.value.brand,
        model: this.carForm.value.model,
        year: this.carForm.value.year,
        imageUrl: this.carForm.value.image,
        images: this.carForm.value.images,
        fullView: this.carForm.value.images.fullView != '' ? this.carForm.value.images.fullView : null,
        frontView: this.carForm.value.images.frontView != '' ? this.carForm.value.images.frontView : null,
        backView: this.carForm.value.images.backView != ''? this.carForm.value.images.backView : null,
        rightSideView: this.carForm.value.images.rightSideView != '' ? this.carForm.value.images.rightSideView : null,
        leftSideView: this.carForm.value.images.leftSideView != ''? this.carForm.value.images.leftSideView : null,
        interiorFrontSeat: this.carForm.value.images.interiorFrontSeat != ''? this.carForm.value.images.interiorFrontSeat : null,
        interiorBackSeat: this.carForm.value.images.interiorBackSeat != ''? this.carForm.value.images.interiorBackSeat : null,
        interiorDashboard: this.carForm.value.images.interiorDashboard != ''? this.carForm.value.images.interiorDashboard : null,
        videoUrl: this.carForm.value.video,
        registrationNumber: this.carForm.value.registrationNumber,
        mileage: this.carForm.value.mileage,
        color: this.carForm.value.color,
        fuelType: this.carForm.value.fuelType,
        type: this.carForm.value.type,
        seatCapacity: this.carForm.value.seatCapacity,
        costPrice: this.carForm.value.costPrice,
        resalePrice: this.carForm.value.resalePrice,
        rentPerDay: this.carForm.value.rentPerDay,
        rentPerKm : this.carForm.value.rentPerKm,
        buyingDate: this.carForm.value.buyingDate,
        availableForResale: this.carForm.value.availableForSale,
        availableForRent: this.carForm.value.availableForRent,
        description: this.carForm.value.description,
        carIssues:this.carForm.value.carIssues,
        totalKilometer: this.carForm.value.totalKilometer,
        owners: this.carForm.value.owners,
      };
      //send payload to backend to add new car
      this.service.addNewCar(payload).subscribe((response:any)=>{
        this.snackbar.open("Car Added Successfully",'ok',{duration:3000});
        this.goToHome();
      },
      (error:any)=>{
        console.log("Error adding car:",error);
      });
    }else{
       this.snackbar.open("Please Fill the required fields",'ok',{duration:3000});
    }
  }

  editCarInfo(){
    console.log(this.carForm);
    
    if(this.carForm.valid){
      const availability = this.carForm.value.availableForRent || this.carForm.value.availableForSale;
      if(!availability){
        this.snackbar.open("Please Choose Any Availability",'ok',{duration:3000});
        return 
      }
      let payload = {
        brand: this.carForm.value.brand,
        model: this.carForm.value.model,
        year: this.carForm.value.year,
        imageUrl: this.carForm.value.image,
        images: this.carForm.value.images,
        fullView: this.carForm.value.images.fullView != '' ? this.carForm.value.images.fullView : null,
        frontView: this.carForm.value.images.frontView != '' ? this.carForm.value.images.frontView : null,
        backView: this.carForm.value.images.backView != ''? this.carForm.value.images.backView : null,
        rightSideView: this.carForm.value.images.rightSideView != '' ? this.carForm.value.images.rightSideView : null,
        leftSideView: this.carForm.value.images.leftSideView != ''? this.carForm.value.images.leftSideView : null,
        interiorFrontSeat: this.carForm.value.images.interiorFrontSeat != ''? this.carForm.value.images.interiorFrontSeat : null,
        interiorBackSeat: this.carForm.value.images.interiorBackSeat != ''? this.carForm.value.images.interiorBackSeat : null,
        interiorDashboard: this.carForm.value.images.interiorDashboard != ''? this.carForm.value.images.interiorDashboard : null,
        videoUrl: this.carForm.value.video,
        registrationNumber: this.carForm.value.registrationNumber,
        mileage: this.carForm.value.mileage,
        color: this.carForm.value.color,
        fuelType: this.carForm.value.fuelType,
        type: this.carForm.value.type,
        seatCapacity: this.carForm.value.seatCapacity,
        costPrice: this.carForm.value.costPrice,
        resalePrice: this.carForm.value.resalePrice,
        rentPerDay: this.carForm.value.rentPerDay,
        rentPerKm : this.carForm.value.rentPerKm,
        buyingDate: this.carForm.value.buyingDate,
        availableForResale: this.carForm.value.availableForSale,
        availableForRent: this.carForm.value.availableForRent,
        description: this.carForm.value.description,
        carIssues: this.carForm.value.carIssues,
        totalKilometer: this.carForm.value.totalKilometer,
        owners: this.carForm.value.owners,
      };
      //send payload to backend to edit car
      this.service.updateCar(this.carId, payload).subscribe((response:any)=>{
         this.snackbar.open("Car Edited Successfully",'ok',{duration:3000});
        this.goToHome();
      },
      (error:any)=>{
        console.log("Error editing car:",error);
      });
    }else{
       this.snackbar.open("Please Fill the required fields",'ok',{duration:3000});
    }
  }
}
