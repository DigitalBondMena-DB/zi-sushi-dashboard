import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  private http = inject(HttpClient);

  sendNotifications(notificationData: {}) {
    return this.http.post(`${WEB_SITE_BASE_URL}sendAllUsersNotification`, notificationData);
  }
}
