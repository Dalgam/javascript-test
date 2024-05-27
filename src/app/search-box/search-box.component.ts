import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css',
})
export class SearchBoxComponent {
  @Input() disabled: boolean = false;
  @Output() handleSearch = new EventEmitter<string>();

  onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || target.disabled) return;

    this.handleSearch.emit(target.value);
  }
}
