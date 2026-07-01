import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IAllOrders } from "../../Interfaces/g-orders/IAllOrders";
import { IOrderById } from "../../Interfaces/g-orders/IOrderById";
import { ICurrentOrdered } from "../../Interfaces/g-orders/ICurrentOrdered";
import { IUpdateOrderStatus } from "../../Interfaces/g-orders/IUpdateOrderStatus";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  currentOrdersCount = signal(0);

  constructor(private http: HttpClient) {}

  private PLATFORM_ID = inject(PLATFORM_ID);

  orderStatus = ["placed", "confirmed", "on the way", "delivered", "cancelled"];

  getAllOrders(userId: string = "all",params:any) {
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      if (JSON.parse(localStorage.getItem("user")!).id) {
        userId = JSON.parse(localStorage.getItem("user")!).id;
      }
    }
    const filteredParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
    return this.http.post<IAllOrders>(`${WEB_SITE_BASE_URL}indextest`, {
        user_id: userId,
        ...filteredParams
    });
  }
  getOrdersManagement(userId: string = "all",params:any) {
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      if (JSON.parse(localStorage.getItem("user")!).id) {
        userId = JSON.parse(localStorage.getItem("user")!).id;
      }
    }
    const filteredParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
    return this.http.post<IAllOrders>(`${WEB_SITE_BASE_URL}order_placed_index`, {
        user_id: userId,
        ...filteredParams
    });
  }
  
  getCurrentOrders(userId: string = "all") {
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      if (JSON.parse(localStorage.getItem("user")!).branch_id) {
        userId = JSON.parse(localStorage.getItem("user")!).branch_id;
      }
    }
    if (userId !== "all") {
      return this.http.get<ICurrentOrdered>(`${WEB_SITE_BASE_URL}checkavail/${userId}`);
    } else {
      return this.http.get<ICurrentOrdered>(`${WEB_SITE_BASE_URL}checkavail/${userId}`);
    }
  }
  getOrderById(orderId: string) {
    return this.http.get<IOrderById>(`${WEB_SITE_BASE_URL}order_show/${orderId}`);
  }

  updateOrderStatus(orderId: string, orderStatus: string, isStatus: boolean) {
    return this.http.post<IUpdateOrderStatus>(`${WEB_SITE_BASE_URL}order_status_update/${orderId}`, {
      order_status: isStatus ? orderStatus : "cancelled",
    });
  }

  getNewOrders() {
    return this.http.get(`${WEB_SITE_BASE_URL}checkavail/1`);
  }
}
