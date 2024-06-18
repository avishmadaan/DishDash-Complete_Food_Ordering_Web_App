import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartServiceService } from '../../services/cart-service.service';
import { Cart } from '../../Model/Cart';
import { CartDish } from '../../Model/CartDish';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cart:any[] = [];
  total:number = 0;

  @Output()
 quantityChange:EventEmitter<number> = new EventEmitter<number>()



  constructor(private cartService:CartServiceService) {}

  ngOnInit(): void {
  this.loadCart();
  }

  loadCart() {
   
    this.cart = JSON.parse(localStorage.getItem('cart' || '[]'));
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum+item.dishPrice*item.quantity, 0)
  }

  increaseQuantity(item:any) {
    item.quantity += 1;
    this.saveCart();
  }

  decreaseQuantity(item:any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.cart = this.cart.filter(cartItem => cartItem.dishName !== item.dishName);
    }
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateTotal();
    this.quantityChange.emit();
    const event = new Event('storage');
    window.dispatchEvent(event);
  }
  

}
