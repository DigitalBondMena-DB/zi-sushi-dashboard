import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { timer } from 'rxjs';
import { NotificationsService } from '../../../../core/services/n-notifications/notifications.service';

@Component({
  selector: 'app-l-notifications',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './l-notifications.component.html',
  styleUrl: './l-notifications.component.scss',
  providers: [MessageService],
})
export class LNotificationsComponent {
  notificationForm: FormGroup;
  isEditing = false;
  branchId: string | null = null;

  private fb = inject(FormBuilder);
  private notificationsService = inject(NotificationsService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);

  constructor() {
    this.notificationForm = this.fb.group({
      textmessage: ['', Validators.required],
      titlemessage: ['', Validators.required],
    });
  }

  sendNotification() {
    this.notificationForm.markAllAsTouched();
    if (this.notificationForm.invalid) return;
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();
    const notificationData = this.notificationForm.value;

    this.notificationsService
      .sendNotifications(notificationData)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sent',
          detail: 'Notification Sent successfully',
        });
        timer(500).subscribe(() =>
          this.ngxSpinnerService.hide('actionsLoader')
        );
        this.notificationForm.reset();
      });
  }
}
