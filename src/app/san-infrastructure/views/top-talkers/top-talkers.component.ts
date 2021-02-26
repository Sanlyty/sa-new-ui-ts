import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-top-talkers',
  templateUrl: './top-talkers.component.html',
  styleUrls: ['./top-talkers.component.css']
})
export class TopTalkersComponent implements OnInit {

  url: SafeUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(environment.iframeBaseUrl + "007%20SAN%20infrastructure/SAN_GD_1_0.html");
  }
}
