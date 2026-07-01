import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { get } from "http";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IGetAllMessages } from "../../Interfaces/l-contact-form/IGetAllMessages";
import { IGetMessageById } from "../../Interfaces/l-contact-form/IGetMessageById";

@Injectable({
  providedIn: "root",
})
export class ContactUsInboxService {
  constructor(private http: HttpClient) {}

  getContactUsMessages() {
    return this.http.get<IGetAllMessages>(`${WEB_SITE_BASE_URL}feedback_index`);
  }
  getContactUsMessagesById(messageId: string) {
    return this.http.get<IGetMessageById>(`${WEB_SITE_BASE_URL}feedback_data/${messageId}`);
  }
}
