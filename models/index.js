// Main index.js file to import and re-export all models
import { LocalOfficial } from './localModel.js';
import { ExecutiveOfficial, LegislativeOfficial, JudicialOfficial, State } from './stateModel.js';
import { FederalExecutiveOfficial, FederalLegislativeOfficial, FederalJudicialOfficial, FederalGovernment } from './federalModel.js';
import { Official } from './officialModel.js';

export { 
  // Individual officials
  LocalOfficial,
  ExecutiveOfficial, 
  LegislativeOfficial, 
  JudicialOfficial,
  FederalExecutiveOfficial, 
  FederalLegislativeOfficial, 
  FederalJudicialOfficial,
  Official,
  
  // Organizational structures
  State,
  FederalGovernment
};
