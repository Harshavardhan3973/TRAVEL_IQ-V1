import { CityWeather } from '../types';

export const WEATHER_DATA: Record<string, CityWeather> = {
  Mysore: {
    city: 'Mysore, Karnataka',
    temp: 27,
    feelsLike: 29,
    condition: 'Partly Cloudy with Afternoon Showers Risk',
    humidity: 64,
    windSpeed: '12 km/h NE',
    rainProb: 45,
    uvIndex: 6,
    airQuality: 'Good (AQI 38)',
    sunrise: '06:12 AM',
    sunset: '06:38 PM',
    travelImpactNote: '⚠️ Moderate rain predicted between 02:30 PM and 05:00 PM. Recommendation: Tour outdoor palaces and gardens early morning; schedule indoor galleries (Jaganmohan Palace Art Gallery, Silk Weaving) for the afternoon.',
    hourly: [
      { time: '06:00 AM', temp: 22, condition: 'Clear', rainProb: 5, icon: '🌅' },
      { time: '09:00 AM', temp: 25, condition: 'Sunny', rainProb: 10, icon: '☀️' },
      { time: '12:00 PM', temp: 28, condition: 'Partly Cloudy', rainProb: 20, icon: '⛅' },
      { time: '02:00 PM', temp: 29, condition: 'Cloud Building', rainProb: 40, icon: '🌥️' },
      { time: '04:00 PM', temp: 26, condition: 'Scattered Showers', rainProb: 75, icon: '🌧️' },
      { time: '06:00 PM', temp: 24, condition: 'Clearing Skies', rainProb: 25, icon: '🌤️' },
      { time: '08:00 PM', temp: 23, condition: 'Cool Breeze', rainProb: 10, icon: '🌙' },
      { time: '10:00 PM', temp: 21, condition: 'Clear Night', rainProb: 5, icon: '✨' }
    ],
    daily: [
      { day: 'Today', date: 'Wed, 3 Sep', condition: 'Afternoon Rain', high: 29, low: 21, rainProb: 45, advisory: 'Carry an umbrella for 3 PM onwards', icon: '🌦️' },
      { day: 'Thursday', date: '4 Sep', condition: 'Sunny & Pleasant', high: 30, low: 20, rainProb: 10, advisory: 'Optimal day for Chamundi Hill & Zoo', icon: '☀️' },
      { day: 'Friday', date: '5 Sep', condition: 'Partly Cloudy', high: 28, low: 21, rainProb: 20, advisory: 'Great for Brindavan musical fountains', icon: '⛅' },
      { day: 'Saturday', date: '6 Sep', condition: 'Light Passing Showers', high: 27, low: 22, rainProb: 35, advisory: 'Weekend peak crowd alert at Palace', icon: '🌦️' },
      { day: 'Sunday', date: '7 Sep', condition: 'Clear & Breezy', high: 28, low: 20, rainProb: 15, advisory: 'Palace illumination 7:00 PM will be clear', icon: '✨' },
      { day: 'Monday', date: '8 Sep', condition: 'Mostly Sunny', high: 29, low: 21, rainProb: 10, advisory: 'Best photography lighting morning 8-11 AM', icon: '☀️' },
      { day: 'Tuesday', date: '9 Sep', condition: 'Sunny & Warm', high: 30, low: 21, rainProb: 5, advisory: 'Note: Zoo & Karanji Lake closed on Tuesdays', icon: '☀️' }
    ]
  },
  Jaipur: {
    city: 'Jaipur, Rajasthan',
    temp: 31,
    feelsLike: 33,
    condition: 'Sunny & Clear',
    humidity: 38,
    windSpeed: '9 km/h NW',
    rainProb: 0,
    uvIndex: 8,
    airQuality: 'Moderate (AQI 92)',
    sunrise: '06:05 AM',
    sunset: '06:45 PM',
    travelImpactNote: '☀️ High afternoon UV index. Recommendation: Explore Amber Fort and Hawa Mahal before 11:30 AM or after 04:30 PM; stay hydrated and carry sun protection.',
    hourly: [
      { time: '06:00 AM', temp: 24, condition: 'Clear', rainProb: 0, icon: '🌅' },
      { time: '09:00 AM', temp: 28, condition: 'Sunny', rainProb: 0, icon: '☀️' },
      { time: '12:00 PM', temp: 32, condition: 'Bright Sun', rainProb: 0, icon: '☀️' },
      { time: '03:00 PM', temp: 33, condition: 'Sunny', rainProb: 0, icon: '☀️' },
      { time: '06:00 PM', temp: 29, condition: 'Golden Sunset', rainProb: 0, icon: '🌇' },
      { time: '09:00 PM', temp: 26, condition: 'Pleasant Night', rainProb: 0, icon: '🌙' }
    ],
    daily: [
      { day: 'Today', date: 'Wed, 3 Sep', condition: 'Sunny', high: 33, low: 23, rainProb: 0, advisory: 'Perfect weather for Nahargarh sunset', icon: '☀️' },
      { day: 'Thursday', date: '4 Sep', condition: 'Clear Sky', high: 34, low: 24, rainProb: 0, advisory: 'Ideal for Chokhi Dhani evening dinner', icon: '☀️' },
      { day: 'Friday', date: '5 Sep', condition: 'Sunny', high: 33, low: 23, rainProb: 0, advisory: 'Dry and clear', icon: '☀️' },
      { day: 'Saturday', date: '6 Sep', condition: 'Sunny & Warm', high: 34, low: 25, rainProb: 5, advisory: 'Light evening breeze', icon: '☀️' },
      { day: 'Sunday', date: '7 Sep', condition: 'Partly Sunny', high: 32, low: 24, rainProb: 10, advisory: 'Pleasant day for shopping in Bapu Bazaar', icon: '⛅' },
      { day: 'Monday', date: '8 Sep', condition: 'Clear', high: 33, low: 23, rainProb: 0, advisory: 'Clear skies', icon: '☀️' },
      { day: 'Tuesday', date: '9 Sep', condition: 'Sunny', high: 34, low: 24, rainProb: 0, advisory: 'Warm afternoon', icon: '☀️' }
    ]
  }
};
