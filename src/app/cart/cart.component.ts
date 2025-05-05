import { Component } from '@angular/core';
import { MySerService } from '../my-ser.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,          // 👈 помечаем компонент как standalone
  imports: [                  // 👈 указываем необходимые модули
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private service: MySerService) {
    this.loadCart();
  }

  loadCart() {
    this.service.getCart().subscribe({
      next: (data: any) => {
        this.cartItems = data.items;
        this.calculateTotal();
      },
      error: (error) => console.error('Ошибка загрузки корзины:', error)
    });
  }

  updateQuantity(item: any, quantity: number) {
    this.service.updateCartItem(item.id, quantity).subscribe({
      next: () => this.loadCart(),
      error: (error) => console.error('Ошибка обновления количества:', error)
    });
  }

  removeItem(itemId: string) {
    this.service.removeCartItem(itemId).subscribe({
      next: () => this.loadCart(),
      error: (error) => console.error('Ошибка удаления товара:', error)
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
