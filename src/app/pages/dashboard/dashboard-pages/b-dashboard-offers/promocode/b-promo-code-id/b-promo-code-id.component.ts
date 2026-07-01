import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { OnlyNumberDirective } from '../../../../../../only-number.directive';
import { ActiveUser } from '../res/model/activeUser';
import { PromoCode } from '../res/model/promo-code';
import { PromoCodeService } from '../res/services/promo-code.service';

@Component({
  selector: 'app-b-promo-code-id',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    OnlyNumberDirective,
    MultiSelectModule,
    CalendarModule,
  ],
  templateUrl: './b-promo-code-id.component.html',
  styleUrl: './b-promo-code-id.component.scss',
  providers: [MessageService, FormsModule],
})
export class BPromoCodeIdComponent implements OnInit {
  submitForm!: FormGroup;

  isEditing = false;

  promoCodeId: string | null = null;

  errorMessage = signal<string>('');

  allUsers = signal<ActiveUser[]>([]);

  isLoadingUsers = signal<boolean>(false);

  useOptions = [
    { label: 'Multi Use', value: 'all' },
    { label: 'One Use', value: 'once' },
  ];

  typeOptions = [
    { label: 'Percentage', value: 'percent' },
    { label: 'Fixed Amount', value: 'fixed' },
  ];

  applyOptions = [
    { label: 'All Users', value: 'all' },
    { label: 'Specific users', value: 'limited' },
  ];

  private fb = inject(FormBuilder);

  private searchSubject = new Subject<string>();

  private destroy$ = new Subject<void>();

  private promoCodeService = inject(PromoCodeService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  private toastrService = inject(ToastrService);

  searchTerm = '';

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.checkEditMode(); // This must be called first to set isEditing and load initial users
    this.loadUsers();
    this.setupFormListeners();
  }

  initializeForm(): void {
    this.submitForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      use: ['all', Validators.required],
      type: ['percent', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      min_amount: [0, [Validators.required, Validators.min(0)]],
      apply: ['all', Validators.required],
      limit: [0],
      status: [1, Validators.required],
      users: [[]],
      expiration_date: ['', [Validators.required]],
    });
  }

  setupFormListeners(): void {
    // Enable/disable limit field based on use selection
    this.submitForm.get('use')?.valueChanges.subscribe((value) => {
      const limitControl = this.submitForm.get('limit');
      if (value === 'limited') {
        limitControl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        limitControl?.clearValidators();
        limitControl?.setValue(0);
      }
      limitControl?.updateValueAndValidity();
    });

    this.submitForm.get('apply')?.valueChanges.subscribe((value) => {
      const usersControl = this.submitForm.get('users');
      if (value === 'limited') {
        usersControl?.setValidators([Validators.required]);
      } else {
        usersControl?.clearValidators();
        usersControl?.setValue([]);
      }
      usersControl?.updateValueAndValidity();
    });
  }
  checkEditMode(): void {
    const promoCodeData = this.activatedRoute.snapshot.data['promoCode'];
    if (promoCodeData) {
      this.isEditing = true;
      const promoCode = promoCodeData.promo_code;
      this.promoCodeId = promoCode.id.toString();

      // Extract user IDs from the voucher's users array
      const userIds = promoCode.users?.map((user: ActiveUser) => user.id) || [];

      // Set initial users in allUsers signal if we have users from the resolver
      if (promoCode.users && promoCode.users.length > 0) {
        this.allUsers.set(promoCode.users);
      }
      console.log(promoCode, 'promoCode');
      // Create a copy of voucher data and set the users field to just the IDs
      const promoCodeFormData = { ...promoCode, users: userIds };
      this.submitForm.patchValue(promoCodeFormData);
    }
  }

  loadUsers(): void {
    if (!this.isEditing || (this.isEditing && this.allUsers().length === 0)) {
      this.searchSubject
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((term) => this.promoCodeService.activeUsers(term)),
          takeUntil(this.destroy$)
        )
        .subscribe((response) => {
          // If we're in edit mode, we need to preserve the existing selected users
          if (this.isEditing) {
            const existingUsers = this.allUsers();
            // Merge existing users with new search results, avoiding duplicates
            const mergedUsers = [...existingUsers];
            response.rows.forEach((user: ActiveUser) => {
              if (
                !mergedUsers.some(
                  (existing: ActiveUser) => existing.id === user.id
                )
              ) {
                mergedUsers.push(user);
              }
            });
            this.allUsers.set(mergedUsers);
          } else {
            this.allUsers.set(response.rows);
          }
          this.isLoadingUsers.set(false);
        });
    }
  }

  saveForm(): void {
    this.submitForm.markAllAsTouched();
    if (this.submitForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly',
      });
      return;
    }

    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();
    this.errorMessage.set('');

    const formValue = this.submitForm.value;

    // Format expiration date to YYYY-MM-DD
    const expirationDate =
      formValue.expiration_date instanceof Date
        ? formValue.expiration_date.toISOString().split('T')[0]
        : formValue.expiration_date;

    const promoCodeData: PromoCode = {
      code: formValue.code,
      use: formValue.use,
      type: formValue.type,
      value: Number(formValue.value),
      min_amount: Number(formValue.min_amount),
      apply: formValue.apply,
      limit: Number(formValue.limit),
      status: formValue.status,
      users: formValue.users || [],
      expiration_date: expirationDate,
    };

    if (this.isEditing && this.promoCodeId) {
      this.promoCodeService
        .updatePromoCode(this.promoCodeId, promoCodeData)
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard/offers/promo-codes']);
            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail: 'Voucher updated successfully',
            });
            timer(200).subscribe(() =>
              this.ngxSpinnerService.hide('actionsLoader')
            );
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
            this.toastrService.error(error.message, 'Error');
          },
        });
    } else {
      this.promoCodeService.addPromoCode(promoCodeData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/offers/promo-codes']);
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Voucher added successfully',
          });
          this.ngxSpinnerService.hide('actionsLoader');
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${error.message}`,
          });
        },
      });
    }
  }

  handleError(error: HttpErrorResponse): void {
    let errorMsg = 'An error occurred';
    if (error.error?.errors) {
      const firstError = Object.values(error.error.errors)[0];
      errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
    } else if (error.error?.message) {
      errorMsg = error.error.message;
    }
    this.errorMessage.set(errorMsg);
    timer(200).subscribe(() => this.ngxSpinnerService.hide('actionsLoader'));
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.trim();
    console.log(this.searchTerm);
    this.searchSubject.next(this.searchTerm);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
