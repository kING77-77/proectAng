import { Component } from '@angular/core';
import { MySerService } from '../my-ser.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  filters: any = {
    category: '',
    brand: '',
    minPrice: null,
    maxPrice: null,
    rating: null,
    keyword: ''
  };

  constructor(public service: MySerService, private router: Router) {
    this.restoreUserData();
    this.loadFilters();
  }

  restoreUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.service.isLoading = true;
      this.service.getUserData(token).subscribe({
        next: (user) => {
          this.service.userData = user;
          this.loadProducts();
        },
        error: (error) => {
          console.error('Ошибка восстановления данных пользователя:', error);
          localStorage.removeItem('token');
          this.service.userData = null;
          this.service.isLoading = false;
          this.router.navigate(['/auth']);
        }
      });
    } else {
      this.router.navigate(['/auth']);
    }
  }

  loadFilters() {
    this.service.getCategories().subscribe({
      next: (categories: any) => this.service.categories = categories,
      error: (error) => console.error('Ошибка загрузки категорий:', error)
    });

    this.service.getBrands().subscribe({
      next: (brands: any) => this.service.brands = brands,
      error: (error) => console.error('Ошибка загрузки брендов:', error)
    });
  }

  loadProducts() {
    this.service.isLoading = true;
    this.service.getAll(this.filters).subscribe({
      next: (productsData: any) => {
        this.service.products = productsData.products || productsData;
        this.service.isLoading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки продуктов:', error);
        this.service.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filters.keyword = this.service.keyword;
    this.loadProducts();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToProductDetail(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  addToCart(productId: string) {
    this.service.addToCart(productId).subscribe({
      next: () => console.log('Добавлено в корзину'),
      error: (error) => console.error('Ошибка:', error)
    });
  }
}