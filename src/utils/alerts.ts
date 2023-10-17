import { ToastOptions } from '@ionic/angular';

export const successRegister: ToastOptions = {
  duration: 3000,
  message: 'Cuenta creada exitosamente',
  position: 'top',
  buttons: [
    {
      side: 'start',
      icon: 'happy-outline',
      handler: () => {},
    },
    {
      side: 'end',
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    },
  ],
};

export const successAlert: ToastOptions = {
  duration: 3000,
  message: 'Datos guardados exitosamente',
  position: 'top',
  buttons: [
    {
      side: 'start',
      icon: 'happy-outline',
      handler: () => {},
    },
    {
      side: 'end',
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    },
  ],
};

export const emailAlreadyInUse: ToastOptions = {
  duration: 3000,
  color: 'warning',
  message: 'Email ya en uso',
  position: 'top',
  buttons: [
    {
      side: 'start',
      icon: 'sad-outline',
      handler: () => {},
    },
    {
      side: 'end',
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    },
  ],
};

export const errorRegister: ToastOptions = {
  duration: 3000,
  color: 'warning',
  message: 'Ha ocurrido un error al crear cuenta',
  position: 'top',
  buttons: [
    {
      side: 'start',
      icon: 'sad-outline',
      handler: () => {},
    },
    {
      side: 'end',
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    },
  ],
};

export const errorSignIn: ToastOptions = {
  color: 'warning',
  duration: 3000,
  message: 'Ha ocurrido un error: Credenciales inválidas',
  position: 'top',
  buttons: [
    {
      side: 'start',
      icon: 'sad-outline',
      handler: () => {},
    },
    {
      side: 'end',
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    },
  ],
};

export const errorWithServices: ToastOptions = {
  color: 'danger',
  duration: 3000,
  message: 'Ha ocurrido un error inesperado',
  position: 'top',
  buttons: [
    {
      side: 'start',
      icon: 'sad-outline',
      handler: () => {},
    },
    {
      side: 'end',
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    },
  ],
};

export const errorToast: (text: string) => ToastOptions = (text: string) => ({
  color: 'danger',
  duration: 3000,
  message: text,
  position: 'top',
  buttons: [
    {
      side: 'start',
      icon: 'sad-outline',
      handler: () => {},
    },
    {
      side: 'end',
      icon: 'close',
      role: 'cancel',
      handler: () => {},
    },
  ],
});
