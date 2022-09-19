import { Component, ElementRef, ViewChild } from '@angular/core';
import { animate, style, transition, trigger, state } from "@angular/animations";
import { AnimationOptions } from 'ngx-lottie';

import CameraProcessor from 'camera-processor';
import {
  SegmentationAnalyzer,
  VirtualBackgroundRenderer,
  SEGMENTATION_BACKEND,
  RENDER_PIPELINE,
  VIRTUAL_BACKGROUND_TYPE
} from '@camera-processor/virtual-background';
import { CAMERA_DEVICE_SIZE, LOTTIES_PATH } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
export class AppComponent {

  lottieId5sec: string = 'counter_5sec';
  lottieOptions: AnimationOptions = {};

  splashStartShow: boolean = true;
  splashResultShow: boolean = false;
  deleteApproverShow: boolean = false;
  shareEmailShow: boolean = false;

  shareResult: boolean | null = null; // if the user has'nt sent yet, it's variable has NULL, but when user will sent, we must know that it was TRUE or FALSE sending 
  image: any = null; // captured image
  effectImage: string = ''; // image from "Templates" part
  videoFilter: string = ''; // filter from "Filters" part
  cameraSize: number = 1000 - 11; // default camera size for square display | 11 - it's padding beetwen video and parent element

  background_renderer: any; // user can update camera background dynamically - this variable contain it
  camera_processor: any // camera video stream

  @ViewChild('camera') camera: ElementRef<HTMLElement> | null = null;
  @ViewChild("video") video: ElementRef<HTMLElement> | null = null;
  @ViewChild("canvas") canvas: ElementRef<HTMLCanvasElement> | null = null;

  constructor(
  ) {
  }

  /* START HERE ↓ */
  hideSplash() {

    /* hide all splashed */
    this.splashStartShow = false;
    this.splashResultShow = false;

    /* If it's first run - initialize camera */
    if (!this.camera_processor) {
      this.initializePage();
    };

  }

  initializePage(): void {
    setTimeout(() => {
      this.newCameraProcessor();
    });
  }

  async getCameraStream() {

    let mediaConstrains: MediaStreamConstraints = {
      video: {
        width: CAMERA_DEVICE_SIZE,
        height: CAMERA_DEVICE_SIZE
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      let stream: any = await navigator.mediaDevices.getUserMedia(mediaConstrains);
      return stream;
    } else {
      return undefined;
    }
  }

  async newCameraProcessor() {
    this.camera_processor = new CameraProcessor();
    let cameraStream = await this.getCameraStream();
    this.camera_processor.setCameraStream(cameraStream); // Set the camera stream from somewhere
    this.camera_processor.start(); // You have to explicitly start it after setCameraStream

    // Add the segmentation analyzer
    let segmentation_analyzer = this.camera_processor.addAnalyzer(
      'segmentation',
      new SegmentationAnalyzer(SEGMENTATION_BACKEND.MLKit)
    );

    // Add the virtual background renderer
    this.background_renderer = this.camera_processor.addRenderer(new VirtualBackgroundRenderer(RENDER_PIPELINE._2D));
    this.background_renderer.setRenderSettings({ contourFilter: 'blur(4px)' });

    // Load the model
    // modelPath is the path where you hosted the model's .tflite file
    // modulePath is the path where you hosted tflite-helper's module files
    segmentation_analyzer.loadModel({
      modelPath: '/assets/tflite-helper/models/selfie_segmentation.tflite',
      modulePath: '/assets/tflite-helper/'
    });

    const output_stream = this.camera_processor.getOutputStream(); // Get the output stream and use it
    (this.video as ElementRef).nativeElement.srcObject = output_stream;
  }

  setVirtualBackground(imageSrc: string) {

    // Set the virtual background settings
    if (imageSrc != '') {
      let image = new Image();
      image.src = imageSrc; // Stream will freeze if this image is CORS protected
      this.background_renderer.setBackground(VIRTUAL_BACKGROUND_TYPE.Image, image);
    } else {
      this.background_renderer.setBackground(VIRTUAL_BACKGROUND_TYPE.None);
    }
  }

  setVideoEffect(effectImg: string) {
    this.effectImage = effectImg;
  }

  setVideoFilter(filterName: string) {
    this.videoFilter = filterName;
  }

  deleteAllChanges() {
    this.videoFilter = '';
    this.effectImage = '';
    this.setVirtualBackground('');
  }

  async captureImage() {

    /* Lottie animation counter */
    this.showCounter(this.lottieId5sec);
    await this.counterWait(5);
    this.showCounter('');

    let canvasRef = <ElementRef>this.canvas;
    let video = <ElementRef>this.video;

    var canvas = <HTMLCanvasElement>canvasRef.nativeElement;
    var ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
    if (this.videoFilter !== '') { ctx.filter = this.videoFilter };

    ctx.drawImage(video.nativeElement, 0, 0, this.cameraSize, this.cameraSize);
    let capturedBaseImage: string = canvas.toDataURL("image/png");

    if (this.effectImage === '') {
      this.image = capturedBaseImage; // If user didn't chose any effects
    } else {
      this.mergeImages(canvas, ctx, capturedBaseImage); // If user have chosen some effect, let's merge main image with effects image
    };

  }

  counterWait(sec: number): Promise<null> {
    return new Promise((resolve) => {
      setTimeout(resolve.bind(null), 1000 * sec)
    });
  }

  showCounter(lottieId: string) {

    if(lottieId === '') {
      this.lottieOptions = {
        path: ''
      };  
    } else {
      this.lottieOptions = {
        path: `${LOTTIES_PATH}/${this.lottieId5sec}.json`
      };
    }
  }

  mergeImages(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, capturedBaseImage: string) {
    let mainImage = new Image();
    let effectImage = new Image();

    mainImage.src = capturedBaseImage;
    mainImage.onload = () => {

      context.drawImage(mainImage, 0, 0, this.cameraSize, this.cameraSize);
      effectImage.src = this.effectImage;

      effectImage.onload = () => {
        context.drawImage(effectImage, 0, 0, this.cameraSize, this.cameraSize);
        this.image = canvas.toDataURL("image/png");
      }
    };
  };

  hideBottomDrawer(deleteImg: boolean) {

    this.deleteApproverShow = false;
    if (deleteImg) {
      this.image = null; // if we have captured image, delete it
    }
  }

  hideShare(sentResult: { sent: boolean, cancel: boolean }) {

    this.shareEmailShow = false; // hide the Email share settings window

    if (!sentResult.cancel) {
      this.shareResult = sentResult.sent; // successful or unsuccessful result of sending
      this.splashResultShow = true; // show new splash with successful or unsuccessful result of sending
      this.image = null; // we don't need anymore captured image - delete it
      this.deleteAllChanges(); // delete all filters, effects and backgrounds
    }
  }

}
