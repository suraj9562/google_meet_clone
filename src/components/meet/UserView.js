import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import React, {useRef} from 'react';
import {useMeetStorage} from '../../service/meetStore';
import {useUserStorage} from '../../service/userStore';
import {RFValue} from 'react-native-responsive-fontsize';
import {RTCView} from 'react-native-webrtc';
import {EllipsisVertical} from 'lucide-react-native';

const UserView = ({localStream, containerDimensions}) => {
  const {width: containerWidth, height: containerHeight} = containerDimensions;

  const {micOn, videoOn} = useMeetStorage();
  const {user} = useUserStorage();

  const pan = useRef(
    new Animated.ValueXY({
      x: containerWidth - containerWidth * 0.24 - 10,
      y: containerHeight - containerHeight * 0.26 - 20,
    }),
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (event, gestureState) => {
        pan.flattenOffset();
        const {dx, dy} = gestureState;
        const draggedToX = pan.x._value + dx;
        const draggedToY = pan.y._value + dy;

        const restrictedX = Math.min(
          Math.max(draggedToX, 0),
          containerWidth - containerWidth * 0.24,
        );

        const restrictedY = Math.min(
          Math.max(draggedToY, 0),
          containerHeight - containerHeight * 0.18,
        );

        const distances = {
          topLeft: Math.sqrt(restrictedX ** 2 + restrictedY ** 2),
          topRight: Math.sqrt(
            (containerWidth - restrictedX) ** 2 + restrictedY ** 2,
          ),
          bottomLeft: Math.sqrt(
            restrictedX ** 2 + (containerHeight - restrictedY) ** 2,
          ),
          bottomRight: Math.sqrt(
            (containerWidth - restrictedX) ** 2 +
              (containerHeight - restrictedY) ** 2,
          ),
        };

        // console.log(distances);

        const closestCorner = Object.keys(distances).reduce((a, b) =>
          distances[a] < distances[b] ? a : b,
        );

        let finalX = 0;
        let finalY = 0;

        // console.log(closestCorner);

        switch (closestCorner) {
          case 'topLeft':
            finalX = 10;
            finalY = 10;
            break;
          case 'topRight':
            finalX = containerWidth - containerWidth * 0.24 - 10;
            finalY = 10;
            break;
          case 'bottomLeft':
            finalX = 10;
            finalY = containerHeight - containerHeight * 0.26 - 20;
            break;
          case 'bottomRight':
            finalX = containerWidth - containerWidth * 0.24 - 10;
            finalY = containerHeight - containerHeight * 0.26 - 20;
            break;
        }

        // console.log({finalX, finalY});

        Animated.spring(pan, {
          toValue: {x: finalX, y: finalY},
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        },
      ]}>
      {user && (
        <>
          {localStream && videoOn ? (
            <RTCView
              streamURL={localStream?.toURL()}
              style={styles.localVideo}
              mirror
              zOrder={2}
              objectFit="cover"
            />
          ) : (
            <>
              {user?.photo ? (
                <Image source={{uri: user?.photo}} style={styles.image} />
              ) : (
                <View style={styles.noVideo}>
                  <Text style={styles.initial}>{user?.name?.charAt(0)}</Text>
                </View>
              )}
            </>
          )}
        </>
      )}

      <Text style={styles.name}>You</Text>
      <View style={styles.ellipsis}>
        <EllipsisVertical color={'#FFF'} size={RFValue(14)} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '22%',
    width: '24%',
    zIndex: 99,
    elevation: 10,
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: '#202020',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.6,
    shadowRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
  },

  ellipsis: {
    position: 'absolute',
    bottom: 5,
    right: 2,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  noVideo: {
    backgroundColor: '#FF5100',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  localVideo: {
    width: '100%',
    borderRadius: 10,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  initial: {
    fontSize: RFValue(14),
    color: '#FFF',
  },
  name: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    zIndex: 99,
    fontWeight: '600',
    color: '#FFF',
    fontSize: RFValue(10),
  },
});

export default UserView;
