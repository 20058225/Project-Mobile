import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pubpal',
  appName: 'PubPal',
  webDir: 'www',
  bundledWebRuntime: false,
  "plugins": {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#000000",
      showSpinner: false,
      androidScaleType: "FIT_CENTER",
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true
    },
  }
};

export default config;