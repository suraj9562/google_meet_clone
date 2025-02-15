import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useContainerDimensions} from '../hooks/useContainerDimensions';
import {useWebRTC} from '../hooks/useWebRTC';
import MeetHeader from '../components/meet/MeetHeader';
import UserView from '../components/meet/UserView';
import People from '../components/meet/People';
import NoUserInvite from '../components/meet/NoUserInvite';
import MeetFooter from '../components/meet/MeetFooter';
import {peopleData} from '../utils/dummyData';

const Meet = () => {
  const {containerDimensions, onContainerLayout} = useContainerDimensions();
  const {localStream, participants, toggleMic, toggleVideo, switchCamera} =
    useWebRTC();

  return (
    <View style={styles.container}>
      <MeetHeader switchCamera={switchCamera} />
      <View style={styles.peopleContainer} onLayout={onContainerLayout}>
        {containerDimensions && localStream && (
          <UserView
            localStream={localStream}
            containerDimensions={containerDimensions}
          />
        )}

        {participants.length > 0 ? (
          <People
            containerDimensions={containerDimensions}
            people={participants}
          />
        ) : (
          <NoUserInvite />
        )}
      </View>

      <MeetFooter toggleMic={toggleMic} toggleVideo={toggleVideo} />
    </View>
  );
};

export default Meet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  peopleContainer: {
    flex: 1,
  },
});
