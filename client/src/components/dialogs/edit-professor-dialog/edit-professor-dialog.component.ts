import { Component,ViewChild,OnInit,Inject} from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadImageService } from '@/services/upload-image/upload-image.service';

@Component({
  selector: 'app-edit-professor-dialog',
  templateUrl: './edit-professor-dialog.component.html',
  styleUrls: ['./edit-professor-dialog.component.css']
})
export class EditProfessorDialogComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  constructor(
    private matDialogRef: MatDialogRef<EditProfessorDialogComponent>,
    private _uploadService: UploadImageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.ssn = this.data.ssn;
    this.fullname = this.data.fullname;
    this.phonenumber = this.data.phonenumber;
    this.PersonGender = this.data.gender;
    this.PersonEmail = this.data.email;
    this.master = this.data.master;
    this.Address= this.data.address;
    this.phd= this.data.phd;
    this.Department = this.data.department;
    this.university = this.data.university;
    this.PersonalPhotoURL = this.data.photourl;
    this.ImgSrc = 'https://res.cloudinary.com/dnbruhgqr/image/upload/v1683030639/PersonalPhotos/' +
    this.PersonalPhotoURL +
    '.jpg'
  }

  fullname: string | null = null;
  ssn: string | null = null;
  phonenumber: string | null = null;
  PersonGender: string | null = null;
  PersonEmail: string | null = null;
  Department: string | null = null;
  serializedDate = new FormControl(new Date().toISOString()); // this.serializedDate.value
  Address: string | null = null;
  fullData: boolean = true;
  university: string | null = null;
  master: string | null = null;
  phd: string | null = null;
  genders: string[] = ['male', 'female'];
  PersonalPhoto: File[] = [];
  PersonalPhotoURL: string = '';
  ImgSrc: string = '';
  response:String = "";


  @ViewChild('myForm') form: any = NgForm;

  OnFileSelected(event: any) {
    this.PersonalPhoto.push(event.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.ImgSrc = event.target.result;
    };
  }

  async onSubmit() {
    // Uploading Image
    const img = this.PersonalPhoto[0];
    const data = new FormData();
    data.append('file', img);
    data.append('upload_preset', 'CollegeSystem');
    data.append('cloud_name', 'dnbruhgqr');
    // this._uploadService.uploadImage(data).subscribe((res) => {
    //   if (res) {
    //     this.PersonalPhotoURL = res.secure_url;
    //   }
    // });

    // Setting request attribtuesPersonalPhoto
    this.ssn = this.form.value.personDetails.ssn;
    this.fullname = this.form.value.personDetails.fullname;
    this.phonenumber = this.form.value.personDetails.phonenumber;
    this.Address = this.form.value.personDetails.Address;
    this.university = this.form.value.personDetails.university;
    this.phd = this.form.value.personDetails.phd;
    this.master = this.form.value.personDetails.master;
    this.Department = this.form.value.Department;
    this.PersonalPhotoURL = this.PersonalPhotoURL.substr(77, 20);
  

    
    const res = await fetch('http://localhost:3000/api/professors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ssn: this.ssn,
        fullname: this.fullname,
        PersonEmail: this.PersonEmail,
        PhoneNumber: this.phonenumber,
        DOB: this.serializedDate.value?.slice(0, 10),
        PersonGender: this.PersonGender,
        Address: this.Address, 
        Department: this.Department,
        PersonalPhoto: this.PersonalPhotoURL,
        university: this.university,
        master: this.master,
        phd: this.phd,
      }),
    }).then((res) => res.json());
    this.response = res.results;
    if (this.response !== "Error in creating data within Database.")
    {
      location.reload();
    }
  }
 
  onClose() {
    this.matDialogRef.close();
  }
}