import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';
import { customer } from '../../Model/customer';
import { RouterService } from '../../services/router.service';
import { FileHandle } from '../../Model/file-handle';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  customerJwt: string;
  pictureForm: FormGroup;
  profilePictureUrl: SafeUrl | null = null;
  customerImage: FileHandle;
  imageLoading:boolean=false
  showPictureErr:boolean=false;
  
  activeCustomer: customer = {
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPassword: ''
  };
  profilePicture:boolean=false;
  url:string  = `https://via.placeholder.com/50x50`
  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private routerService: RouterService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.pictureForm = this.fb.group({
      file: ['',Validators.required]
    });
  }
  onSubmit(): void {
    if (this.pictureForm.invalid) {
      return;
    }
    this.imageLoading=true;
    const imageFormData = this.prepareFormData(this.customerImage);
    this.userService.updateImage( imageFormData,this.cookieService.get('token')).subscribe({
      next: data => {
        console.log('Profile picture uploaded successfully', data);
        this.userService.profilePictureUpdation();
        this.fetchActiveCustomer();
      
      },
      error: err => {
        this.imageLoading=false;
        this.profilePicture=true;
        this.fetchActiveCustomer()
        console.log('Error while uploading profile picture', err);
        if(err.error=="Only JPEG and PNG files are allowed."){
        
            this.showPictureErr=true;
            setTimeout(()=> {
              this.showPictureErr=false;
            },3000)
        }
      }
    });
    this.resetForm();
  }
  resetForm() {
    this.pictureForm.reset();
    this.profilePicture = false;
    this.url = '';
  }
  prepareFormData(customerImage: FileHandle): FormData {
    const formData = new FormData();
    formData.append('image', customerImage.file);
    return formData;
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.click();
    } else {
        console.error('File input element not found');
    }
}
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
      };
      this.customerImage = fileHandle;
      this.pictureForm.patchValue({ file: file });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePictureUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
 
  ngOnInit(): void {
    this.fetchActiveCustomer();
   
  }
  fetchActiveCustomer() {
    this.customerJwt = this.cookieService.get("token");
    let pic:string=""
    this.userService.fetchCustomerByJwt(this.customerJwt).subscribe({
      next: data => {
        this.activeCustomer = data;
        if(this.activeCustomer.customerProfilePic)
          {
            
            this.url ="http://127.0.0.1:5501/src/assets/profile-pictures/"+`${this.activeCustomer.customerProfilePic}`;

            this.profilePicture=true;
            this.imageLoading=false;
          }
      },
      error: data => {
        console.log("Error while fetching customer");
      }
    });
  }
  logout() {
    this.userService.loggingOutFromProfile(true);
    this.routerService.navigateToHomePage();
  }
}