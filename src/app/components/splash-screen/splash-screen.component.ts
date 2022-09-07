import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {

  @Output() hideSplash: EventEmitter<null> = new EventEmitter<null>();

  options: AnimationOptions = {    
    path: '/assets/lottie/onBoarding_startButton.json'  
  };  

  constructor() { }

  ngOnInit(): void {
  }

  start() {
    this.hideSplash.emit();
  }

}
