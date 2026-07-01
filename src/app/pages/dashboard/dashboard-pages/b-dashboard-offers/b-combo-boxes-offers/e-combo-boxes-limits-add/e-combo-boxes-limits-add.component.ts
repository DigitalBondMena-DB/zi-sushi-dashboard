import { Getproduct } from './../../../../../../core/Interfaces/b-combo/IGetComboOfferById';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { timer } from 'rxjs';
import { Category } from '../../../../../../core/Interfaces/c-hot-boxes/IGetBoxById';
import { PiecesPrice } from '../../../../../../core/Interfaces/d-products/IGetProductById';
import { IAddCategoryBody } from '../../../../../../core/Interfaces/h-category/IAddCategoryBody';
import { ComboService } from '../../../../../../core/services/b-combo/combo.service';
import { OnlyNumberDirective } from '../../../../../../only-number.directive';
import { Product } from '../../../../../../core/Interfaces/b-combo/IGetAllComboProducts';

@Component({
  selector: 'app-e-combo-boxes-limits-add',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    OnlyNumberDirective,
    InputNumberModule,
  ],
  templateUrl: './e-combo-boxes-limits-add.component.html',
  styleUrl: './e-combo-boxes-limits-add.component.scss',
  providers: [MessageService],
})
export class EComboBoxesLimitsAddComponent {
  submitForm: FormGroup;

  isEditing = false;

  productId: string | null = null;

  categories!: Category[];

  products!: Product[];

  private fb = inject(FormBuilder);

  private comboService = inject(ComboService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  private piceDetails!: PiecesPrice;

  private limitId!: string;

  constructor() {
    this.submitForm = this.fb.group({
      combo_id: ['', Validators.required],
      product_id: ['', Validators.required],
      limit_count: ['', Validators.required],
    });
  }

  pieceName: string = '';

  ngOnInit() {
    if (this.activatedRoute.snapshot.data['products']) {
      this.categories = this.activatedRoute.snapshot.data[
        'category'
      ].categories.filter((response: Category) => response.id !== 25);
      this.products = this.activatedRoute.snapshot.data['products'].products;
    }
    console.log(this.products);
    if (this.activatedRoute.snapshot.data['comboOffers']) {
      if (this.router.url.includes('edit')) {
        this.isEditing = true;
        this.piceDetails = JSON.parse(localStorage.getItem('combo')!);
        this.pieceName = JSON.parse(
          localStorage.getItem('combo')!,
        ).getproduct.en_food_name;
        console.log('Piece Details', this.pieceName);
        this.limitId = JSON.parse(localStorage.getItem('combo')!).id;
        this.submitForm.patchValue(JSON.parse(localStorage.getItem('combo')!));
        this.submitForm.get('product_id')?.clearValidators();
        this.submitForm.get('product_id')?.updateValueAndValidity();
      }
      this.productId =
        this.activatedRoute.snapshot.data['comboOffers'].combo.id;
    }
    this.submitForm.get('combo_id')?.setValue(this.productId);
  }

  saveForm() {
    if (this.submitForm.invalid) return;
    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();
    const pricePriceData: IAddCategoryBody = this.submitForm.value;

    if (this.isEditing && this.productId) {
      this.comboService
        .updateLimit(this.limitId, pricePriceData)
        .subscribe(() => {
          this.router.navigate(
            ['/dashboard/offers/combo/limits-details/' + this.productId],
            { onSameUrlNavigation: 'reload' },
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Combo updated successfully',
          });
          timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader'),
          );
        });
    } else {
      this.comboService
        .addNewLimit(this.productId!, pricePriceData)
        .subscribe(() => {
          this.router.navigate(
            ['/dashboard/offers/combo/limits-details/' + this.productId],
            { onSameUrlNavigation: 'reload' },
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Combo added successfully',
          });
          timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader'),
          );
        });
    }
  }

  setUnlimited() {
    this.submitForm.patchValue({ limit_count: 100 });
  }

  enableLimit() {
    this.submitForm.patchValue({ limit_count: null }); // Allow user to input a limit
  }
}
