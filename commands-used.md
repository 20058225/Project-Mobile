mkdir pubpal
cd pubpal

npm init

npm install jquery

* global    
sudo npm install -g @ionic/cli  

ionic start pubpal blank --type=angular
ionic serve
ionic capacitor run android
ionic generate page login

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
ionic cordova plugin add cordova-plugin-splashscreen    
npm install @ionic-native/splash-screen

* Icons 
ionic cordova resources

* Android
ionic cordova build android

