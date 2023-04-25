import * as React from 'react';
import {Easing} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import screens

import SplashScreen from '../Screens/Auth/SplashScreen';
import Login from '../Screens/Auth/Login';
import ForgetPassword from '../Screens/Auth/ForgetPassword';
import Signup from '../Screens/Auth/Signup';
import LocationPage from '../Screens/Auth/LocationPage';

import PostScreen from '../Screens/Post/PostScreen';
import PostSubmitDetails from '../Screens/Post/PostSubmitDetails';
import Posted from '../Screens/Post/Posted';
import PostPromotion from '../Screens/Post/PostPromotion';

// import Home from '../Screens/Dashboard/Home';
import LocationScreen from '../Screens/Dashboard/LocationScreen';
import SearchScreen from '../Screens/Dashboard/SearchScreen';
import MessageScreen from '../Screens/Dashboard/MessageScreen';
import Notification from '../Screens/Dashboard/Notification';
import SendOffer from '../Screens/Dashboard/SendOffer';
import CreateMessage from '../Screens/Dashboard/CreateMessage';
import OtherUserPostDetails from '../Screens/Profile/OtherUserPostDetails';
import Inbox from '../Screens/Dashboard/Inbox';
import StartConversation from '../Screens/Dashboard/StartConversation';

import Review from '../Screens/Mydeals/Review';

import UserPost from '../Screens/Profile/UserPost';
import PostEdit from '../Screens/Profile/PostEdit';
import OtherUserProfile from '../Screens/Profile/OtherUserProfile';

// setting
import Setting from '../Screens/Settings/Setting';
import EditAccount from '../Screens/Settings/EditAccount';
import VerifyNumber from '../Screens/Settings/VerifyNumber';
import OtpScreen from '../Screens/Settings/OtpScreen';
import VerificationDone from '../Screens/Settings/VerificationDone';
import BussinessAccountEdits from '../Screens/Settings/BussinessAccountEdits';
import SubscriptionPage from '../Screens/Settings/SubscriptionPage';
import ImageScreen from '../Screens/Post/ImageScreen';
import FavouriteItemsScreen from '../Screens/Settings/FavouriteItemsScreen'

import TabNavigation from './TabNavigation';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="TabNavigation" component={TabNavigation} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
        <Stack.Screen
          name="OtherUserPostDetails"
          component={OtherUserPostDetails}
        />
        <Stack.Screen name="MessageScreen" component={MessageScreen} />
        <Stack.Screen name="StartConversation" component={StartConversation} />
        <Stack.Screen name="Inbox" component={Inbox} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="LocationScreen" component={LocationScreen} />
        <Stack.Screen name="PostPromotion" component={PostPromotion} />
        <Stack.Screen name="SendOffer" component={SendOffer} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="PostSubmitDetails" component={PostSubmitDetails} />
        <Stack.Screen name="CreateMessage" component={CreateMessage} />
        <Stack.Screen name="Posted" component={Posted} />
        <Stack.Screen name="UserPost" component={UserPost} />
        <Stack.Screen name="OtherUserProfile" component={OtherUserProfile} />
        <Stack.Screen name="PostEdit" component={PostEdit} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="EditAccount" component={EditAccount} />
        <Stack.Screen name="VerifyNumber" component={VerifyNumber} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="ImageScreen" component={ImageScreen} />
        <Stack.Screen name="VerificationDone" component={VerificationDone} />
        <Stack.Screen name="SubscriptionPage" component={SubscriptionPage} />
        <Stack.Screen name="FavouriteItems" component={FavouriteItemsScreen} />
        <Stack.Screen
          name="BussinessAccountEdits"
          component={BussinessAccountEdits}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="LocationPage" component={LocationPage} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
