mkdir pubpal
cd pubpal

npm init

npm install jquery

* global    
sudo npm install -g @ionic/cli  

ionic start pubpal blank --type=angular
ionic serve
ionic generate page login
ionic generate component pos

##
# Plugins   
* Vibration Plugin  
ionic cordova plugin add cordova-plugin-vibration   
npm install @ionic-native/vibration

* Contacts  
ionic cordova plugin add cordova-plugin-contacts    
npm install @ionic-native/contacts

* File Manager  
ionic cordova plugin add cordova-plugin-file    
npm install @ionic-native/file

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

