import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FcmService } from './services/fcm.service';
// import { ToastService } from './service/toast.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    public toastController: ToastController,
  ) {
    this.initializeApp();
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  private notificationSetup() {
    this.fcm.getToken();
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
          if (msg.tap) {
            console.log("If app Running in Background");
          }else{
            console.log("If App already Opened");
          }
          console.log(msg);
        }
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#4c8dff');
      this.splashScreen.hide();
      this.notificationSetup();
    });
  }
}
