import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-sa-overview",
  templateUrl: "./sa-overview.component.html",
  styleUrls: ["./sa-overview.component.css"],
})
export class SaOverviewComponent implements OnInit, OnDestroy {
  public system: string = "";
  public view: string = "";

  @ViewChild("root", { static: true }) rootElement: ElementRef;

  constructor(private route: ActivatedRoute) {
    route.paramMap.subscribe((map) => {
      this.system = map.get("system");
      this.view = map.get("view");
    });
  }

  ngOnInit(): void {
    // Create Svelte component
    // TODO:
    console.log(this.rootElement.nativeElement);
  }

  ngOnDestroy(): void {
    // Dispose Svelte component
  }
}
