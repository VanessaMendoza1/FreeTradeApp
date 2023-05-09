import React, { useEffect } from 'react';
import {SafeAreaView, StatusBar, PermissionsAndroid} from 'react-native';

import StackNavigation from './src/Navigation/StackNavigation';

import {StripeProvider} from '@stripe/stripe-react-native';

import store from './src/redux/store';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

function App() {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  useEffect(() => {
   
    // Hack to avoid blank screen after splash
    const timeoutSubscriptionId = setTimeout(() => {
      SplashScreen.hide();
    }, 50);
    return () => {
      clearTimeout(timeoutSubscriptionId);
    };
    // SplashScreen.hide();
  }, []);
  
  return (
    <>
      <StripeProvider
        publishableKey={
          'pk_test_51LVATzKAtBxeYOh2C6iUKzhSHbqomNedxQvTh047tFhL2PZd9mumtzqHdzaJIMXMfOpa1vxN2ySGXdZSLJTLvm7700VWcNkhIA'
        }>
        <Provider store={store}>
          <StatusBar />
          <SafeAreaView />
          <StackNavigation />
        </Provider>
      </StripeProvider>
    </>
  );
}

export default App;
