// lib/config/avatars.ts
import { 
  User, Bot, Rocket, Cat, Dog, Bird, Fish, 
  Squirrel, Rabbit, Turtle, Sparkles, Heart, 
  Coffee, Trophy, Brain, Code2 
} from 'lucide-react';

export const avatarIcons = [
  { id: 'user', icon: User, color: 'from-blue-500 to-cyan-500' },
  { id: 'bot', icon: Bot, color: 'from-purple-500 to-pink-500' },
  { id: 'rocket', icon: Rocket, color: 'from-orange-500 to-red-500' },
  { id: 'cat', icon: Cat, color: 'from-yellow-500 to-orange-500' },
  { id: 'dog', icon: Dog, color: 'from-brown-500 to-orange-700' },
  { id: 'bird', icon: Bird, color: 'from-sky-400 to-blue-600' },
  { id: 'fish', icon: Fish, color: 'from-cyan-400 to-teal-600' },
  { id: 'squirrel', icon: Squirrel, color: 'from-amber-500 to-orange-600' },
  { id: 'rabbit', icon: Rabbit, color: 'from-pink-400 to-rose-500' },
  { id: 'turtle', icon: Turtle, color: 'from-green-500 to-emerald-600' },
  { id: 'sparkles', icon: Sparkles, color: 'from-yellow-300 to-pink-500' },
  { id: 'heart', icon: Heart, color: 'from-red-500 to-pink-600' },
  { id: 'coffee', icon: Coffee, color: 'from-brown-600 to-amber-700' },
  { id: 'trophy', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
  { id: 'brain', icon: Brain, color: 'from-purple-600 to-indigo-700' },
  { id: 'code', icon: Code2, color: 'from-green-500 to-teal-600' }
];

export function getAvatarComponent(avatarId: string) {
  const avatar = avatarIcons.find(a => a.id === avatarId) || avatarIcons[0];
  return { IconComponent: avatar.icon, color: avatar.color };
}