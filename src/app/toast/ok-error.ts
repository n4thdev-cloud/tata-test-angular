import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

@Injectable({
  providedIn: 'root',
})
export class OkError {

  toast = signal({
    visible: false,
    message: '',
    type: 'success' as ToastType
  });

  show(message: string, type: ToastType = 'success') {
    this.toast.set({ visible: true, message, type });

    setTimeout(() => {
      this.toast.update(t => ({ ...t, visible: false }));
    }, 2000);
  }
}
