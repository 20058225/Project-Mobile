mkdir pubpal
cd pubpal

npm init

npm install jquery

* global    
sudo npm install -g @ionic/cli  

ionic start pubpal blank --type=angular
ionic serve
ionic generate page login
ionic generate component receiptmodal

##
# Plugins   
* Vibration Plugin  
ionic cordova plugin add cordova-plugin-vibration   
npm install @ionic-native/vibration

* File Manager  
npm install @capacitor/filesystem
npx cap sync


##
# Splash Screen
* Install   
npm install @capacitor/splash-screen
npx cap sync


* Icons 
npm install @capacitor-community/app-icon

* Android
npx cap sync android
npx cap open android