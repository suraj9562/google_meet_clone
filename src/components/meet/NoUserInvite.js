import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useMeetStorage} from '../../service/meetStore';
import {inviteStyles} from '../../styles/inviteStyles';
import {addHyphens} from '../../utils/Helpers';
import {Clipboard, Share} from 'lucide-react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../utils/Constants';

const NoUserInvite = () => {
  const {sessionId} = useMeetStorage();
  return (
    <View style={inviteStyles.container}>
      <Text style={inviteStyles.headerText}>You're the only one here!</Text>
      <Text style={inviteStyles.subText}>
        Share this meeting link with others that you want in meeting
      </Text>
      <View style={inviteStyles.linkContainer}>
        <Text style={inviteStyles.linkText}>
          mee.google.com/{addHyphens(sessionId)}
        </Text>
        <TouchableOpacity style={inviteStyles.iconButton}>
          <Clipboard size={RFValue(20)} color={'#FFF'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={inviteStyles.shareButton}>
        <Share size={RFValue(20)} color={'#000'} />
        <Text style={inviteStyles.shareText}>Share Invite</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoUserInvite;
