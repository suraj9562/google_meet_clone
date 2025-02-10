import 'react-native-get-random-values';
import {
  View,
  Text,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useUserStorage} from '../../service/userStore';
import {v4 as uuidv4} from 'uuid';
import {inquiryStyles} from '../../styles/inquiryStyles';

const InquiryModal = ({visible, onClose}) => {
  const {user, setUser} = useUserStorage();
  const [name, setName] = useState('');
  const [profilePhotoURL, setProfilePhotoURL] = useState('');

  useEffect(() => {
    const storedName = user?.name;
    const storedProfilePhotoURL = user?.photo;

    setName(storedName || '');
    setProfilePhotoURL(storedProfilePhotoURL || '');
  }, [visible]);

  const handleSave = () => {
    if (name.trim() && profilePhotoURL.trim()) {
      setUser({id: uuidv4(), name: name, photo: profilePhotoURL});
      onClose();
    } else {
      Alert.alert('Please fill the details of your profile');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={inquiryStyles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={inquiryStyles.keyboardAvoidingView}>
            <ScrollView contentContainerStyle={inquiryStyles.scrollViewContent}>
              <View style={inquiryStyles.modalContent}>
                <Text style={inquiryStyles.title}>Enter Your Details</Text>
                <TextInput
                  style={inquiryStyles.input}
                  placeholder="Enter Your Name"
                  placeholderTextColor={'#ccc'}
                  value={name}
                  onChangeText={setName}
                />

                <TextInput
                  style={inquiryStyles.input}
                  placeholder="Enter Your Profile Photo URL"
                  placeholderTextColor={'#ccc'}
                  value={profilePhotoURL}
                  onChangeText={setProfilePhotoURL}
                />

                <View style={inquiryStyles.buttonContainer}>
                  <TouchableOpacity
                    style={inquiryStyles.button}
                    onPress={handleSave}>
                    <Text style={inquiryStyles.buttonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[inquiryStyles.button, inquiryStyles.cancelButton]}
                    onPress={onClose}>
                    <Text style={inquiryStyles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default InquiryModal;
