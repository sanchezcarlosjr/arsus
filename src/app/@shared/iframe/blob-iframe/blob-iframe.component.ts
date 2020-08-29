import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-description',
  templateUrl: './blob-iframe.component.html',
  styleUrls: ['./blob-iframe.component.scss'],
})
export class BlobIframeComponent implements OnInit {
  @Input() description: string;
  height = '1000em';
  src = '';

  ngOnInit(): void {
    const blob = new Blob([this.description], { type: 'text/html' });
    this.src = window.URL.createObjectURL(blob);
  }
}
