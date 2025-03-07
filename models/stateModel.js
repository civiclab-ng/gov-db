import mongoose from 'mongoose';
import { LocalOfficial } from './local.js';
const Schema = mongoose.Schema;

// STATE LEVEL SCHEMAS

// Schema for Commissioners (Executive Branch)
const executiveSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    enum: ['Commissioner', 'Minister', 'Special Adviser'],
    required: true,
    index: true
  },
  ministry: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  tenureStart: {
    type: Date,
    required: true,
    index: true
  },
  tenureEnd: {
    type: Date,
    index: true
  },
  politicalParty: [{
    name: String,
    joinDate: Date,
    leaveDate: Date
  }],
  previousPositions: [{
    title: String,
    organization: String,
    startDate: Date,
    endDate: Date
  }],
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  state: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'State',
    required: true 
  }
}, { timestamps: true });

const ExecutiveOfficial = mongoose.model('ExecutiveOfficial', executiveSchema);

// Schema for House of Assembly Members (Legislative Branch)
const legislativeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  constituency: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  position: {
    type: String,
    enum: ['Member', 'Speaker', 'Deputy Speaker', 'Majority Leader', 'Minority Leader'],
    required: true,
    index: true
  },
  desc: {
    type: String,
    trim: true
  },
  tenureStart: {
    type: Date,
    required: true,
    index: true
  },
  tenureEnd: {
    type: Date,
    index: true
  },
  politicalParty: [{
    name: String,
    joinDate: Date,
    leaveDate: Date
  }],
  committees: [{
    name: String,
    role: String,
    startDate: Date,
    endDate: Date
  }],
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  state: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'State',
    required: true 
  }
}, { timestamps: true });

const LegislativeOfficial = mongoose.model('LegislativeOfficial', legislativeSchema);

// Schema for Judiciary Officials (Judicial Branch)
const judicialSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    enum: ['Chief Judge', 'Appeal Court Judge', 'High Court Judge', 'Magistrate'],
    required: true,
    index: true
  },
  desc: {
    type: String,
    trim: true
  },
  tenureStart: {
    type: Date,
    required: true,
    index: true
  },
  tenureEnd: {
    type: Date,
    index: true
  },
  court: {
    name: String,
    jurisdiction: String,
    location: String
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  state: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'State',
    required: true 
  }
}, { timestamps: true });

const JudicialOfficial = mongoose.model('JudicialOfficial', judicialSchema);

// State Schema (Ties everything together)
const stateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
    enum: [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
      'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
      'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
      'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
      'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
      'Taraba', 'Yobe', 'Zamfara', 'Federal Capital Territory'
    ]
  },
  capital: {
    type: String,
    trim: true
  },
  governor: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    tenureStart: {
      type: Date,
      required: true
    },
    tenureEnd: Date,
    politicalParty: [{
      name: String,
      joinDate: Date,
      leaveDate: Date
    }],
    education: [{
      degree: String,
      institution: String,
      year: Number
    }],
    previousPositions: [{
      title: String,
      organization: String,
      startDate: Date,
      endDate: Date
    }]
  },
  deputyGovernor: {
    name: {
      type: String,
      trim: true
    },
    tenureStart: Date,
    tenureEnd: Date,
    politicalParty: [{
      name: String,
      joinDate: Date,
      leaveDate: Date
    }]
  },
  executiveOfficials: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ExecutiveOfficial'
  }],
  legislativeOfficials: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LegislativeOfficial' 
  }],
  judicialOfficials: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'JudicialOfficial' 
  }],
  localOfficials: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LocalOfficial' 
  }]
}, { timestamps: true });

const State = mongoose.model('State', stateSchema);

export { 
  ExecutiveOfficial, 
  LegislativeOfficial, 
  JudicialOfficial,
  State
};
