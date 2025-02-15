import {useEffect, useRef, useState} from 'react';
import {useWS} from '../service/api/WSProvider';
import {useMeetStorage} from '../service/meetStore';
import {useUserStorage} from '../service/userStore';
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {peerConstraints} from '../utils/Helpers';

export const useWebRTC = () => {
  const {emit, on, off} = useWS();
  const {
    toggle,
    setStreamURL,
    updateParticipant,
    removeParticipant,
    addParticipant,
    addSessionId,
    videoOn,
    micOn,
    participants,
    sessionId,
    clear,
  } = useMeetStorage();
  const {user} = useUserStorage();

  const [localStream, setLocalStream] = useState(null);
  const peerConnections = useRef(new Map());
  const pendingCandidates = useRef(new Map());

  const startLocalStream = async () => {
    try {
      const mediaStream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setLocalStream(mediaStream);
    } catch (error) {
      console.error(error);
    }
  };

  const establishPeerConnection = async () => {
    participants?.forEach(async streamUser => {
      if (!peerConnections.current.has(streamUser?.userID)) {
        const peerConnection = new RTCPeerConnection(peerConstraints);
        peerConnections.current.set(streamUser?.userID, peerConnection);

        peerConnection.onTrack = event => {
          const remoteStream = new MediaStream();
          event.stream[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
          });
          console.log('RECEIVING REMOTE STREAM', remoteStream.toURL());
          setStreamURL(streamUser?.userId, remoteStream);
        };

        peerConnection.onIceCandidate = ({candidate}) => {
          if (candidate) {
            emit('send-ice-candidate', {
              sessionId: sessionId,
              sender: user?.id,
              receiver: streamUser?.userId,
              candidate: candidate,
            });
          }
        };

        localStream?.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });

        try {
          const offerDescription = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offerDescription);

          emit('send-offer', {
            sessionId: sessionId,
            sender: user?.id,
            receiver: streamUser?.userId,
            offer: offerDescription,
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const joinStream = async () => {
    await establishPeerConnection();
  };

  useEffect(() => {
    if (localStream) {
      joinStream();
    }
  }, [localStream]);

  useEffect(() => {
    startLocalStream();
    if (localStream) {
      return () => {
        localStream?.getTracks()?.forEach(track => {
          track.stop();
        });
      };
    }
  }, []);

  useEffect(() => {
    if (localStream) {
      on('receive-ice-candidate', handleReceiveIceCandidate);
      on('receive-offer', handleReceiveOffer);
      on('receive-answer', handleReceiveAnswer);
      on('new-participants', handleNewParticipant);
      on('participant-left', handleParticipantLeft);
      on('participant-update', handleParticipantUpdate);

      return () => {
        localStream?.getTracks()?.forEach(track => {
          track.stop();
        });
        peerConnections.current.forEach(peerConnection =>
          peerConnection.close(),
        );
        peerConnections.current.clear();
        addSessionId(null);
        clear();
        emit('hang-up');
        off('receive-ice-candidate');
        off('receive-offer');
        off('receive-answer');
        off('new-participants');
        off('participant-left');
        off('participant-update');
      };
    }
  }, [localStream]);

  const handleNewParticipant = participant => {
    if (participant?.userId === user?.id) {
      return;
    }

    addParticipant(participant);
  };

  const handleReceiveOffer = async ({sender, receiver, offer}) => {
    if (receiver !== user?.id) return;
    try {
      let peerConnection = peerConnections.current.get(sender);
      if (!peerConnection) {
        peerConnection = new RTCPeerConnection(peerConstraints);
        peerConnections.current.set(sender, peerConnection);

        peerConnection.onTrack = event => {
          const remoteStream = new MediaStream();
          event.streams[0].getTracks().forEach(track => {
            remoteStream.addStream(track);
            console.log('receiving remote stream', remoteStream.toURL());
          });

          setStreamURL(sender, remoteStream);
        };

        peerConnection.onIceCandidate = ({candidate}) => {
          if (candidate) {
            emit('send-ice-candidate', {
              sessionId: sessionId,
              sender: receiver,
              receiver: sender,
              candidate: candidate,
            });
          }
        };

        if (pendingCandidates.current.has(sender)) {
          pendingCandidates.current.get(sender).forEach(candidate => {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          });
          pendingCandidates.current.delete(sender);
        }

        if (localStream) {
          peerConnection.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
          });
        }
      }

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      emit('send-answer', {
        sessionId: sessionId,
        sender: receiver,
        receiver: sender,
        answer: answer,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReceiveAnswer = async ({sender, receiver, answer}) => {
    if (receiver !== user?.id) return;
    try {
      let peerConnection = peerConnections.current.get(sender);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReceiveIceCandidate = async ({sender, receiver, candidate}) => {
    if (receiver !== user?.id) return;
    try {
      let peerConnection = peerConnections.current.get(sender);
      if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        if (!pendingCandidates.current.has(sender)) {
          pendingCandidates?.current?.set(sender, []);
        }

        pendingCandidates?.current?.get(sender).push(candidate);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleParticipantUpdate = updatedParticipant => {
    updateParticipant(updatedParticipant);
  };

  const handleParticipantLeft = userId => {
    removeParticipant(userId);
    const peerConnection = peerConnections.current.get(userId);
    if (peerConnection) {
      peerConnection.close();
      peerConnections.current.delete(userId);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      localStream?.getAudioTracks().forEach(track => {
        micOn ? (track.enabled = false) : (track.enabled = true);
      });
    }
    toggle('mic');
    emit('toggle-mic', {
      sessionId: sessionId,
      userId: user?.id,
    });
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream?.getVideoTracks().forEach(track => {
        videoOn ? (track.enabled = false) : (track.enabled = true);
      });
    }
    toggle('video');
    emit('toggle-video', {
      sessionId: sessionId,
      userId: user?.id,
    });
  };

  const switchCamera = () => {
    if (localStream) {
      localStream?.getVideoTracks().forEach(track => {
        track._switchCamera();
      });
    }
  };

  return {
    localStream,
    participants,
    toggleMic,
    toggleVideo,
    switchCamera,
  };
};
