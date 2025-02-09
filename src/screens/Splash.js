import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {screenHeight, screenWidth} from '../utils/Constants';
import googleMeetImage from './../assets/images/g.png';
import {resetAndNavigate} from '../utils/NavigationUtils';

const Splash = () => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      resetAndNavigate('home');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={googleMeetImage} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.7,
    resizeMode: 'contain',
  },
});
