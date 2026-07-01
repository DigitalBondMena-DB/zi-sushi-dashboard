import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Input,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { interval, Subscription } from 'rxjs';
import { NewOrders } from '../../../core/Interfaces/g-orders/ICurrentOrdered';
import { DashboardLayoutService } from '../../../core/services/core/dashboard-layout.service';
import { OrdersService } from '../../../core/services/g-orders/orders.service';

@Component({
  selector: 'app-dashboard-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SidebarModule,
    InputTextModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    BadgeModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './dashboard-top-bar.component.html',
  styleUrl: './dashboard-top-bar.component.scss',
})
export class DashboardTopBarComponent {
  @Input() isShow: boolean = true;

  notifications: NewOrders[] = [];

  showNotifications: boolean = false;

  items!: MenuItem[];

  private ordersService = inject(OrdersService);

  private notificationSubscription: Subscription | undefined;

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  layoutService = inject(DashboardLayoutService);

  _PLATFORM_ID = inject(PLATFORM_ID);

  previousOrders: NewOrders[] = []; // Track previous orders
  lastSeenOrderCount: number = 0; // The last count user has seen
  unseenOrdersCount: number = 0; // Number of new orders not seen yet
  showAlert: boolean = false; // Show the alert dialog
  audio!: HTMLAudioElement; // Notification sound

  ngOnInit(): void {
    this.requestNotificationPermission(); // Request desktop notification permission
    this.fetchNotifications();
    this.updateTitle();
    // Poll API every 10 seconds
    this.notificationSubscription = interval(30000).subscribe(() => {
      this.fetchNotifications();
    });

    // Initialize the alert sound
    this.audio = new Audio('assets/sounds/notification.mp3'); // Ensure this file exists
    this.audio.loop = true; // Keep playing until stopped
  }

  // Request permission for desktop notifications
  requestNotificationPermission(): void {
    if (isPlatformBrowser(this._PLATFORM_ID) && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          console.warn('Desktop notification permission denied');
        }
      });
    }
  }

  // Show desktop notification for new orders with clickable link
  showDesktopNotification(newOrderCount: number): void {
    if (
      isPlatformBrowser(this._PLATFORM_ID) &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      const notification = new Notification('Zi Sushi - New Orders!', {
        body: `${newOrderCount} new order(s) received! Click to view.`,
        icon: './assets/images/Login_Logo.png', // Optional: Use your logo
      });
      notification.onclick = () => {
        window.open(
          'https://the-sushi-dashboard-61t4.vercel.app/dashboard/orders/orders',
          '_blank'
        );
      };
    }
  }

  fetchNotifications() {
    console.log('fetchNotifications');
    this.ordersService.getCurrentOrders().subscribe({
      next: (response) => {
        console.log('responseeeeeeeeee', response.orders.length);
        if (!response?.orders) return;

        const currentOrderCount = response.orders.length;
        this.ordersService.currentOrdersCount.set(response.orders.length);
        this.updateTitle();

        if (currentOrderCount < this.lastSeenOrderCount) {
          this.lastSeenOrderCount = currentOrderCount;
        }
        if (currentOrderCount > this.lastSeenOrderCount) {
          this.unseenOrdersCount = currentOrderCount - this.lastSeenOrderCount;
          console.log('before alert', this.showAlert);
          if (!this.showAlert) {
            this.showAlert = true;
            console.log('before alert', this.showAlert);
            this.audio
              .play()
              .catch(() => console.warn('Audio blocked by browser'));
            this.showDesktopNotification(this.unseenOrdersCount);
          }
        }
        this.previousOrders = [...response.orders];
        this.notifications = response.orders;
        console.log('this.notifications', this.notifications.length);
      },
      error: (error) => {
        console.log('error', error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  updateTitle() {
    const originalTitle = 'Zi Sushi';
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (this.notifications.length > 0) {
        document.title = `Zi Sushi (${this.notifications.length}) New Orders`;
      } else {
        document.title = originalTitle; // Restore original title
      }
    }
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe(); // Prevent memory leaks
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  stopNotification() {
    this.showAlert = false; // Close the alert
    this.audio.pause(); // Stop the sound
    this.audio.currentTime = 0; // Reset sound
    this.lastSeenOrderCount = this.notifications.length; // Update last seen count
    this.unseenOrdersCount = 0; // Reset unseen count
  }
}
