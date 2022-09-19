import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

/* LOTTIE animatinos */
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { EffectsComponent } from './components/effects/effects.component';
import { ShareComponent } from './components/drawers/share/share.component';
import { BottomComponent } from './components/drawers/bottom/bottom.component';

export function playerFactory(): any {  
  return import('lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
    SplashScreenComponent,
    EffectsComponent,
    ShareComponent,
    BottomComponent
  ],
  imports: [
    BrowserModule,
    LottieModule.forRoot({ player: playerFactory }),
    CommonModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
