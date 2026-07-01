import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { AppVersionService } from '../../../../core/services/q-app-version/app-version.service';

@Component({
  selector: 'app-m-app-version',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    CommonModule,
  ],
  templateUrl: './m-app-version.component.html',
  styleUrl: './m-app-version.component.scss',
  providers: [MessageService],
})
export class MAppVersionComponent implements OnInit {
  versionForm: FormGroup;

  private fb = inject(FormBuilder);
  private appVersionService = inject(AppVersionService);
  private ngxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);

  constructor() {
    this.versionForm = this.fb.group({
      apple_version: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+\.\d+\.\d+$/),
        ],
      ],
      android_version: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+\.\d+\.\d+$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.loadAppVersion();
  }

  loadAppVersion(): void {
    this.ngxSpinnerService.show('actionsLoader');
    this.appVersionService.getVersion().subscribe({
      next: (res) => {
        if (res && res.ZiVersion) {
          this.versionForm.patchValue({
            apple_version: res.ZiVersion.apple_version,
            android_version: res.ZiVersion.android_version,
          });
        }
        timer(200).subscribe(() =>
          this.ngxSpinnerService.hide('actionsLoader')
        );
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load app version settings',
          life: 3000,
        });
        timer(200).subscribe(() =>
          this.ngxSpinnerService.hide('actionsLoader')
        );
      },
    });
  }

  saveAppVersion(): void {
    this.versionForm.markAllAsTouched();
    if (this.versionForm.invalid) return;

    this.ngxSpinnerService.show('actionsLoader');
    this.messageService.clear();
    const payload = this.versionForm.value;

    this.appVersionService.updateVersion(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'App versions updated successfully',
          life: 3000,
        });
        timer(200).subscribe(() =>
          this.ngxSpinnerService.hide('actionsLoader')
        );
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update app versions',
          life: 3000,
        });
        timer(200).subscribe(() =>
          this.ngxSpinnerService.hide('actionsLoader')
        );
      },
    });
  }
}
