import { Component, ElementRef, EventEmitter, OnInit, OnDestroy, Output, Input, ViewChild } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription, timer } from 'rxjs';
import { LOTTIES_PATH } from 'src/app/config';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit, OnDestroy {

  lottiesId: Array<string> = [
    'onBoarding_photoCamera',
    'onBoarding_filterEffects',
    'onBoarding_sendPhoto',
    'onBoarding_startButton'
  ]
  shareResultLottiesId: {success: string, failed: string} = {
    success: 'successful_sending',
    failed: 'send_failed'
  }
  lottieOptions: AnimationOptions = {};
  currentLottieIndex: number = 0;
  slidesDelay: number = 5; // in seconds

  subscription: Subscription | null = null;

  @ViewChild('pagination') pagination: ElementRef<HTMLElement> | null = null;
  @ViewChild('slider') slider: ElementRef<HTMLElement> | null = null;

  @Input('shareResult') shareResult: boolean | null = null;
  @Output() hideSplash: EventEmitter<null> = new EventEmitter<null>();

  constructor(
  ) { }

  ngOnInit(): void {

    /* Check - its final screen, if TRUE, show share result */
    if (this.shareResult !== null) {
      let currentLottieId: string = this.shareResult ? this.shareResultLottiesId.success : this.shareResultLottiesId.failed;
      this.lottieOptions = {
        path: `${LOTTIES_PATH}/${currentLottieId}.json`
      };
    } else {
      /* Initialize slider with lottie animations and text */
      this.initializeSlider();
    }
  }

  initializeSlider(): void {

    /* set first lottie */
    let currentLottieId: string = this.lottiesId[this.currentLottieIndex];
    this.lottieOptions = {
      path: `${LOTTIES_PATH}/${currentLottieId}.json`
    };

    this.subscription = timer(1000 * this.slidesDelay, 1000 * this.slidesDelay).subscribe(() => {

      /* set opacity animation. for prevent flickering due lotties changing  */
      this.animateSlide();

      this.currentLottieIndex = this.currentLottieIndex == this.lottiesId.length - 1 ? 0 : ++this.currentLottieIndex;
      currentLottieId = this.lottiesId[this.currentLottieIndex];

      this.lottieOptions = {
        path: `${LOTTIES_PATH}/${currentLottieId}.json`
      };
    });
  }

  animateSlide(): void {
    setTimeout(() => {
      this.slider?.nativeElement.style.setProperty('opacity', '1');
    }, 300);

    setTimeout(() => {
      this.slider?.nativeElement.style.setProperty('opacity', '0');
    }, 4800);
  }

  navigateToCameraScreen(): void {
    this.hideSplash.emit();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
