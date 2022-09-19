import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { animate, style, transition, trigger } from "@angular/animations";
import { FILTER_BACKGROUND_IMAGE_SRC } from 'src/app/config';

@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss'],
  animations: [
    trigger("rightLeftAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(+100%)" }),
        animate(
          "350ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "200ms ease-in-out",
          style({ opacity: 0, transform: "translateX(+100%)" })
        )
      ])
    ]),
    trigger("leftRightAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(-100%)" }),
        animate(
          "350ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "200ms ease-in-out",
          style({ opacity: 0, transform: "translateX(-100%)" })
        )
      ])
    ])
  ]
})
export class EffectsComponent implements OnInit {

  backgrounds: Array<string> = [
    '/assets/icons/none.svg',
    '/assets/images/backgrounds/back_1.jpg',
    '/assets/images/backgrounds/back_2.jpg',
    '/assets/images/backgrounds/back_3.jpg',
    '/assets/images/backgrounds/back_4.jpg',
    '/assets/images/backgrounds/back_1.jpg',
    '/assets/images/backgrounds/back_2.jpg',
    '/assets/images/backgrounds/back_3.jpg',
    '/assets/images/backgrounds/back_4.jpg',
  ]
  effects: Array<string> = [
    '/assets/icons/none.svg',
    '/assets/images/effects/effect_3.png',
    '/assets/images/effects/effect_2.png',
    '/assets/images/effects/effect_1.png',
    '/assets/images/effects/effect_3.png',
    '/assets/images/effects/effect_2.png',
    '/assets/images/effects/effect_1.png'
  ]
  filters: Array<string> = [
    '',
    'sepia(1)',
    'blur(1px)',
    'grayscale(1)',
    'blur(1px)',
    'sepia(1)'
  ];
  filterBackgroundImgSrc: string = FILTER_BACKGROUND_IMAGE_SRC;

  showBackgroundsOpts: boolean = false;
  showEffectsOpts: boolean = false;
  showFilterOpts: boolean = false;

  selectedBackgroundIndex: number = 0;
  selectedEffectIndex: number = 0;
  selectedFilterIndex: number = 0;

  @Output() selectVirtualBackground: EventEmitter<string> = new EventEmitter;
  @Output() selectEffect: EventEmitter<string> = new EventEmitter;
  @Output() selectFilter: EventEmitter<string> = new EventEmitter;
  @Output() deleteAllChanges: EventEmitter<null> = new EventEmitter;


  constructor() { }

  ngOnInit(): void {
  }

  selectBackground(backgroundIndex: number) {
    this.selectedBackgroundIndex = backgroundIndex;

    /* if its first source, it's mean that it's none background */
    let selectedSrc: string = backgroundIndex === 0 ? '' : this.backgrounds[backgroundIndex];
    this.selectVirtualBackground.emit(selectedSrc);
  }

  selectImageEffect(effectIndex: number) {
    this.selectedEffectIndex = effectIndex;
    /* if its first source, it's mean that it's none background */
    let selectedSrc: string = effectIndex === 0 ? '' : this.effects[effectIndex];
    this.selectEffect.emit(selectedSrc);
  }

  selectImageFilter(filterIndex: number) {
    this.selectedFilterIndex = filterIndex;
    /* if its first source, it's mean that it's none background */
    let selectedFilterName: string = filterIndex === 0 ? '' : this.filters[filterIndex];
    this.selectFilter.emit(selectedFilterName);
  }

  deleteAllOptions() {

    /* remove all selected indexes */
    this.selectedBackgroundIndex = 0;
    this.selectedEffectIndex = 0;
    this.selectedFilterIndex = 0;

    this.deleteAllChanges.emit();
  }

  goBack() {
    this.showBackgroundsOpts = false;
    this.showEffectsOpts = false;
    this.showFilterOpts = false;
  }

}
