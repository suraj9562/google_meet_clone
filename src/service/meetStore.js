import {create} from 'zustand';
import {createJSONStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';

export const useMeetStorage = create()(
  (set, get) => ({
    sessionId: null,
    participants: [],
    chatMessages: [],
    micOn: false,
    videoOn: false,

    clear: () => {
      set({sessionId: null, participants: [], chatMessages: []});
    },

    addSessionId: id => {
      set({sessionId: id});
    },

    removeSessionId: () => {
      set({sessionId: null});
    },

    addParticipant: participant => {
      const {participants} = get();

      if (!participants.find(p => p.userId === participant?.userId)) {
        set({participants: [...participants, participant]});
      }
    },

    removeParticipant: participantId => {
      const {participants} = get();

      set({participants: participants.filter(p => p.userId !== participantId)});
    },

    updateParticipant: participant => {
      const {participants} = get();
      set({
        participants: participants.map(p =>
          p.userId !== participant.userId
            ? {...p, micOn: participant.micOn, videoOn: participant.videoOn}
            : p,
        ),
      });
    },

    setStreamURL: (participantId, streamURL) => {
      const {participants} = get();
      const updatedParticipants = participants.map(p => {
        if (p.userId === participantId) {
          return {...p, streamURL};
        }
        return p;
      });

      //   if (!participants.some(p => p.userId === participantId)) {
      //     updatedParticipants.push({id: participantId, streamURL});
      //   }

      set({participants: updatedParticipants});
    },

    toggle: type => {
      if (type === 'mic') {
        set(state => ({
          micOn: !state.micOn,
        }));
      } else if (type === 'video') {
        set(state => ({
          videoOn: !state.videoOn,
        }));
      }
    },
  }),
  {
    name: 'live-meet-storage',
    storage: createJSONStorage(() => mmkvStorage),
  },
);
