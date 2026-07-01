import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]',
  standalone: true
})
export class OnlyNumberDirective {

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initialValue = event.target.value;

    // Remove non-numeric characters
    event.target.value = initialValue.replace(/[^0-9]*/g, '');
    if (initialValue !== event.target.value) {
      event.stopPropagation();
    }
  }

}
