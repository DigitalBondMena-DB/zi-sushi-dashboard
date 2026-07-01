import { Component, ElementRef, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { isPlatformBrowser } from '@angular/common';
import { DashboardLayoutService } from '../../../core/services/core/dashboard-layout.service';
import { DashboardMenuItemsComponent } from '../dashboard-menu-items/dashboard-menu-items.component';
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { LoyaltyPointsService } from '../../../core/services/f-loyaltypoints/loyalty-points.service';

@Component({
  selector: 'app-dashboard-side-bar',
  standalone: true,
  imports: [ConfirmDialogModule, DashboardMenuItemsComponent, DialogModule, ToastModule],
  templateUrl: './dashboard-side-bar.component.html',
  styleUrl: './dashboard-side-bar.component.scss',
  providers: [ConfirmationService],
})
export class DashboardSideBarComponent {
  model: any[] = [];
  loyaltyPointsStatus:boolean = false;
  isAdmin = false;
  constructor(
    public layoutService: DashboardLayoutService,
    public el: ElementRef,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: Object,
    private _Router: Router,
    private _ConfirmationService: ConfirmationService,
    private messageService: MessageService,
    private _LoyaltyPointsService:LoyaltyPointsService
  ) {}
  showModal = signal<boolean>(false);
  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (JSON.parse(localStorage.getItem('user')!).role === 'super-admin')
        this.isAdmin = true;
    }
    this.getLoyaltyPointsStatus();
    this.initSideBar();
  }

  initSideBar(): void {
    if (this.isAdmin) {
      this.model = [
        {
          label: 'Home',
          items: [
            {
              label: 'Dashboard',
              icon: 'pi pi-fw pi-chart-bar',
              routerLink: ['/dashboard'],
            },
          ],
        },
        {
          label: 'Offers',
          items: [
            {
              label: 'Hot Box Offers',
              icon: 'pi pi-fw pi-bolt',
              routerLink: ['/dashboard/offers/boxes'],
            },
            {
              label: 'Free Choice Offer',
              icon: 'pi pi-fw pi-box',
              routerLink: ['/dashboard/offers/combo'],
            },
            {
              label: 'Promo Codes',
              icon: 'pi pi-fw pi-qrcode',
              routerLink: ['/dashboard/offers/promo-codes'],
            },
            {
              label: 'Vouchers',
              icon: 'pi pi-fw pi-ticket',
              routerLink: ['/dashboard/offers/vouchers'],
            },
            {
              label: 'Loyalty Points',
              icon: 'pi pi-trophy',
              command: () => {this.handleLoyaltyPoints()},
              type:"switch",
              isActiveLoyaltyPoints:this.loyaltyPointsStatus
            },
            {
              label: 'Happy Hours',
              icon: 'pi pi-stopwatch',
              routerLink: ['/dashboard/offers/happy-hours'],
            },
          ],
        },
        {
          label: 'Menu',
          items: [
            {
              label: 'Categories',
              icon: 'pi pi-fw pi-list',
              routerLink: ['/dashboard/menu/categories'],
            },
            {
              label: 'Products',
              icon: 'pi pi-fw pi-th-large',
              routerLink: ['/dashboard/menu/products'],
            },
            // {
            //   label: "Add New Product",
            //   icon: "pi pi-fw pi-plus",
            //   routerLink: ["/dashboard/products/add"],
            // },
          ],
        },
        {
          label: 'Orders',
          items: [
            {
              label: 'Order Management',
              icon: 'pi pi-fw pi-truck',
              routerLink: ['/dashboard/orders/orders'],
            },
            {
              label: 'Order History',
              icon: 'pi pi-fw pi-history',
              routerLink: ['/dashboard/orders/history'],
            },
          ],
        },
        {
          label: 'Users',
          items: [
            {
              label: 'Manage Users',
              icon: 'pi pi-fw pi-users',
              routerLink: ['/dashboard/users'],
            },
          ],
        },
        {
          label: 'Pages',
          items: [
            {
              label: 'Sliders',
              icon: 'pi pi-fw pi-images',
              routerLink: ['/dashboard/pages/sliders'],
            },
            {
              label: 'Tutorial',
              icon: 'pi pi-fw pi-list-check',
              routerLink: ['/dashboard/pages/tutorial'],
            },
            {
              label: 'About Us',
              icon: 'pi pi-fw pi-info-circle',
              routerLink: ['/dashboard/pages/about-us'],
            },
            {
              label: 'Privacy Policy',
              icon: 'pi pi-fw pi-lock',
              routerLink: ['/dashboard/pages/privacy-policy'],
            },
          ],
        },
        {
          label: 'Areas',
          items: [
            {
              label: 'Manage Locations',
              icon: 'pi pi-fw pi-map-marker',
              routerLink: ['/dashboard/sub-locations'],
            },
          ],
        },
        {
          label: 'Notifications',
          items: [
            {
              label: 'Send Notifications',
              icon: 'pi pi-fw pi-mobile',
              routerLink: ['/dashboard/notifications'],
            },
          ],
        },
        {
          label: 'Contact Us',
          items: [
            {
              label: 'Manage Branches',
              icon: 'pi pi-fw pi-home',
              routerLink: ['/dashboard/contact-us/branches'],
            },
            {
              label: 'Social Media',
              icon: 'pi pi-fw pi-share-alt',
              routerLink: ['/dashboard/contact-us/social-links'],
            },
            {
              label: 'Inbox',
              icon: 'pi pi-fw pi-envelope',
              routerLink: ['/dashboard/contact-us/messages'],
            },
          ],
        },
        {
          label: 'Settings',
          items: [
            {
              label: 'App Version',
              icon: 'pi pi-fw pi-mobile',
              routerLink: ['/dashboard/app-version'],
            },
            {
              label: 'Dashboard Settings',
              icon: 'pi pi-fw pi-cog',
            },
            {
              label: 'Logout',
              icon: 'pi pi-fw pi-sign-out',
              command: () => this.logout(),
            },
          ],
        },
      ];
    } else {
      this.model = [
        {
          label: 'Home',
          items: [
            {
              label: 'Dashboard',
              icon: 'pi pi-fw pi-chart-bar',
              routerLink: ['/dashboard'],
            },
          ],
        },
        {
          label: 'Orders',
          items: [
            {
              label: 'Track Orders',
              icon: 'pi pi-fw pi-truck',
              routerLink: ['/dashboard/orders/orders'],
            },
            {
              label: 'Order History',
              icon: 'pi pi-fw pi-history',
              routerLink: ['/dashboard/orders/history'],
            },
          ],
        },
        {
          label: 'Notifications',
          items: [
            {
              label: 'Send Notifications',
              icon: 'pi pi-fw pi-mobile',
              routerLink: ['/dashboard/notifications'],
            },
          ],
        },
        {
          label: 'Settings',
          items: [
            {
              label: 'App Version',
              icon: 'pi pi-fw pi-mobile',
              routerLink: ['/dashboard/app-version'],
            },
            {
              label: 'Dashboard Settings',
              icon: 'pi pi-fw pi-cog',
            },
            {
              label: 'Logout',
              icon: 'pi pi-fw pi-sign-out',
              command: () => this.logout(),
            },
          ],
        },
      ];
    }
  }

  logout(): void {
    this._ConfirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'No',
      acceptLabel: 'Yes',
      closeOnEscape: true,
      acceptButtonStyleClass: 'p-button-danger mx-2',

      accept: () => {
        localStorage.removeItem('user');
        this._Router.navigate(['/login']);
      },
      reject: () => {},
    });
  }
  handleLoyaltyPoints() {
  console.log('Loyalty toggled: ');
  this._ConfirmationService.confirm({
      message: `Are you you want ${this.loyaltyPointsStatus? 'deactivate':'activate'} loyalty points`,
      header: 'Loyalty points confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'No',
      acceptLabel: 'Yes',
      closeOnEscape: true,
      acceptButtonStyleClass: 'p-button-danger mx-2',
      accept: () => {
        this.changeLoyaltyPointsStatus();
      },
    });
}
getLoyaltyPointsStatus():void {
  this._LoyaltyPointsService.getLoyaltyPointsStatus().subscribe({
    next:(res) => {
      this.loyaltyPointsStatus = res.is_active ?? false;
      this.initSideBar()
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'failed when get Loyalty points data', life: 3000 });
    }
  })
}
changeLoyaltyPointsStatus():void {
  this._LoyaltyPointsService.toggleLoyaltyPointsStatus().subscribe({
    next:(res)=>{
      this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Successfully ${this.loyaltyPointsStatus? 'deactivate':'activate'} loyalty points` });
      this.loyaltyPointsStatus = res.is_active ?? false;
      this.initSideBar()
  },
  error:()=>{
  this.messageService.add({ severity: 'error', summary: 'Error', detail: `failed when ${this.loyaltyPointsStatus?"activate":"deactivate"}`, life: 3000 });
  }
})
}
}
