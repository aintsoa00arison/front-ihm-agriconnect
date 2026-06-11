export type Message = {
  id: number;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: Date;
  status?: "envoyé" | "distribué" | "lu";
};

export type MessageGroup = {
  date: Date;
  messages: Message[];
};

const ME = "me";

export const mockMessages: MessageGroup[] = [
  {
    date: new Date("2024-09-12"),
    messages: [
      {
        id: 1,
        senderId: "fitahiana",
        senderName: "Fitahiana",
        content: "Manao ahoana! Manana fanontaniana momba ny vokatra aho.",
        sentAt: new Date("2024-09-12T09:12:00"),
      },
      {
        id: 2,
        senderId: "fitahiana",
        senderName: "Fitahiana",
        content: "Ahoana ny vidiny amin'izao fotoana izao?",
        sentAt: new Date("2024-09-12T09:13:00"),
      },
      {
        id: 3,
        senderId: ME,
        senderName: "Moi",
        content:
          "Miarahaba! Eny, azoko valiana izany. Ny vidiny ankehitriny dia 2500 Ar/kg.",
        sentAt: new Date("2024-09-12T09:15:00"),
        status: "lu",
      },
      {
        id: 4,
        senderId: "fitahiana",
        senderName: "Fitahiana",
        content: "Misaotra betsaka! Haninjitra 50kg aho raha azo atao.",
        sentAt: new Date("2024-09-12T09:17:00"),
      },
      {
        id: 5,
        senderId: ME,
        senderName: "Moi",
        content: "Tsara be! Azonao alaina ny vokatra rahampitso maraina.",
        sentAt: new Date("2024-09-12T09:18:00"),
        status: "distribué",
      },
    ],
  },
  {
    date: new Date("2024-09-13"),
    messages: [
      {
        id: 6,
        senderId: "fitahiana",
        senderName: "Fitahiana",
        content: "Tonga aho! Eo am-piandrasana ianao ve?",
        sentAt: new Date("2024-09-13T08:45:00"),
      },
      {
        id: 7,
        senderId: ME,
        senderName: "Moi",
        content: "Eny, eto aho. Tongava fotsiny!",
        sentAt: new Date("2024-09-13T08:46:00"),
        status: "lu",
      },
    ],
  },
];
