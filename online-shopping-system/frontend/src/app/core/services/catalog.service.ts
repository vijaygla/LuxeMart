import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Product, ProductListResponse, Review } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/v1/catalog';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category);
  }

  getProducts(params?: {
    search?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    in_stock_only?: boolean;
    page?: number;
    page_size?: number;
  }): Observable<ProductListResponse> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.category_id) httpParams = httpParams.set('category_id', params.category_id.toString());
      if (params.min_price !== undefined) httpParams = httpParams.set('min_price', params.min_price.toString());
      if (params.max_price !== undefined) httpParams = httpParams.set('max_price', params.max_price.toString());
      if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
      if (params.in_stock_only) httpParams = httpParams.set('in_stock_only', 'true');
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.page_size) httpParams = httpParams.set('page_size', params.page_size.toString());
    }
    return this.http.get<ProductListResponse>(`${this.baseUrl}/products`, { params: httpParams });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  addReview(productId: number, review: { rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/products/${productId}/reviews`, review);
  }
}
