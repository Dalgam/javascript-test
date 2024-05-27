import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-grade-stars',
  standalone: true,
  imports: [],
  templateUrl: './grade-stars.component.html',
  styleUrl: './grade-stars.component.css',
})
export class GradeStarsComponent {
  @Input({ required: true }) id: number = 0;
  @Input({ required: true }) currentGrade: number = 0;
  @Input({ required: true }) maxGrade: number = 5;
  @Input({ required: true }) disabled: boolean = false;

  @Output() onChange = new EventEmitter<GradeChange>();
  starAmountArray;

  constructor() {
    this.starAmountArray = Array.apply(null, Array(this.maxGrade));
  }

  change(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) return;
    this.onChange.emit({ id: this.id, value: parseInt(target.value) });
  }
}
