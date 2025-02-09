import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from '../utils/NavigationUtils';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import JoinMeet from '../screens/JoinMeet';
import PrepareMeet from '../screens/PrepareMeet';
import Meet from '../screens/Meet';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="joinMeet" component={JoinMeet} />
        <Stack.Screen name="prepareMeet" component={PrepareMeet} />
        <Stack.Screen name="meet" component={Meet} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
