import { baseModules } from '@/app/app.config';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './app-popup.component.html',
  styleUrls: ['./app-popup.component.scss'],
  standalone: true,
  imports: baseModules,
})
export class AppPopupComponent {
  @Input() title = '';
  @Input() width = '50vw';
  @Input() height = '90vh';
  opened = false;
  @ViewChild('popup') popup!: ElementRef;

  constructor() {}

  open() {
    this.opened = true;
    setTimeout(() => {
      const popups = document.getElementsByClassName('app-popup');
      const element = this.popup.nativeElement as HTMLElement;
      element.style.top = `${2.5 ** popups.length}%`;
      element.style.left = `${2.5 ** popups.length}%`;
      this.moveForeground();
    }, 0);
  }

  moveForeground() {
    const popups = document.getElementsByClassName('app-popup');
    if (popups.length === 1) return;
    Array.from(popups).forEach((popupEl) => {
      if (!(popupEl as HTMLElement).style.zIndex) {
        (popupEl as HTMLElement).style.zIndex = '1';
      }
    });
    const maxZIndex = Array.from(popups).reduce((ret, popupEl) => {
      return Math.max(ret, +(popupEl as HTMLElement).style.zIndex || 0);
    }, 0);
    (this.popup.nativeElement as HTMLElement).style.zIndex = `${maxZIndex + 1}`;
  }

  initResize(event: MouseEvent, direction: string, popup: HTMLElement) {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = popup.offsetWidth;
    const startHeight = popup.offsetHeight;
    const startTop = popup.offsetTop;
    const startLeft = popup.offsetLeft;

    const onMouseMove = (e: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newTop = startTop;
      let newLeft = startLeft;
      const minSize = 400;

      if (direction.includes('right')) {
        newWidth = Math.max(minSize, startWidth + (e.clientX - startX));
      }
      if (direction.includes('left')) {
        newWidth = Math.max(minSize, startWidth - (e.clientX - startX));
        newLeft = startLeft + (e.clientX - startX);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(minSize, startHeight + (e.clientY - startY));
      }
      if (direction.includes('top')) {
        newHeight = Math.max(minSize, startHeight - (e.clientY - startY));
        newTop = startTop + (e.clientY - startY);
      }

      popup.style.width = newWidth + 'px';
      popup.style.height = newHeight + 'px';
      popup.style.top = newTop + 'px';
      popup.style.left = newLeft + 'px';
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
