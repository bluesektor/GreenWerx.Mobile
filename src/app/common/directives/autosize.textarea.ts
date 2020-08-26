// import {ElementRef, HostListener, Directive, OnInit} from '@angular/core';

/*
Before applying this directive to textarea and for it to work, it has to be imported in
‘src/app/app.module.ts’ and declared. So, open ‘src/app/app.module.ts’ and paste the following
line below other import statements.
import { Autosize} from '../components/autosize/autosize';
  <ion-textarea autosize></ion-textarea>
*/
/*
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ion-textarea[autosize]'
})

// tslint:disable-next-line:directive-class-suffix
export class Autosize implements OnInit {
  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  constructor(public element: ElementRef) {
  }

  ngOnInit(): void {
    setTimeout(() => this.adjust(), 0);
  }

  adjust(): void {
      console.log('autosize.textarea.ts adust');
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = (textArea.scrollHeight + 32) + 'px';
  }
}
*/
