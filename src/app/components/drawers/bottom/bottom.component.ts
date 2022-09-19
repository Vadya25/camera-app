import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { LOTTIES_PATH } from 'src/app/config';

@Component({
  selector: 'app-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.scss']
})
export class BottomComponent implements OnInit {

  deleteImgLottieId: string = 'delete_photo_popup';
  errorLottieId: string = 'error_popup';
  options: AnimationOptions = {};

  @Input('isImgDeleting') isImgDeleting: boolean = false;
  @Input('isShareDataError') isShareDataError: boolean = false;
  @Output() drawerAction: EventEmitter<boolean> = new EventEmitter;

  constructor() { }

  ngOnInit(): void {

    let currentLottieId: string = this.isImgDeleting ? this.deleteImgLottieId : this.errorLottieId;
    this.options = { 
      path: `${LOTTIES_PATH}/${currentLottieId}.json`
    };
  }

  hideDrawer(success: boolean) {
    this.drawerAction.emit(success);
  }


}
