import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IGetAllUsers } from "../../Interfaces/p-users/IGetAllUsers";
import { IGetUserById } from "../../Interfaces/p-users/IGetUserById";
import { IUpdateUserBody } from "../../Interfaces/p-users/IUpdateUserBody";
import { IUpdateUserResponse } from "../../Interfaces/p-users/IUpdateUserResponse";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAllUsers(page: number = 1, perPage: number = 10) {
    return this.http.get<IGetAllUsers>(`${WEB_SITE_BASE_URL}user_index?page=${page}&limit=${perPage}`);
  }

  getUserById(userId: string) {
    return this.http.get<IGetUserById>(`${WEB_SITE_BASE_URL}user_show/${userId}`);
  }

  updateUser(userId: string, userData: IUpdateUserBody) {
    return this.http.post<IUpdateUserResponse>(`${WEB_SITE_BASE_URL}user_update/${userId}`, userData);
  }

  enableSelectedUsers(userId: string, userData: {}) {
    return this.http.post<any>(`${WEB_SITE_BASE_URL}user_update/${userId}`, userData);
  }

  disableSelectedUsers(userId: string, userData: {}) {
    return this.http.post<any>(`${WEB_SITE_BASE_URL}user_update/${userId}`, userData);
  }
}
