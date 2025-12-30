import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../../interfaces/product';
import { Auth } from '../../../auth/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
})
export class Products implements OnInit {
  private _product = inject(Product);
  private _auth = inject(Auth);
  private _router = inject(Router);

  products$: Observable<IProduct[]> = this._product.products$;

  products: IProduct[] = [];

  editingId: number | null = null;
  name = '';
  price = 0;
  stock = 0;

  formErrors = {
    name: '',
    price: '',
    stock: ''
  };

  showDeletePopup = false;
  productToDelete: { id: number, name: string } | null = null;

  ngOnInit() {
    this.products$.subscribe(products => {
      this.products = products;
    });
  }

  validateForm(): boolean {
    let isValid = true;
    this.formErrors = { name: '', price: '', stock: '' };

    if (!this.name || this.name.trim() === '') {
      this.formErrors.name = 'Product name is required';
      isValid = false;
    }

    if (this.price <= 0) {
      this.formErrors.price = 'Price must be greater than 0';
      isValid = false;
    }

    if (this.stock < 0) {
      this.formErrors.stock = 'Stock cannot be negative';
      isValid = false;
    }

    return isValid;
  }

  save() {
    if (!this.validateForm()) return;

    const productData: IProduct = {
      id: this.editingId || 0,
      name: this.name,
      price: this.price,
      stock: this.stock
    };

    if (this.editingId) {
      this._product.update(productData);
    } else {
      this._product.add(productData);
    }

    this.reset();
  }

  edit(p: IProduct) {
    this.editingId = p.id;
    this.name = p.name;
    this.price = p.price;
    this.stock = p.stock;
    this.formErrors = { name: '', price: '', stock: '' };
  }

  deleteProduct(id: number) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      this.productToDelete = { id, name: product.name };
      this.showDeletePopup = true;
    }
  }

  confirmDelete() {
    if (this.productToDelete) {
      this._product.delete(this.productToDelete.id);
      this.closeDeletePopup();
    }
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
    this.productToDelete = null;
  }

  reset() {
    this.editingId = null;
    this.name = '';
    this.price = 0;
    this.stock = 0;
    this.formErrors = { name: '', price: '', stock: '' };
  }

  logout() {
    this._auth.logout();
    this._router.navigate(['/login']);
  }
}
