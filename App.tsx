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
          'pk_test_51JijtpJDks9SBIkvsf4qsTVNV45mKeLCzimZZr5612wAuXz8oWvsfCaOzDbMAjtyOplGa9Qu16EfTsdzWgBtmCCo00DbZBUYgy'
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
