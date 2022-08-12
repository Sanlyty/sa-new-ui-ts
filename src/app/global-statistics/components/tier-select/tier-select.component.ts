import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-tier-select",
  templateUrl: "./tier-select.component.html",
  styleUrls: ["./tier-select.component.css"],
})
export class TierSelectComponent implements OnInit {
  constructor() {}

  @Output() onSelect = new EventEmitter<number>(false);

  ngOnInit(): void {}

  createRange(count: number): number[] {
    return new Array(count).fill(0).map((_, i) => i);
  }

  onClick(event: MouseEvent) {
    const { currentTarget } = event;
    if (currentTarget) {
      const tier = Number.parseInt(
        (currentTarget as HTMLButtonElement).dataset.tier
      );
      this.onSelect.emit(tier);
    }
  }
}
