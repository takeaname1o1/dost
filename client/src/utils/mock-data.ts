import { Companion } from "@shared/schema";

// Sample companion image URLs (for production, these would come from a database)
export const companionImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956",
  "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
];

// Sample companion data
export const sampleCompanions: Companion[] = [
  {
    id: 1,
    name: "Priya",
    age: 23,
    languages: "Hindi, English",
    interests: "Music, Movies, Travel",
    imageUrl: `${companionImages[0]}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400`,
    isOnline: true
  },
  {
    id: 2,
    name: "Neha",
    age: 25,
    languages: "Hindi, Marathi",
    interests: "Reading, Art, Cooking",
    imageUrl: `${companionImages[1]}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400`,
    isOnline: true
  },
  {
    id: 3,
    name: "Anjali",
    age: 24,
    languages: "Hindi, English",
    interests: "Fashion, Dance, Photography",
    imageUrl: `${companionImages[2]}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400`,
    isOnline: false
  },
  {
    id: 4,
    name: "Riya",
    age: 26,
    languages: "Hindi, English, Marathi",
    interests: "Travel, Fitness, Music",
    imageUrl: `${companionImages[3]}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400`,
    isOnline: true
  },
  {
    id: 5,
    name: "Meera",
    age: 22,
    languages: "Hindi, Marathi",
    interests: "Yoga, Painting, Cooking",
    imageUrl: `${companionImages[4]}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400`,
    isOnline: true
  },
  {
    id: 6,
    name: "Pooja",
    age: 24,
    languages: "Hindi, English",
    interests: "Movies, Music, Dancing",
    imageUrl: `${companionImages[5]}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400`,
    isOnline: false
  },
  {
    id: 7,
    name: "Divya",
    age: 27,
    languages: "Hindi, English, Marathi",
    interests: "Travel, Books, Movies",
    imageUrl: `${companionImages[6]}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400`,
    isOnline: true
  },
  {
    id: 8,
    name: "Sonia",
    age: 25,
    languages: "Hindi, English",
    interests: "Fashion, Photography, Travel",
    imageUrl: `${companionImages[7]}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400`,
    isOnline: true
  }
];

// Get random duration between 1 and 10 minutes (in seconds)
export const getRandomDuration = (): number => {
  return Math.floor(Math.random() * 600) + 60; // 60 to 660 seconds
};

// Calculate coins spent based on call type and duration
export const calculateCoinsSpent = (type: string, duration: number): number => {
  const ratePerMinute = type === "audio" ? 10 : 60;
  return Math.floor((ratePerMinute / 60) * duration);
};
