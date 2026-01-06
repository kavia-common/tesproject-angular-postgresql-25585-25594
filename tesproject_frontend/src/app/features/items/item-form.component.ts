import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface ItemFormValue {
  name: string;
  description?: string;
}

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="submitForm()">
      <label class="field">
        <span class="field__label">Name</span>
        <input class="input" type="text" formControlName="name" placeholder="e.g. Onboarding task" />
        <span class="field__error" *ngIf="form.controls.name.touched && form.controls.name.invalid">Name is required.</span>
      </label>

      <label class="field">
        <span class="field__label">Description</span>
        <textarea class="textarea" rows="4" formControlName="description" placeholder="Optional details"></textarea>
      </label>

      <div class="row row--end">
        <button class="btn btn--primary" type="submit" [disabled]="form.invalid || busy">
          {{ busy ? 'Saving…' : submitLabel }}
        </button>
      </div>

      <div class="error" *ngIf="errorText">{{ errorText }}</div>
    </form>
  `,
})
export class ItemFormComponent {
  @Input({ required: true }) submitLabel = 'Save';
  @Input() busy = false;
  @Input() errorText: string | null = null;

  @Input()
  set initialValue(v: ItemFormValue | null) {
    if (!v) return;
    this.form.patchValue(v);
  }

  @Output() save = new EventEmitter<ItemFormValue>();

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
  });

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit({
      name: this.form.controls.name.value,
      description: this.form.controls.description.value,
    });
  }
}
