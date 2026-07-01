import { CommonModule, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { IVoucher } from '../res/model/voucher';

@Component({
  selector: 'app-b-details-voucher',
  standalone: true,
  imports: [
    TagModule,
    CommonModule,
    CardModule,
    ButtonModule,
    RouterLink,
    PercentPipe,
  ],
  templateUrl: './b-details-voucher.component.html',
  styleUrl: './b-details-voucher.component.scss',
})
export class BDetailsVoucherComponent {
  route = inject(ActivatedRoute);

  isLoading: boolean = false;
  voucherData!: IVoucher;

  ngOnInit(): void {
    this.getVoucherData();
  }

  getVoucherData(): void {
    this.route.data.subscribe((data) => {
      this.voucherData = data['voucher'];
      console.log(this.voucherData);
      this.isLoading = true;
    });
  }
}
