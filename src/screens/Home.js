import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import {homeStyles} from '../styles/homeStyles';
import {Calendar, Video} from 'lucide-react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useUserStorage} from '../service/userStore';
import {navigate} from '../utils/NavigationUtils';
import {useWS} from '../service/api/WSProvider';
import {useMeetStorage} from '../service/meetStore';
import bgImage from '../assets/images/bg.png';
import {Colors} from '../utils/Constants';
import {addHyphens, removeHyphens} from '../utils/Helpers';
import {checkSession} from '../service/api/session';

const Home = () => {
  const {emit} = useWS();
  const {user, sessions, addSession, removeSession} = useUserStorage();
  const {addSessionId, removeSessionId} = useMeetStorage();

  const handleNavigation = () => {
    const storedName = user?.name;
    if (!storedName) {
      Alert.alert('Please add your details to proceed further');
      return;
    }

    navigate('joinMeet');
  };

  const joinViaSessionId = async id => {
    const storedName = user?.name;
    if (!storedName) {
      Alert.alert('Please add your details to proceed further');
      return;
    }

    const isActive = await checkSession(id);

    if (isActive) {
      emit('prepare-session', {
        userId: user?.id,
        sessionId: removeHyphens(id),
      });
      addSession(id);
      addSessionId(id);
      navigate('prepareMeet');
    } else {
      removeSession(id);
      removeSessionId(id);
      Alert.alert('There is no meeting found!');
    }
  };

  const renderSessions = ({item}) => {
    return (
      <View style={homeStyles.sessionContainer}>
        <Calendar size={RFValue(20)} color={Colors.icon} />
        <View style={homeStyles.sessionTextContainer}>
          <Text style={homeStyles.sessionTitle}>{addHyphens(item)}</Text>
          <Text style={homeStyles.sessionTime}>
            Just join and enjoy the party!
          </Text>
        </View>
        <TouchableOpacity
          style={homeStyles.joinButton}
          onPress={() => joinViaSessionId(item)}>
          <Text style={homeStyles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={homeStyles.container}>
      <HomeHeader />

      <FlatList
        data={sessions}
        renderItem={renderSessions}
        key={item => item}
        contentContainerStyle={{padding: 10}}
        ListEmptyComponent={
          <>
            <Image source={bgImage} style={homeStyles.img} />
            <Text style={homeStyles.title}>
              Video calls and meetings for everyone
            </Text>
            <Text style={homeStyles.subTitle}>
              Connect, Collaborate and Celebrate from anywhere with Google Meet
            </Text>
          </>
        }
      />

      <TouchableOpacity
        style={homeStyles.absoluteButton}
        onPress={handleNavigation}>
        <Video size={RFValue(14)} color={'#FFF'} />
        <Text style={homeStyles.buttonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
