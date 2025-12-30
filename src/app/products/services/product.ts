import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../interfaces/product';

const STORAGE_KEY = 'products';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private productsSubject: BehaviorSubject<IProduct[]>;

  products$;

  constructor() {
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    const initialProducts: IProduct[] = storedProducts
      ? JSON.parse(storedProducts)
      : [
        { id: 1, name: 'Laptop', price: 1000, stock: 5 },
        { id: 2, name: 'Mouse', price: 20, stock: 0 },
      ];

    this.productsSubject = new BehaviorSubject<IProduct[]>(initialProducts);
    this.products$ = this.productsSubject.asObservable();
  }

  private saveToStorage(products: IProduct[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  add(product: IProduct): void {
    const current = this.productsSubject.value;
    const newProduct = { ...product, id: Date.now() };
    const updatedProducts = [...current, newProduct];
    this.productsSubject.next(updatedProducts);
    this.saveToStorage(updatedProducts);
  }

  update(product: IProduct): void {
    const updatedProducts = this.productsSubject.value.map(p =>
      p.id === product.id ? product : p
    );
    this.productsSubject.next(updatedProducts);
    this.saveToStorage(updatedProducts);
  }

  delete(id: number): void {
    const updatedProducts = this.productsSubject.value.filter(p => p.id !== id);
    this.productsSubject.next(updatedProducts);
    this.saveToStorage(updatedProducts);
  }
}
