import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
})
export class AppsComponent implements OnInit {
  @Input() onClick: () => void;
  constructor() {}
  ngOnInit() {}
}
