import { Component, EventEmitter, Input, Output, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { animate, style, transition, trigger, state } from "@angular/animations";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateY(0)' })),
      transition('void => *', [
        style({ transform: 'translateY(+100%)' }),
        animate(150)
      ]),
      transition('* => void', [
        animate(150, style({ transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class ShareComponent {

  showInputDataError: boolean = false;
  isImageSending: boolean = false;
  userData: { email: string, subject: string } = { email: '', subject: '' };

  @Input('image') image: string | null = null;
  @Output() drawerAction: EventEmitter<{ sent: boolean, cancel: boolean }> = new EventEmitter;

  @ViewChild('container') container: ElementRef | null = null;
  @ViewChild('buttons') buttons: ElementRef | null = null;
  @ViewChild('keyboard') keyboard: ElementRef | null = null;
  @ViewChild('userDataForm') userDataForm: NgForm | null = null;

  constructor(
    private renderer: Renderer2
  ) { }

  hideDrawer() {
    this.drawerAction.emit({ sent: false, cancel: true });
  }

  hideErrorDrawer() {
    this.showInputDataError = false;
  }

  sendImage() {

    /* At first check data validation */
    this.showInputDataError = <boolean>this.userDataForm?.invalid;
    if(this.showInputDataError) {return};

    /* Try to send image to email */
    this.isImageSending = true;

    setTimeout(() => {

      this.isImageSending = false;

      let shareRes = false; /* for sending TESTS !!! */

      this.drawerAction.emit({sent: shareRes, cancel: false});
    }, 3000);
  }

  showKeyboard() {
    this.renderer.setStyle(this.container?.nativeElement, 'height', '1300px');
    this.renderer.setStyle(this.buttons?.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.keyboard?.nativeElement, 'height', '945px');
  }

  hideKeyboard() {
    this.renderer.setStyle(this.container?.nativeElement, 'height', '1540px');
    this.renderer.setStyle(this.buttons?.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.keyboard?.nativeElement, 'height', '0px');
  }

}
