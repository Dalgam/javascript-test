import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-grade-stars',
  standalone: true,
  imports: [],
  templateUrl: './grade-stars.component.html',
  styleUrl: './grade-stars.component.css',
})
export class GradeStarsComponent implements OnInit {
  @Input({ required: true }) id: number = 0;
  @Input({ required: true }) currentGrade: number = 0;
  @Input({ required: true }) maxGrade: number = 5;
  @Input({ required: true }) disabled: boolean = false;

  @Output() onChange = new EventEmitter<GradeChange>();
  starAmountArray;

  ngOnInit() {
    console.log(this.id, this.currentGrade, this.maxGrade, this.disabled);
  }

  constructor() {
    this.starAmountArray = Array.apply(null, Array(this.maxGrade));
  }

  change(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) return;
    console.log(target.value);
    this.onChange.emit({ id: this.id, value: parseInt(target.value) });
  }
}
