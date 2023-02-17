import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "sa-admin-ts";

  ngOnInit(): void {
    (window as any).dbExport = async () => {
      const elem: HTMLAnchorElement = document.createElement("a");

      elem.download = "export.json";
      elem.href =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(
          await fetch("/api/v2/compat/Export").then((d) => d.text())
        );
      elem.click();
    };
  }
}
