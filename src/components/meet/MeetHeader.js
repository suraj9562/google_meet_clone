import {Text, SafeAreaView, View, StyleSheet, Platform} from 'react-native';
import React from 'react';
import {useMeetStorage} from '../../service/meetStore';
import LinearGradient from 'react-native-linear-gradient';
import {SwitchCamera, Volume2} from 'lucide-react-native';
import {addHyphens} from '../../utils/Helpers';
import {RFValue} from 'react-native-responsive-fontsize';

const MeetHeader = ({switchCamera}) => {
  const {sessionId} = useMeetStorage();

  return (
    <LinearGradient
      colors={['#000000', 'rgba(0,0,0,0.7)', 'transparent']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}>
      <SafeAreaView />
      <View style={styles.header}>
        <Text style={styles.meetCode}>{addHyphens(sessionId)}</Text>
        <View style={styles.icons}>
          <SwitchCamera
            color={'#FFF'}
            size={RFValue(24)}
            onPress={switchCamera}
          />
          <Volume2
            color={'#FFF'}
            size={RFValue(24)}
            style={styles.iconSpacing}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  meetCode: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 20,
  },
});

export default MeetHeader;
