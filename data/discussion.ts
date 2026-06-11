export type Discussion = {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageDate: Date;
  hasNewMessage: boolean;
  isOnline : boolean;
};

export const discussions: Discussion[] = [
  {
    id: 1,
    name: "Fitahiana",
    lastMessage: "Manao ahoana ny vokatra androany?",
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 15),
    hasNewMessage: true,
    isOnline: true,
  },
  {
    id: 2,
    name: "Rakoto Jean",
    lastMessage: "Misaotra betsaka, hanatona anao aho rahampitso.",
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    hasNewMessage: true,
    isOnline: false,
  },
  {
    id: 3,
    name: "Voahirana",
    lastMessage: "Eny, azoko tsara. Hiandry ny valinteninao aho.",
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 5),
    hasNewMessage: false,
    isOnline: true,
  },
  {
    id: 4,
    name: "Andry Michel",
    lastMessage: "Oky, hifandraisana isika rahampitso.",
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    hasNewMessage: false,
    isOnline: true,
  },
  {
    id: 5,
    name: "Santatra",
    lastMessage: "Ahoana ny vidiny amin'izao fotoana izao?",
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    isOnline: false,
    hasNewMessage: true,
  },
  {
    id: 6,
    name: "Henintsoa",
    lastMessage: "Azonao ampitaina amiko ve ny lisitra?",
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    isOnline: false,
    hasNewMessage: false,
  },
  {
    id: 7,
    name: "Fara Noro",
    lastMessage: "Tsara be, misaotra!",
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    isOnline: false,
    hasNewMessage: false,
  },
];
