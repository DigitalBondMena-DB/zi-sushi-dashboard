import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IAllCategory } from "../../Interfaces/h-category/IAllCategory";
import { IAddCategoryBody } from "../../Interfaces/h-category/IAddCategoryBody";
import { ICategoryById } from "../../Interfaces/h-category/ICategoryById";
import { IAddCategoryResponse } from "../../Interfaces/h-category/IAddCategoryResponse";
import { IUpdateCategoryResponse } from "../../Interfaces/h-category/IUpdateCategory";
import { IToggleCategory } from "../../Interfaces/h-category/IToggleCategory";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getAllCategories(page: number = 1, perPage: number = 10) {
    return this.http.get<IAllCategory>(`${WEB_SITE_BASE_URL}category_index?page=${page}&limit=${perPage}`);
  }
  getCategoryById(CategoryId: string) {
    return this.http.get<ICategoryById>(`${WEB_SITE_BASE_URL}category_data/${CategoryId}`);
  }
  addCategory(categoryData: IAddCategoryBody) {
    return this.http.post<IAddCategoryResponse>(`${WEB_SITE_BASE_URL}category_store`, categoryData);
  }
  updateCategory(CategoryId: string, categoryData: IAddCategoryBody) {
    return this.http.post<IUpdateCategoryResponse>(`${WEB_SITE_BASE_URL}category_update/${CategoryId}`, categoryData);
  }
  destroyCategory(CategoryId: string) {
    return this.http.post<IToggleCategory>(`${WEB_SITE_BASE_URL}category_destroy/${CategoryId}`, {});
  }
  enableCategory(CategoryId: string) {
    return this.http.post<IToggleCategory>(`${WEB_SITE_BASE_URL}category_enable/${CategoryId}`, {});
  }
}
