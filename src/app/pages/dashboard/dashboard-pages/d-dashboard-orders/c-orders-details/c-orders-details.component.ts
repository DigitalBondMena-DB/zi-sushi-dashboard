import {
  CommonModule,
  CurrencyPipe,
  PercentPipe,
} from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { timer } from 'rxjs';
import {
  Addressinfo,
  IOrderById,
  Orderdetail,
  Promo,
} from '../../../../../core/Interfaces/g-orders/IOrderById';
import { IAllBranches } from '../../../../../core/Interfaces/j-branches/IAllBranches';
import { OrdersService } from '../../../../../core/services/g-orders/orders.service';
import { LoadingDataBannerComponent } from '../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { User } from './../../../../../core/Interfaces/g-orders/IAllOrders';

@Component({
  selector: 'app-c-orders-details',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    LoadingDataBannerComponent,
    CommonModule,
    CurrencyPipe,
    TableModule,
    PercentPipe,
    CardModule,
    ButtonModule,
    BadgeModule,
  ],
  templateUrl: './c-orders-details.component.html',
  styleUrl: './c-orders-details.component.scss',

  providers: [MessageService],
})
export class COrdersDetailsComponent {
  order!: IOrderById;

  userDetails: any[] = [];
  userAddress: Addressinfo[] = [];
  userPromoCode: Promo[] = [];
  userOrders: Orderdetail[] = [];
  allBranches!: IAllBranches;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.fetchData();
    });

    this.getCounters();
  }
  userPhones: string = '';
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Fetches and processes order data from route snapshot.
   * - Retrieves order details and branch information from route snapshot data.
   * - Extracts and compares user and address phone numbers, storing them in a formatted string.
   * - Initializes user promo codes, user details, user address, and user orders arrays.
   * - Adds user information and address information to respective arrays.
   * - Logs order combo ID and order object for debugging purposes.
   * - Populates `userOrders` with order details and updates `allBranches` with branch data.
   */

  /*******  10010e65-ab5f-4a88-9102-22e57d276945  *******/
  fetchData(): void {
    this.order = this.activatedRoute.snapshot.data['orderDetails'];
    const userPhone = this.order.order.user?.phone;
    const addressPhone = this.order.order.addressinfo?.phone;

    if (userPhone && addressPhone) {
      this.userPhones =
        userPhone === addressPhone
          ? userPhone
          : `${userPhone} - ${addressPhone}`;
    } else {
      this.userPhones = userPhone || addressPhone || '';
    }
    this.userPromoCode = [];
    this.userDetails = [];
    this.userAddress = [];
    this.userDetails.push(this.order.order.user);
    this.userAddress.push(this.order.order.addressinfo);
    if (this.order.order.promo) {
      this.userPromoCode.push(this.order.order.promo);
    }
    console.log('allllllllllll orders ', this.order.order.combo_id);
    console.log('allllllllllll orders ', this.order.order);
    this.userOrders = this.order.orderdetails;
    this.allBranches = this.activatedRoute.snapshot.data['branches'];
  }

  backToOrders(): void {
    if (this.router.url.includes('history')) {
      this.router.navigate(['/dashboard/orders/history']);
    } else {
      this.router.navigate(['/dashboard/orders/']);
    }
  }

  findBranches(id: number): string | undefined {
    return this.allBranches.branches.data.find((e) => e.id === id)
      ?.en_branch_city;
  }

  getItemDescription(item: Orderdetail): string {
    let details = [];

    if (item.quantity) {
      details.push(`${item.quantity}x`);
    }

    if (item.pieces) {
      details.push(`${item.pieces} pcs`);
    }

    if (item.product_name) {
      details.push(item.product_name);
    }

    return details.join(' ');
  }

  getTotalPrice(orderdetails: Orderdetail[]): number {
    return orderdetails.reduce((sum, item) => sum + item.price, 0);
  }

  printOrderReceipt() {
    const receiptContent = document.getElementById('receipt-section');

    // Extract values from order object
    const order = this.order.order; // Assuming order is available in the component
    const subtotal = order.sub_total;
    const totalPrice = order.total_price;
    const serviceCharge = order.service_money;
    const delivery = order.delivry_value;
    const happy = order.happy_hours_discount;
    const appDiscount = order.app_discount;
    const ziDiscount = order.zi_points_discount;
    const orderNote = order.note_text;

    const vat = order.taxes_money; // Extracted from total

    if (receiptContent) {
      const printWindow = window.open(
        '',
        'ZiSushiReceipt',
        'width=800,height=900'
      );

      const happyValue = this.convertStringToNumber(happy);
      const disCountAppValue = this.convertStringToNumber(appDiscount);
      // Build the happy hours row only if value is not zero
      const printedReceiptRows = {
        appDiscountRow: disCountAppValue !==0? 
        `<tr>
              <td>App Discount:</td>
              <td>${disCountAppValue}</td>
            </tr>`:''
        ,
        happyRow:
          happyValue !== 0
            ? `<tr>
              <td>Happy hours:</td>
              <td>${happyValue}</td>
            </tr>`
            : '',
        ziDiscountRow:
          this.convertStringToNumber(ziDiscount) !== 0
            ? `
    <tr>
      <td>Zi Points:</td>
      <td>${this.convertStringToNumber(ziDiscount)}</td>
    </tr>
  `
            : '',
      };
      

      printWindow?.document.write(`
        <html>
        <head>
          <title>Zi Sushi - Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; padding: 0; }
            h2 { text-align: center; background-color: #f0f0f0; padding: 10px; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .total { text-align: right; font-weight: bold; margin-top: 10px; }
            @media print {
              body { margin: 10px; }
              .p-button-outlined { display: none; } /* Hide buttons in print */
              #not-show-print { display: none !important; } /* Hide the not-show-print div when printing */
              @page { margin: 0.5cm; }
              @page :footer { display: none; }
              @page :header { display: none; }
            }
            /* Hide URL at the bottom of the page */
            body::after {
              content: "";
              display: block;
              height: 0;
              visibility: hidden;
            }
          </style>
        </head>
        <body>
          ${receiptContent.innerHTML}
          <h2>Receipt</h2>
          <table>
            <tr>
              <td>Subtotal:</td>
              <td>${subtotal.toFixed(2)} EGP</td>
            </tr>
            <tr>
              <td>Service Charge:</td>
              <td>${serviceCharge}</td>
            </tr>
            <tr>
              <td>VAT:</td>
              <td>${vat}</td>
            </tr>
              <tr>
              <td>Delivery:</td>
              <td>${delivery}</td>
            </tr>
             </tr>
            ${Object.values(printedReceiptRows).filter(Boolean).join('')}
            <tr>
              <td><strong>Total:</strong></td>
              <td><strong>${totalPrice.toFixed(2)} EGP</strong></td>
            </tr>
          </table>
          <p class="total">Printed on: ${new Date().toLocaleString()}</p>
          <script>
            // Hide the about:blank text by setting the document title
            document.title = "Zi Sushi - Order Receipt";
            // Remove any footer text that might appear
            window.onbeforeprint = function() {
              // Force focus to ensure the browser treats this as the active window
              window.focus();
            };
          </script>
        </body>
        </html>
      `);

      printWindow?.document.close();
      printWindow?.focus();
      printWindow?.print();
      printWindow?.close();
    }
  }

  statusSteps = ['placed', 'confirmed', 'on the way', 'delivered', 'cancelled'];
  private ordersService = inject(OrdersService);
  messageService = inject(MessageService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  getStatusClass(status: string): string {
    switch (status) {
      case 'placed':
        return 'bg-yellow-200 text-yellow-800'; // Light Yellow
      case 'confirmed':
        return 'bg-blue-200 text-blue-800'; // Light Blue
      case 'on the way':
        return 'bg-orange-200 text-orange-800'; // Light Orange
      case 'delivered':
        return 'bg-green-200 text-green-800'; // Light Green
      case 'cancelled':
        return 'bg-red-200 text-green-800'; // Light Green
      default:
        return ''; // Default (no styling)
    }
  }
  getAvailableStatusOptions(currentStatus: string) {
    const statusWithIcons = [
      { label: 'Placed', value: 'placed', icon: 'pi pi-inbox text-yellow-500' },
      {
        label: 'Confirmed',
        value: 'confirmed',
        icon: 'pi pi-check-circle text-blue-500',
      },
      {
        label: 'On The Way',
        value: 'on the way',
        icon: 'pi pi-truck text-orange-500',
      },
      {
        label: 'Delivered',
        value: 'delivered',
        icon: 'pi pi-box text-green-500',
      },
      {
        label: 'cancelled',
        value: 'cancelled',
        icon: 'pi pi-times text-green-500',
      },
    ];

    const currentIndex = this.statusSteps.indexOf(currentStatus);

    // ✅ Disable previous steps
    return statusWithIcons.map((status, index) => ({
      ...status,
      disabled: index < currentIndex,
    }));
  }

  updateOrderStatus(order: any, isStatus: boolean) {
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear('orderStatusMessage');
    this.ordersService
      .updateOrderStatus(order.id.toString(), order.status, isStatus)
      .subscribe({
        next: (response) => {
          timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader')
          );
          order = response.order;
          this.messageService.add({
            severity: 'success',
            summary: 'Status Updated',
            detail: `Order status changed to "${order.status}"`,
            life: 3000,
            key: 'orderStatusMessage',
          });
          if (!isStatus) {
          }
        },
        error: (err) => {
          timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader')
          );
          console.error('Error updating status', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: 'Could not update order status.',
            life: 3000,
            key: 'orderStatusMessage',
          });
        },
      });
  }

  counter: number[] = [];

  getCounters() {
    const length = this.userOrders.length;
    this.counter = Array.from({ length }, (_, i) => i);
    console.log(this.counter);
  }

  convertStringToNumber(value: string): number {
    return Number(value);
  }
}
