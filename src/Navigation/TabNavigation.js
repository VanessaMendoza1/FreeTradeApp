import * as React from 'react';
import {Image, Platform, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Styled from 'styled-components';
import Colors from '../utils/Colors';
import {w, h} from 'react-native-responsiveness';
import Icons from '../utils/icons';

const Tab = createBottomTabNavigator();

// screen
import Home from '../Screens/Dashboard/Home';
import Postad from '../Screens/Dashboard/Postad';
import MakePost from '../Screens/Post/MakePost';
import Mydeals from '../Screens/Mydeals/Mydeals';
import Profile from '../Screens/Profile/Profile';

function TabNavigation({route: pRoute, visible, ...props}) {
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarIcon: ({focused, color, size}) => {
          switch (route.name) {
            case 'Home':
              return (
                <>
                  <TabItemContainer focused={focused}>
                    {Icons.Home({
                      tintColor: focused ? Colors.Primary : '#0008',
                    })}
                  </TabItemContainer>
                  <Text
                    style={{
                      color: focused ? Colors.Primary : '#0009',
                      fontSize: h('2%'),
                    }}>
                    Home
                  </Text>
                </>
              );
            case 'Postad':
              return (
                <>
                  <TabItemContainer focused={focused}>
                    {Icons.PostAds({
                      tintColor: focused ? Colors.Primary : '#0008',
                    })}
                  </TabItemContainer>
                  <Text
                    style={{
                      color: focused ? Colors.Primary : '#0009',
                      fontSize: h('2%'),
                    }}>
                    Advertise
                  </Text>
                </>
              );
            case 'MakePost':
              return (
                <>
                  <TabItemContainer focused={focused}>
                    {Icons.Post({
                      tintColor: focused ? Colors.Primary : '#0008',
                    })}
                  </TabItemContainer>
                  <Text
                    style={{
                      color: focused ? Colors.Primary : '#0009',
                      fontSize: h('2%'),
                    }}>
                    Post
                  </Text>
                </>
              );
            case 'Mydeals':
              return (
                <>
                  <TabItemContainer focused={focused}>
                    {Icons.Mydeals({
                      tintColor: focused ? Colors.Primary : '#0008',
                    })}
                  </TabItemContainer>
                  <Text
                    style={{
                      color: focused ? Colors.Primary : '#0009',
                      fontSize: h('2%'),
                    }}>
                    My Deals
                  </Text>
                </>
              );
            case 'Profile':
              return (
                <>
                  <TabItemContainer focused={focused}>
                    {Icons.Profile({
                      tintColor: focused ? Colors.Primary : '#0008',
                    })}
                  </TabItemContainer>
                  <Text
                    style={{
                      color: focused ? Colors.Primary : '#0009',
                      fontSize: h('2%'),
                    }}>
                    Profile
                  </Text>
                </>
              );
            default:
              break;
          }
        },
      })}
      style={{
        borderWidth: 0,
        elevation: 0,
      }}
      tabBarOptions={{
        activeTintColor: '#5127E4',
        inactiveTintColor: '#0008',
        showLabel: false,
        showIcon: true,
        keyboardHidesTabBar: Platform.OS === 'ios' ? false : true,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Postad"
        component={Postad}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MakePost"
        options={{
          unmountOnBlur: true,
          headerShown: false,
        }}
        component={MakePost}
      />
      <Tab.Screen
        name="Mydeals"
        component={Mydeals}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const TabItemContainer = Styled.View`
  display: flex;
  flex:1;
  justify-content: center;
  align-items: center;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-width: 3px
  ${({focused}) => `border-color: ${focused ? Colors.Primary : '#FFF'}`};
  width: 0%;
  height: 100%;
`;

export default TabNavigation;
