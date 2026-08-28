import { WeatherCurrent, HourlyForecast, DailyForecast, Risk, Alert, CommunityReport } from './types';

export const mockCurrent: WeatherCurrent = {
  temp:31, feelsLike:34, humidity:65, windSpeed:24, windDir:'SE', rainProb:82, visibility:8, aqi:68, condition:'Partly Cloudy • Monsoon',
  updatedAt: new Date().toISOString(), sources:['Weather API','Radar','Satellite','Government Warning'], confidence:'High'
};
export const mockHourly: HourlyForecast[] = [
  { time:'Now', temp:31, icon:'⛅', rainProb:80 },
  { time:'2 PM', temp:31, icon:'🌧️', rainProb:85 },
  { time:'3 PM', temp:30, icon:'🌧️', rainProb:82 },
  { time:'4 PM', temp:28, icon:'⛈️', rainProb:90 },
  { time:'6 PM', temp:27, icon:'🌧️', rainProb:75 },
  { time:'8 PM', temp:26, icon:'🌧️', rainProb:70 },
];
export const mockDaily: DailyForecast[] = [
  { day:'Today', icon:'🌧️', rainProb:85, high:31, low:24, condition:'Heavy Rain' },
  { day:'Tue', icon:'🌧️', rainProb:60, high:29, low:23, condition:'Moderate Rain' },
  { day:'Wed', icon:'⛅', rainProb:20, high:32, low:24, condition:'Partly Cloudy' },
  { day:'Thu', icon:'☀️', rainProb:10, high:34, low:25, condition:'Sunny' },
  { day:'Fri', icon:'⛈️', rainProb:75, high:28, low:23, condition:'Thunderstorm' },
  { day:'Sat', icon:'🌧️', rainProb:65, high:30, low:24, condition:'Rain' },
  { day:'Sun', icon:'⛅', rainProb:25, high:33, low:25, condition:'Cloudy' },
];
export const mockRisks: Risk[] = [
  { hazard:'Heavy Rain', level:'High', probability:85, time:'Tonight 8 PM', location:'Salem, TN', sources:['IMD','Radar'], confidence:'High', action:'Avoid low-lying roads, protect crops.' },
  { hazard:'Flood', level:'Moderate', probability:62, time:'Next 12h', location:'Coastal Regions', sources:['CWC','Radar'], confidence:'Medium', action:'Monitor water levels, keep emergency kit ready.' },
  { hazard:'Strong Wind', level:'Moderate', time:'Tomorrow', location:'Coastal TN', sources:['IMD'], confidence:'Medium', action:'Secure loose objects, fishers avoid sea.' },
  { hazard:'Lightning', level:'High', time:'Tonight', location:'Salem', sources:['Radar'], confidence:'High', action:'Stay indoors during thunderstorm.' },
];
export const mockAlerts: Alert[] = [
  { id:'a1', type:'critical', title:'Critical Weather Alert', message:'Heavy rainfall and flood risk are expected in your area. Avoid unnecessary travel.', messageLocal:'உங்கள் பகுதியில் கனமழை மற்றும் வெள்ள அபாயம் உள்ளது. தேவையற்ற பயணங்களைத் தவிர்க்கவும்.', level:'CRITICAL', location:'Coastal Regions', time:'Next 3 Hours', hazard:'Flood' },
  { id:'a2', type:'normal', title:'Rain Briefing', message:'Rain probability is 60% today. Carry an umbrella.', messageLocal:'இன்று மழை பெய்ய 60% வாய்ப்பு உள்ளது.', level:'Moderate', location:'Salem', time:'Today', hazard:'Rain' },
  { id:'a3', type:'normal', title:'Temperature Update', message:"Today's temperature may reach 33°C. Stay hydrated.", messageLocal:'இன்று வெப்பநிலை 33°C வரை இருக்கலாம்.', level:'Low', location:'Salem', time:'Today', hazard:'Heat' },
];
export const mockReports: CommunityReport[] = [
  { id:'r1', text:'This road is flooded near Salem market', lat:11.664, lon:78.146, time:'10 min ago', status:'Verified', user:'Arun K.' },
  { id:'r2', text:'Heavy waterlogging near bus stand', lat:11.67, lon:78.14, time:'25 min ago', status:'Corroborated', user:'Priya S.' },
  { id:'r3', text:'Tree fallen due to wind', lat:11.65, lon:78.15, time:'1 hr ago', status:'Under Review', user:'Kumar R.' },
  { id:'r4', text:'Drain overflow in my street', lat:11.66, lon:78.13, time:'2 hr ago', status:'Unverified', user:'Meena T.' },
];
export const locations = [
  { id:'salem', name:'Salem', district:'Salem', state:'TN', country:'India', lat:11.6643, lon:78.146 },
  { id:'chennai', name:'Chennai', district:'Chennai', state:'TN', country:'India', lat:13.0827, lon:80.2707 },
  { id:'coimbatore', name:'Coimbatore', district:'Coimbatore', state:'TN', country:'India', lat:11.0168, lon:76.9558 },
  { id:'madurai', name:'Madurai', district:'Madurai', state:'TN', country:'India', lat:9.9252, lon:78.1198 },
  { id:'mumbai', name:'Mumbai', district:'Mumbai', state:'Maharashtra', country:'India', lat:19.076, lon:72.8777 },
  { id:'delhi', name:'New Delhi', district:'New Delhi', state:'Delhi', country:'India', lat:28.6139, lon:77.209 },
];
export const occupationAdvice = (occupation:string, weather:WeatherCurrent) => {
  const rain = weather.rainProb;
  const adv:Record<string,string> = {
    'Farmer': rain>80? 'Heavy rainfall is expected. Consider postponing irrigation and protecting harvested crops.': rain>50? 'Moderate rain likely. Plan farm work earlier in the day.':'Favorable conditions for field work.',
    'Fisherman': weather.windSpeed>20||rain>70? 'Weather conditions may become unsafe. Check marine warnings before going to sea.':'Sea conditions are moderate. Follow standard safety precautions.',
    'Traveler': rain>70? 'Heavy rainfall may affect travel conditions. Consider delaying non-essential travel.':'Travel conditions are generally favorable.',
    'Business Owner': rain>70? 'Prepare for reduced footfall and potential waterlogging. Secure outdoor inventory.':'Normal business operations expected.',
    'Aviation': weather.visibility<5||rain>80? 'Poor visibility and heavy rain may affect flights. Check NOTAMs.':'Flight conditions nominal.',
    'Marine': rain>70?'Rough sea expected. Avoid open waters.':'Sea moderate. Routine operations possible.',
    'Urban/City': rain>75?'Urban flooding risk in low areas. Avoid waterlogged routes.':'No major urban disruption expected.',
    'Researcher': `Observed: ${rain}% rain prob, ${weather.temp}°C. ${weather.confidence} confidence. Verify with IMD.`,
    'Disaster Management': rain>80?'High risk — pre-position resources, monitor flood gauges.':'Monitor situation, maintain readiness.',
    'General Public': rain>70?'Carry umbrella, avoid unnecessary outdoor activity during peak rain.':'Pleasant day ahead.',
    'Other': rain>70?'Stay prepared for rain.':'Weather looks favorable.'
  };
  return adv[occupation] || adv['General Public'];
};
