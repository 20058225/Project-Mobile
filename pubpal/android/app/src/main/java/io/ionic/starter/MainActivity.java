package io.ionic.starter;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.plugin.splashscreen.SplashScreen;

public class MainActivity extends BridgeActivity {}
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    SplashScreen.show(this, R.style.SplashTheme, true);
}