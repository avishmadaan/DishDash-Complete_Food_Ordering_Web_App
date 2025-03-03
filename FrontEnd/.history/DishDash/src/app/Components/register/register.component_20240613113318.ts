import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { customer } from '../../Model/customer';
import { UserService } from '../../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { MatDialogRef } from '@angular/material/dialog';
import { customerLogin } from '../../Model/customerLogin';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  uniqueId:string = '';
  isLoading:boolean = false;
  uuidString: string = uuidv4();
  uuidCart:string=uuidv4();

  userlogin:customerLogin = {
    customerEmail: '',
    customerPassword : ''
  };

    constructor(private fb:FormBuilder, private userService:UserService, public dialogRef:MatDialogRef<RegisterComponent>, public cookieService:CookieService){}


    registerForm=this.fb.group({
      customerId:[this.uuidString],
      customerName:['',[Validators.required,Validators.minLength(3),Validators.pattern(/^[a-zA-Z ]+$/)]],
      customerEmail:['',[Validators.required,Validators.pattern(/^\S+@\S+\.\S+$/)]],
      customerPassword:['',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword:['',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      customerCartId:[this.uuidCart]
    },{validators:this.checkPassowrdMisMatch})

    get customerId()
    {
      return this.registerForm.get('customerId');
    }
    get customerName(){
      return this.registerForm.get('customerName');
    }

    get customerEmail()
    {
      return this.registerForm.get('custonerEmail');
    }

    get customerPassword()
    {
      return this.registerForm.get('customerPassword');
    }

    get confirmPassword()
    {
      return this.registerForm.get('confirmPassword');
    }

    get customerCartId()
    {
      return this.registerForm.get('customerCartId');
    }

    // get customerProfilePic()
    // {
    //   return this.registerForm.get('customerProfilePic');
    // }

    // get customerPhone()
    // {
    //   return this.registerForm.get('customerPhone');
    // }

    // get address1()
    // {
    //   return this.registerForm.get('customerAddress.address1');
    // }
    // get landmark()
    // {
    //   return this.registerForm.get('customerAddress.landmark');
    // }
    // get city()
    // {
    //   return this.registerForm.get('customerAddress.city');
    // }
    // get pinCode()
    // {
    //   return this.registerForm.get('customerAddress.pinCode');
    // }
    // get currentLocation()
    // {
    //   return this.registerForm.get('customerAddress.currentLocation');
    // }
    
    onSubmit ()
    {
      this.isLoading=true;
      let registerCustomer:any=this.registerForm.value as any;
      console.log(registerCustomer);
      this.userService.registerUser(registerCustomer).subscribe({
        next:data=>{
          this.isLoading = false;
            console.log(data);
            this.userlogin.customerEmail = data.customerEmail
            this.userlogin.customerPassword = data.customerPassword
            this.closeDialoge();
            console.log("LoginDetails")
            console.log(this.userlogin);
            this.loginUser(this.userlogin);
        },
        error:err=>{
          this.isLoading = false;
            console.log("Error",err);
            
        }
      })
      
    }


    checkPassowrdMisMatch(c:AbstractControl)
    {
      const password=c.get('customerPassword');
      console.log(password);
      
      const confirmPass=c.get('confirmPassword');
      console.log(confirmPass);
      if (!password?.value || !confirmPass?.value) {
        return null;
      }
      console.log(password.value === confirmPass.value ? null : { passwordMismatch: true });
      
  
      return password.value === confirmPass.value ? null : { passwordMismatch: true };
    }


    loginUser(userlogin:customerLogin) {
      let customerJWT:string;
      this.userService.loginUser(userlogin).subscribe({
        next:data => {
          console.log(data);
          customerJWT = data;
          this.cookieService.set("token",customerJWT);
          this.afterLogin();
  
        },
        error:e => {
          console.log(e);
        }
      })
  
    }
  
    afterLogin() {
      this.userService.login(true)
  
    }

    closeDialoge(){
this.dialogRef.close()
    }
}

