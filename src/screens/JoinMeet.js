import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {joinStyles} from '../styles/joinStyles';
import {ChevronLeft, EllipsisVertical, Video} from 'lucide-react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {goBack, navigate} from '../utils/NavigationUtils';
import {Colors} from '../utils/Constants';
import {LinearGradient} from 'react-native-linear-gradient';
import {useWS} from '../service/api/WSProvider';
import {useUserStorage} from '../service/userStore';
import {useMeetStorage} from '../service/meetStore';
import {checkSession, createSession} from '../service/api/session';
import {removeHyphens} from '../utils/Helpers';

const JoinMeet = () => {
  const {emit} = useWS();
  const {user, addSession, removeSession} = useUserStorage();
  const {addSessionId, removeSessionId} = useMeetStorage();
  const [code, setCode] = useState('');

  const createNewMeet = async () => {
    const sessionId = await createSession();
    if (sessionId) {
      addSession(sessionId);
      addSessionId(sessionId);
      emit('prepare-session', {
        userId: user?.id,
        sessionId: sessionId,
      });
      navigate('prepareMeet');
    }
  };
  const joinViaSessionId = async () => {
    const isAvaliable = await checkSession(code);

    if (isAvaliable) {
      emit('prepare-session', {
        userId: user?.id,
        sessionId: removeHyphens(code),
      });
      addSession(code);
      addSessionId(code);
      navigate('prepareMeet');
    } else {
      removeSession(code);
      removeSessionId(code);
      setCode('');
      Alert.alert('No meeting found with given meeting ID.');
    }
  };

  return (
    <View style={joinStyles.container}>
      <SafeAreaView />
      <View style={joinStyles.headerContainer}>
        <ChevronLeft
          size={RFValue(18)}
          onPress={() => goBack()}
          color={Colors.text}
        />
        <Text style={joinStyles.headerText}>Join Meet</Text>
        <EllipsisVertical size={RFValue(18)} color={Colors.text} />
      </View>

      <LinearGradient
        colors={['#007AFF', '#A6C8FF']}
        style={joinStyles.gradientButton}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <TouchableOpacity
          style={joinStyles.button}
          activeOpacity={0.7}
          onPress={createNewMeet}>
          <Video size={RFValue(22)} color="#FFF" />
          <Text style={joinStyles.buttonText}>Create New Meet</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Text style={joinStyles.orText}>OR</Text>

      <View style={joinStyles.inputContainer}>
        <Text style={joinStyles.labelText}>
          Enter the code provided by the meeting organiser
        </Text>
        <TextInput
          style={joinStyles.inputBox}
          value={code}
          onChangeText={setCode}
          returnKeyLabel="Join"
          returnKeyType="join"
          onSubmitEditing={() => joinViaSessionId()}
          placeholder="Example: abc-mnop-xyz"
          placeholderTextColor={'#888'}
        />
        <Text style={joinStyles.noteText}>
          Note: This meeting is secured with cloud encryption but not end-to-end
          encryption <Text style={joinStyles.linkText}> Learn more</Text>
        </Text>
      </View>
    </View>
  );
};

export default JoinMeet;
