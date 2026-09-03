import { RealTimeAlert } from '../types';

export const REAL_TIME_ALERTS: RealTimeAlert[] = [
  {
    id: 'alert-weather-rain',
    type: 'weather',
    severity: 'high',
    title: '⚠️ Heavy Rain Alert: Mysore Central & Chamundi',
    message: 'Scattered thunderstorms expected tomorrow afternoon (14:00 - 17:00). High probability of outdoor tour disruptions.',
    timestamp: '15 mins ago',
    affectedDestination: 'Mysore Region',
    suggestedAction: 'Visit Mysore Palace in the morning, move to indoor Jaganmohan Art Gallery after 2:00 PM.'
  },
  {
    id: 'alert-place-closed',
    type: 'tourist_place',
    severity: 'high',
    title: '🔴 Biological Safety Maintenance: Mysore Zoo',
    message: 'Sri Chamarajendra Zoological Gardens temporarily closed until 2:00 PM today for veterinary sanitation.',
    timestamp: '25 mins ago',
    affectedDestination: 'Mysore Zoo',
    suggestedAction: 'Explore Rail Museum or St. Philomena Cathedral while awaiting 2:00 PM reopening.'
  },
  {
    id: 'alert-transport-delay',
    type: 'transport',
    severity: 'medium',
    title: '🚌 Rail Disruption Detected: Chamundi Express',
    message: 'Train #16216 delayed by 35 mins due to signal synchronization. Waitlist clearance is low.',
    timestamp: '35 mins ago',
    affectedDestination: 'Bangalore - Mysore Corridor',
    suggestedAction: 'Book KSRTC Airavat AC Bus (₹450, 4h 10m) departing in 20 mins from Satellite Station.'
  },
  {
    id: 'alert-palace-illumination',
    type: 'tourist_place',
    severity: 'info',
    title: '✨ Special Illumination: Mysore Palace',
    message: '100,000 incandescent bulbs will be switched on tonight at 7:00 PM accompanied by the Police Band concert.',
    timestamp: '1 hour ago',
    affectedDestination: 'Mysore Palace',
    suggestedAction: 'Arrive at Varaha Gate before 6:30 PM to secure prime viewing spots in front of the Durbar Hall.'
  },
  {
    id: 'alert-road-maintenance',
    type: 'transport',
    severity: 'medium',
    title: '🚗 NH 275 Expressway Lane Maintenance',
    message: 'Single-lane asphalt resurfacing near Ramanagara toll plaza. Expected delay of 12-15 minutes during peak hours.',
    timestamp: '2 hours ago',
    affectedDestination: 'Bangalore-Mysore Expressway',
    suggestedAction: 'Use Fastag Lane 3 & 4 or divert via Kanakapura Road (NH 209) for scenic, unhurried driving.'
  }
];

export const INITIAL_ALERTS = REAL_TIME_ALERTS;
