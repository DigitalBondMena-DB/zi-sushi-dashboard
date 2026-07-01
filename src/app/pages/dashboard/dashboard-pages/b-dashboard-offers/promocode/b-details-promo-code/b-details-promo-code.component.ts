import { CommonModule, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { IPromoCode } from '../res/model/promo-code';

@Component({
  selector: 'app-b-details-promo-code',
  standalone: true,
  imports: [
    TagModule,
    CommonModule,
    CardModule,
    ButtonModule,
    RouterLink,
    PercentPipe,
  ],
  templateUrl: './b-details-promo-code.component.html',
  styleUrl: './b-details-promo-code.component.scss',
})
export class BDetailsPromoCodeComponent {
  route = inject(ActivatedRoute);

  isLoading: boolean = false;
  promoCodeData!: IPromoCode;

  ngOnInit(): void {
    this.getPromoCodeData();
  }

  getPromoCodeData(): void {
    this.route.data.subscribe((data) => {
      this.promoCodeData = data['promoCode'];
      this.isLoading = true;
    });
  }
}
