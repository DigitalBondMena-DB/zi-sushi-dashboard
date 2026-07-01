import { CommonModule } from '@angular/common';
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
import { timer } from 'rxjs';
import { ComboService } from '../../../../../../core/services/b-combo/combo.service';
import { OnlyNumberDirective } from '../../../../../../only-number.directive';

@Component({
  selector: 'app-c-combo-boxes-add',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    OnlyNumberDirective,
  ],
  templateUrl: './c-combo-boxes-add.component.html',
  styleUrl: './c-combo-boxes-add.component.scss',
})
export class CComboBoxesAddComponent {
  submitForm!: FormGroup;

  isEditing = false;

  productId: string | null = null;

  private fb = inject(FormBuilder);

  private comboService = inject(ComboService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  private initializeForm() {
    this.submitForm = this.fb.group({
      en_name: ['', Validators.required],
      ar_name: ['', Validators.required],
      pieces: [null, Validators.required],
      prices: [null, Validators.required],
      status: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.initializeForm();

    if (this.activatedRoute.snapshot.data['comboOffers']) {
      this.isEditing = true;
      this.productId = this.activatedRoute.snapshot.data['comboOffers'].combo.id;
      const product = this.activatedRoute.snapshot.data['comboOffers'];
      this.submitForm.patchValue(product.combo);
    }
  }

  saveForm() {
    this.submitForm.markAllAsTouched();
    const fd = new FormData();

    if (this.submitForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
      return;
    }

    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();

    Object.keys(this.submitForm.value).forEach((key) => {
      fd.append(key, this.submitForm.value[key]);
    });

    if (this.isEditing && this.productId) {
      this.comboService.updateComboOffer(this.productId, fd).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/offers/combo/combo-index']);
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Combo updated successfully',
          });
          timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader'),
          );
        },
        error: (err) => {
          this.ngxSpinnerService.hide('actionsLoader');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update combo',
          });
        },
      });
    } else {
      this.comboService.addComboOffer(fd).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/offers/combo/combo-index']);
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Combo added successfully',
          });
          timer(200).subscribe(() =>
            this.ngxSpinnerService.hide('actionsLoader'),
          );
        },
        error: (err) => {
          this.ngxSpinnerService.hide('actionsLoader');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to add combo',
          });
        },
      });
    }
  }
}
