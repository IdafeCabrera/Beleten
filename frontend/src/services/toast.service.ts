// frontend/src/services/toast.service.ts
// frontend/src/services/toast.service.ts
import { toastController } from '@ionic/core';


export class ToastService {
  private static async showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    const toast = await toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: type === 'success' ? 'success' : 
             type === 'error' ? 'danger' :
             type === 'warning' ? 'warning' : 'primary',
      cssClass: `toast-${type}`
    });
    await toast.present();
  }

  public static async success(message: string) {
    await this.showToast(message, 'success');
  }

  public static async error(message: string) {
    await this.showToast(message, 'error');
  }

  public static async warning(message: string) {
    await this.showToast(message, 'warning');
  }

  public static async info(message: string) {
    await this.showToast(message, 'info');
  }
}

export const toastService = ToastService;