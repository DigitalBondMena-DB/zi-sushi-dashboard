import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { debounceTime, finalize, Subject, takeUntil, tap, timer } from 'rxjs';
import { ISelectOptions } from '../../../../../core/Interfaces/core/ISelectOptions';
import {
  IAllOrders,
  OrderData,
} from '../../../../../core/Interfaces/g-orders/IAllOrders';
import { IAllBranches } from '../../../../../core/Interfaces/j-branches/IAllBranches';
import { OrdersService } from '../../../../../core/services/g-orders/orders.service';
import { LoadingDataBannerComponent } from '../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { TooltipModule } from "primeng/tooltip";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

@Component({
  selector: 'app-b-orders-history',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    RouterLink,
    DropdownModule,
    ToastModule,
    LoadingDataBannerComponent,
    TableModule,
    CommonModule,
    NgxDaterangepickerMd,
    NoDataFoundBannerComponent,
    TooltipModule
],
  templateUrl: './b-orders-history.component.html',
  styleUrl: './b-orders-history.component.scss',
  providers: [MessageService],
})
export class BOrdersHistoryComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>()
  orders!: OrderData[];
  allOrders!: IAllOrders;
  totalRecords!: number;
  search$ = new Subject<string>();
  statusSteps = ['placed', 'confirmed', 'on the way', 'delivered', 'cancelled'];
  allBranches!: IAllBranches;
  isAdmin = true;
  private ordersService = inject(OrdersService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private activatedRoute = inject(ActivatedRoute);
  messageService = inject(MessageService);
  selectedStatus: string = '';
  
  isSingleDatePicker = false;
  selectedRange: any = {
    startDate: dayjs().subtract(7, 'day').toDate(),
    endDate: dayjs().toDate(),
  };
  filterParams: any = {
    page: 1,
    limit: 50,
    sortField: 'id',
    sortOrder: '',
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    single_date: '',
  };

  constructor() {
    effect(() => {
      this.ordersService.currentOrdersCount();
      this.loadOrders();
    });
  }

  ngOnInit(): void {
    this.search$.pipe(debounceTime(1000)).subscribe((value)=>{
      this.filterParams.search =  value;
      this.reloadOrders();
    })
    this.allBranches = this.activatedRoute.snapshot.data['branches'];
    this.initDropDownFilter();
    this.loadOrders();
  }

  loadOrders() {
    this.ngxSpinnerService.show("actionsLoader")
    this.ordersService.getAllOrders("",this.filterParams).pipe(
      finalize(()=>{this.ngxSpinnerService.hide("actionsLoader")}),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.allOrders = data;

        this.orders = this.allOrders.orders.data;
        this.totalRecords = data.orders.total;
        
      },
      error: (error) => {
        console.error('Failed to load orders', error);
      },
    });
  }

  getStatusIndex(status: string): number {
    return this.statusSteps.indexOf(status);
  }

  getSteps(): MenuItem[] {
    return this.statusSteps.map((step) => ({ label: step }));
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
            this.removeOrder(response.order.id);
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

  removeOrder(orderId: number) {
    this.orders = this.orders.filter((order) => order.id !== orderId);
  }

  findBranches(id: number): string | undefined {
    return this.allBranches.branches.data.find((e) => e.id === id)
      ?.en_branch_city;
  }
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
      disabled: index,
    }));
  }

  // Dropdown
  
  selectOptions: ISelectOptions[] = [];
  onFilterChange(value: string) {

  this.selectedStatus = value;  
  this.reloadOrders()
}

  initDropDownFilter(): void {
    this.selectOptions = [
      {
        label: 'delivered',
        value: '0',
      },
      {
        label: 'cancelled',
        value: '0',
      },
    ];
  }
  getPagination(): number[] {
    if (this.totalRecords === 0) return [0];

    const options = [10, 100, 500, 1000];
    const validOptions = options.filter((opt) => opt <= this.totalRecords);

    if (!validOptions.includes(this.totalRecords)) {
      validOptions.push(this.totalRecords);
    }

    return validOptions.sort((a, b) => a - b);
  }

  clear(dt: Table): void {
console.log("clear");

    this.filterParams.startDate = ""
    this.filterParams.endDate = ""
    this.reloadOrders()

  }

  /**
   * Date Filter
   */

  isDropdownOpen = false;


  datePresets: any = {
    Today: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    Yesterday: [
      dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    ],
    'Last 7 Days': [
      dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
    'Last 30 Days': [
      dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
    'This Month': [
      dayjs().startOf('month').format('YYYY-MM-DD'),
      dayjs().endOf('month').format('YYYY-MM-DD'),
    ],
    'Last Month': [
      dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
    ],
    'Custom Range': null,
  };

  // datePresetsKeys = Object.keys(this.datePresets);
  selected!: { start: Dayjs; end: Dayjs };

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  applyFilter() {
    this.isDropdownOpen = false;

    const startDate = this.selectedRange?.startDate
      ? dayjs(this.selectedRange.startDate).format('YYYY-MM-DD')
      : undefined;
    const endDate = this.selectedRange?.endDate
      ? dayjs(this.selectedRange.endDate).format('YYYY-MM-DD')
      : undefined;

    if (this.isSingleDatePicker) {
      this.filterParams.startDate = '';
      this.filterParams.endDate = '';
      this.filterParams.single_date = startDate || '';
    } else {
      this.filterParams.startDate = startDate || '';
      this.filterParams.endDate = endDate || '';
      this.filterParams.single_date = '';
    }

    this.reloadOrders();
  }

  onDateSelected(event: any) {
    this.selectedRange = event;
  }
  reloadOrders():void {
  this.filterParams.sortOrder = this.filterParams.sortOrder === 1 ? 'asc' : 'desc';
  this.filterParams.status = this.selectedStatus || "";
  this.loadOrders()
  }
loadOrdersLazy(event: TableLazyLoadEvent) {
  this.filterParams.sortField = event.sortField ?? 'order_date';
  this.filterParams.limit = event.rows ?? 50;
  this.filterParams.page = (event.first ?? 0) / this.filterParams.limit + 1;
  this.filterParams.sortOrder = event.sortOrder === 1 ? 'asc' : event.sortOrder === -1 ? 'desc' : '';
  this.loadOrders();
}
onSearchInput(event: Event) {
  const input = event.target as HTMLInputElement;
  this.search$.next(input.value);
}

ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
}
}
