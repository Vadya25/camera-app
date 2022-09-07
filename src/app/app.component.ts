import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  splashShow: boolean = true;
  cameraEditor: 'time' | 'crop' | 'frames' | null = null;
  image: any = null;

  @ViewChild("video") video: ElementRef | null = null;
  @ViewChild("canvas") canvas: ElementRef | null = null;

  constructor() { }

  cameraInit(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream: any) => {
        let video = <ElementRef>this.video;
        video.nativeElement.srcObject = stream;
        video.nativeElement.play();
      });
    }
  }

  capture() {
    let canv = <ElementRef>this.canvas;
    let video = <ElementRef>this.video; 

    let context = canv.nativeElement.getContext("2d").drawImage(video.nativeElement, 0, 0, 640, 480);
    this.image = canv.nativeElement.toDataURL("image/png");
  }

  setCaptureTimeout(duration: number) {
    if(duration !== 0) {
      setTimeout(() => {
        this.capture();
        this.cameraEditor = null;
      }, duration*1000);
    }
  }

  splashAction() {
    this.splashShow = false;
    this.cameraInit();
  }

  showCameraEditor(mode: 'time' | 'crop' | 'frames') {
    this.cameraEditor = mode;
  }
}
