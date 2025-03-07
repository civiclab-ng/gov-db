import mongoose from 'mongoose';
import { LocalOfficial } from './local.js';
import { ExecutiveOfficial, LegislativeOfficial, JudicialOfficial, State } from './state.js';
import { FederalExecutiveOfficial, FederalLegislativeOfficial, FederalJudicialOfficial } from './federal.js';

const Schema = mongoose.Schema;

// Schema for a politician/official profile
const officialSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  age: {
    type: Number
  },
  dateOfBirth: {
    type: Date
  },
  bio: {
    type: String,
    trim: true
  },
  education: [{
    degree: String,
    institution: String,
    year: Number,
    field: String
  }],
  // Current positions
  currentLocal: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LocalOfficial'
  }],
  currentState: [{ 
    position: {
      type: String,
      enum: ['Governor', 'Deputy Governor', 'Commissioner', 'House Member', 'Judge']
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'currentState.model'
    },
    model: {
      type: String,
      enum: ['Governor', 'ExecutiveOfficial', 'LegislativeOfficial', 'JudicialOfficial']
    },
    startDate: Date
  }],
  currentFederal: [{ 
    position: {
      type: String,
      enum: ['President', 'Vice President', 'Minister', 'Senator', 'Representative', 'Judge']
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'currentFederal.model'
    },
    model: {
      type: String,
      enum: ['FederalExecutiveOfficial', 'FederalLegislativeOfficial', 'FederalJudicialOfficial']
    },
    startDate: Date
  }],
  // Previous positions
  previousLocal: [{ 
    position: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'LocalOfficial'
    },
    startDate: Date,
    endDate: Date
  }],
  previousState: [{ 
    position: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'previousState.model'
    },
    model: {
      type: String,
      enum: ['Governor', 'ExecutiveOfficial', 'LegislativeOfficial', 'JudicialOfficial']
    },
    startDate: Date,
    endDate: Date
  }],
  previousFederal: [{ 
    position: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'previousFederal.model'
    },
    model: {
      type: String,
      enum: ['FederalExecutiveOfficial', 'FederalLegislativeOfficial', 'FederalJudicialOfficial']
    },
    startDate: Date,
    endDate: Date
  }],
  // Political affiliations
  politicalAffiliations: [{
    party: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Party'
    },
    joinDate: Date,
    leaveDate: Date,
    position: String  // position within the party if any
  }],
  currentParty: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Party'
  },
  // Contact information
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    socialMedia: {
      twitter: String,
      facebook: String,
      instagram: String
    }
  },
  photoUrl: String
}, { timestamps: true });

// Add indexes for better query performance
officialSchema.index({ 'politicalAffiliations.party': 1 });
officialSchema.index({ 'currentParty': 1 });
officialSchema.index({ 'currentState.position': 1 });
officialSchema.index({ 'currentFederal.position': 1 });

const Official = mongoose.model('Official', officialSchema);

export { Official };
