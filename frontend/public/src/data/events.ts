export type EventType = "Ceremony" | "Keynote" | "Workshop" | "Panel" | "Networking" | "Break";

export interface ExpoEvent {
  id: string;
  time: string;
  name: string;
  room: string;
  type: EventType;
  description: string;
  capacity: number;
  remaining: number;
}

export const EVENTS: ExpoEvent[] = [
  {
    id: "opening-ceremony",
    time: "09:00 – 10:00",
    name: "Opening Ceremony",
    room: "Hall A",
    type: "Ceremony",
    description: "Kick-off the Expo with keynote addresses from dignitaries and our organizing committee.",
    capacity: 500,
    remaining: 142,
  },
  {
    id: "keynote-innovation",
    time: "10:00 – 11:30",
    name: "Keynote: Innovation",
    room: "Hall B",
    type: "Keynote",
    description: "Three leading founders share how they ship product at the edge of what's known.",
    capacity: 300,
    remaining: 41,
  },
  {
    id: "workshop-tech-expo",
    time: "11:30 – 13:00",
    name: "Workshop: Tech Expo",
    room: "Room 1",
    type: "Workshop",
    description: "Hands-on session with the Tech Expo team. Bring a laptop and a hunger to build.",
    capacity: 60,
    remaining: 8,
  },
  {
    id: "panel-future-ai",
    time: "14:00 – 15:30",
    name: "Panel: Future of AI",
    room: "Hall A",
    type: "Panel",
    description: "Researchers and policy makers debate what AI safety looks like in five years.",
    capacity: 400,
    remaining: 87,
  },
  {
    id: "networking-session",
    time: "15:30 – 17:00",
    name: "Networking Session",
    room: "Lobby",
    type: "Networking",
    description: "Meet exhibitors, speakers and fellow attendees over drinks.",
    capacity: 200,
    remaining: 156,
  },
];

export const typeVariant: Record<EventType, "default" | "secondary" | "outline"> = {
  Ceremony:   "default",
  Keynote:    "default",
  Workshop:   "secondary",
  Panel:      "secondary",
  Networking: "outline",
  Break:      "outline",
};