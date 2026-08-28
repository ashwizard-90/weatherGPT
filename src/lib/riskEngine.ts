// Risk Analysis Engine: computes hazard levels without fabricating unavailable signals
export type HazardInput = { rainIntensity:number; rainDurationH:number; windSpeed:number; visibility:number; temp:number; terrainRisk?:'low'|'medium'|'high'; officialWarning?:string };
export function analyzeRisks(input:HazardInput){
  const risks:{hazard:string;level:'Low'|'Moderate'|'High'|'Critical';reason:string}[]=[];
  const rain = input.rainIntensity;
  if(rain>80) risks.push({hazard:'Heavy Rain', level:'Critical', reason:'Rain prob >80% sustained'});
  else if(rain>60) risks.push({hazard:'Heavy Rain', level:'High', reason:'Rain prob >60%'});
  else if(rain>40) risks.push({hazard:'Heavy Rain', level:'Moderate', reason:'Rain prob >40%'});
  else risks.push({hazard:'Heavy Rain', level:'Low', reason:'Low rain probability'});

  // Flood: requires rain + duration + terrain
  if(rain>70 && input.rainDurationH>3) risks.push({hazard:'Flood', level: input.terrainRisk==='high'?'Critical':'High', reason:'Prolonged heavy rain'});
  else if(rain>60) risks.push({hazard:'Flood', level:'Moderate', reason:'Moderate rain duration'});

  if(input.windSpeed>35) risks.push({hazard:'Strong Wind', level:'Critical', reason:'Wind >35 km/h'});
  else if(input.windSpeed>20) risks.push({hazard:'Strong Wind', level:'Moderate', reason:'Wind >20 km/h'});

  if(input.visibility<2) risks.push({hazard:'Poor Visibility', level:'High', reason:'Visibility <2km'});
  if(input.temp>40) risks.push({hazard:'Heatwave', level:'High', reason:'Temp >40°C'});

  if(input.officialWarning) risks.push({hazard:'Official Warning', level:'Critical', reason:input.officialWarning});

  return risks;
}
