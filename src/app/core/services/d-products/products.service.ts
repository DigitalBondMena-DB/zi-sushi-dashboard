import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IGetAllProducts } from "../../Interfaces/d-products/IGetAllProducts";
import { IGetProductsCategories } from "../../Interfaces/d-products/IGetProductsCategories";
import { IGetProductById } from "../../Interfaces/d-products/IGetProductById";
import { IAddProducts } from "../../Interfaces/d-products/IAddProductsResponse";
import { IUpdateProductsResponse } from "../../Interfaces/d-products/IUpdateProductsResponse";
import { IToggleProduct } from "../../Interfaces/d-products/IToggleProduct";
import { IUpdateChoiceResponse } from "../../Interfaces/d-products/IUpdateChoiceResponse";
import { IAddChoicesResponse } from "../../Interfaces/d-products/IAddChoicesResponse";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  categoryId = signal(0);

  getAllProducts(page: number = 1, perPage: number = 10) {
    return this.http.get<IGetAllProducts>(`${WEB_SITE_BASE_URL}product_index?page=${page}&limit=${perPage}`);
  }
  getAllProductsCategories() {
    return this.http.get<IGetProductsCategories>(`${WEB_SITE_BASE_URL}getcategory`);
  }
  getProductById(CategoryId: string) {
    return this.http.get<IGetProductById>(`${WEB_SITE_BASE_URL}product_data/${CategoryId}`);
  }
  addProduct(ProductData: {}) {
    return this.http.post<IAddProducts>(`${WEB_SITE_BASE_URL}product_store`, ProductData);
  }
  updateProduct(CategoryId: string, ProductData: {}) {
    return this.http.post<IUpdateProductsResponse>(`${WEB_SITE_BASE_URL}product_update/${CategoryId}`, ProductData);
  }
  destroyProduct(CategoryId: string) {
    return this.http.post<IToggleProduct>(`${WEB_SITE_BASE_URL}product_destroy/${CategoryId}`, {});
  }
  enableProduct(CategoryId: string) {
    return this.http.post<IToggleProduct>(`${WEB_SITE_BASE_URL}product_enable/${CategoryId}`, {});
  }
  updateProductChoices(ChoiceId: string, choiceBody: {}) {
    return this.http.post<IUpdateChoiceResponse>(`${WEB_SITE_BASE_URL}updatechoices/${ChoiceId}`, choiceBody);
  }
  storeProductChoices(productId: string, choiceBody: {}) {
    return this.http.post<IAddChoicesResponse>(`${WEB_SITE_BASE_URL}storechoices/${productId}`, choiceBody);
  }
  updateProductPics(piceId: string, choiceBody: {}) {
    return this.http.post<IUpdateChoiceResponse>(`${WEB_SITE_BASE_URL}updatepieces/${piceId}`, choiceBody);
  }
  storeProductPics(CategoryId: string, choiceBody: {}) {
    return this.http.post<IAddChoicesResponse>(`${WEB_SITE_BASE_URL}storepieces/${CategoryId}`, choiceBody);
  }
}
