import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-with-loading',
  templateUrl: './image.loading.component.html',
  styleUrls: ['./image.loading.component.css']
})
export class ImageWithLoadingComponent {

  @Input() loader = 'https://media.giphy.com/media/y1ZBcOGOOtlpC/200.gif';
  @Input() height = 200;
  @Input() width = 200;
  @Input() image: string;

  isLoading: boolean;

  constructor() {
    this.isLoading = true;
  }

  hideLoader() {
      console.log('image.loading.component.ts hideLoader');
    this.isLoading = false;
  }

}
