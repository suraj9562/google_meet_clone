import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CircleUser, Menu} from 'lucide-react-native';

import {useUserStorage} from '../../service/userStore';
import InquiryModal from './InquiryModal';
import {headerStyles} from '../../styles/headerStyles';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../utils/Constants';
import {navigate} from '../../utils/NavigationUtils';

const HomeHeader = () => {
  const [visible, setVisible] = useState(false);
  const {user} = useUserStorage();

  useEffect(() => {
    const checkUserName = () => {
      const storedName = user?.name;
      if (!storedName) {
        setVisible(true);
      }
    };

    checkUserName();
  }, []);

  const handleNavigation = () => {
    const storedName = user?.name;
    if (!storedName) {
      setVisible(true);
      return;
    }
    navigate('joinMeet');
  };

  return (
    <>
      <SafeAreaView />
      <View style={headerStyles.container}>
        <Menu name="menu" size={RFValue(20)} color={Colors.text} />
        <TouchableOpacity
          style={headerStyles.textContainer}
          onPress={handleNavigation}>
          <Text style={headerStyles.placeholderText}>Enter Meeting Code</Text>
        </TouchableOpacity>
        <CircleUser
          name="menu"
          onPress={() => setVisible(true)}
          size={RFValue(20)}
          color={Colors.primary}
        />
      </View>

      <InquiryModal onClose={() => setVisible(false)} visible={visible} />
    </>
  );
};

export default HomeHeader;
