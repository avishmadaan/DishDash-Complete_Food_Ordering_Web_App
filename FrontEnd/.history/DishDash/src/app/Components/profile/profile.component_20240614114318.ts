import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';
import { customer } from '../../Model/customer';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  customerJwt:string;
  constructor(private cookieservice:CookieService, private userService:UserService, private routerservice:RouterService) {}
  activeCustomer:customer ={
    customerName: '',
    customerEmail: '',
    customerPassword: '',
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;
    
        img.onload = () => {
          if (img.width > 100 || img.height > 100) {
            alert('Profile photo should have 100 width and 100 height');
            console.log(img.src);
          } else {
            const profileImage = document.getElementById('profileImage') as HTMLImageElement;
            profileImage.src = e.target.result;
            console.log(profileImage.src);
          }
        };
      };

      reader.readAsDataURL(file);
    }
  }


  ngOnInit():void {
    
    // this.routerservice.navigateToFavOption();
    this.customerJwt = this.cookieservice.get("token")

    this.userService.fetchCustomerByJwt(this.customerJwt).subscribe({
      next:data => {
        this.activeCustomer = data;
      },
      error:data => {
        console.log("Error while Fetchin Customer")
      }
    })

  }

  logout() {
    this.cookieservice.delete("token");
    this.routerservice.navigateToHomePage();
  }

  profilePictureUpdate() {
    
  }

}
