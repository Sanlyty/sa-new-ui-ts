import {Component, OnInit} from '@angular/core';

const titles = {
  'top-talkers': 'Performance Statistics',
};

const tabTitles = {
  // 'top-talkers': 'Performance Statistics',
};

@Component({
  selector: 'app-san-infrastructure',
  templateUrl: './san-infrastructure.component.html',
  styleUrls: ['./san-infrastructure.component.css'],
})
export class SanInfrastructureComponent implements OnInit {

  currentTab: number;
  context: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  activeTab(id: number) {
    this.currentTab = id;
  }

  isCurrentTab(id: number): boolean {
    return id === this.currentTab;
  }

  getTitle() {
    return titles[this.context] ?? 'SAN Infrastructure';
  }

  getTabTitle() {
    return tabTitles[this.context];
  }
}
