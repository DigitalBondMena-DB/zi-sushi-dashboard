import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { debounceTime, finalize, Subject, takeUntil, timer } from 'rxjs';
import { ISelectOptions } from '../../../../../core/Interfaces/core/ISelectOptions';
import {
  IAllOrders,
  OrderData,
} from '../../../../../core/Interfaces/g-orders/IAllOrders';
import { IAllBranches } from '../../../../../core/Interfaces/j-branches/IAllBranches';
import { OrdersService } from '../../../../../core/services/g-orders/orders.service';
import { LoadingDataBannerComponent } from '../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

@Component({
  selector: 'app-a-orders',
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
    NoDataFoundBannerComponent,
    NgxDaterangepickerMd,
  ],
  templateUrl: './a-orders.component.html',
  styleUrl: './a-orders.component.scss',
  providers: [MessageService],
})
export class AOrdersComponent implements OnInit,OnDestroy {
  destroy$ = new Subject<void>()
  orders: OrderData[] = [];
  allOrders!: IAllOrders;
    search$ = new Subject<string>();
  statusSteps = ['placed', 'confirmed', 'on the way', 'delivered'];
  allBranches!: IAllBranches;
  totalRecords!: number;
  isAdmin = true;
  selectedRange: any = {
    startDate: dayjs().subtract(7, 'day').toDate(),
    endDate: dayjs().toDate(),
  };
  filterParams:any = {
    page: 1,
    limit:50,
    sortField:'id',
    sortOrder:'',
    search: "",
    status: '',
    startDate: "",
    endDate: "",
  };
  private ordersService = inject(OrdersService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private activatedRoute = inject(ActivatedRoute);
  messageService = inject(MessageService);

  // Date Filter Properties
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

  selected!: { start: Dayjs; end: Dayjs };

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
    this.initDropDownFilter();
    this.allBranches = this.activatedRoute.snapshot.data['branches'];    
    this.loadOrders();
  }

  loadOrders() {
    this.ngxSpinnerService.show("actionsLoader")
    this.ordersService.getOrdersManagement("",this.filterParams).pipe(
      finalize(()=>this.ngxSpinnerService.hide('actionsLoader')),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.allOrders = data;
        this.orders = data.orders.data;
        this.totalRecords = data.orders.total;
      },
      error: (err) => console.error('Failed to load orders', err),
    });
  }

  // Date Filter Methods
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  applyFilter() {
     this.isDropdownOpen = false;
 
     if (this.selectedRange?.startDate && this.selectedRange?.endDate) {
       this.filterParams.startDate = dayjs(this.selectedRange.startDate).format(
         'YYYY-MM-DD'
       );
       this.filterParams.endDate = dayjs(this.selectedRange.endDate).format('YYYY-MM-DD');
       this.reloadOrders()
     } 
 
   }

   onDateSelected(event: any) {
    this.selectedRange = event;
    this.applyFilter();
  }
  reloadOrders():void {
  this.filterParams.sortOrder = this.filterParams.sortOrder === 1 ? 'asc' : 'desc';
  this.filterParams.status = this.selectedStatus || "";
  this.loadOrders()
  }
  clear(dt: Table): void {
console.log("clear");

    this.filterParams.startDate = ""
    this.filterParams.endDate = ""
    this.reloadOrders()

  }

  getStatusIndex(status: string): number {
    return this.statusSteps.indexOf(status);
  }

  getSteps(): MenuItem[] {
    return this.statusSteps.map((step) => ({ label: step }));
  }

  updateOrderStatus(order: OrderData, isStatus: boolean) {
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear('orderStatusMessage');
    this.ordersService
      .updateOrderStatus(order.id.toString(), order.status, isStatus)
      .subscribe({
        next: (response) => {
          timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader')
          );
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
          this.loadOrders();
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
    ];

    const currentIndex = this.statusSteps.indexOf(currentStatus);

    // ✅ Disable previous steps
    return statusWithIcons.map((status, index) => ({
      ...status,
      disabled: index < currentIndex,
    }));
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

  // Dropdown
  selectedStatus: string = '';
  selectOptions: ISelectOptions[] = [];
  onFilterChange(value: string) {

  this.selectedStatus = value;  
  this.reloadOrders()
}

  initDropDownFilter(): void {
    this.selectOptions = [
      {
        label: 'placed',
        value: '1',
      },
      {
        label: 'confirmed',
        value: '0',
      },
      {
        label: 'on the way',
        value: '0',
      },
    ];
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
