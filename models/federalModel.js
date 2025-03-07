import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// FEDERAL LEVEL SCHEMAS

// Schema for Federal Executive Officials
const federalExecutiveSchema = new Schema({
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
    enum: ['President', 'Vice President', 'Minister', 'Minister of State', 'Special Adviser'],
    required: true,
    index: true
  },
  ministry: {
    type: String,
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
  }]
}, { timestamps: true });

const FederalExecutiveOfficial = mongoose.model('FederalExecutiveOfficial', federalExecutiveSchema);

// Schema for Federal Legislative Officials (Senate and House of Representatives)
const federalLegislativeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  chamber: {
    type: String,
    enum: ['Senate', 'House of Representatives'],
    required: true,
    index: true
  },
  constituency: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  state: {
    type: String,
    required: true,
    trim: true,
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
  position: {
    type: String,
    enum: ['Member', 'Senate President', 'Deputy Senate President', 'Speaker', 'Deputy Speaker', 
           'Majority Leader', 'Minority Leader', 'Chief Whip', 'Deputy Chief Whip'],
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
  }]
}, { timestamps: true });

const FederalLegislativeOfficial = mongoose.model('FederalLegislativeOfficial', federalLegislativeSchema);

// Schema for Federal Judiciary Officials
const federalJudicialSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    enum: ['Chief Justice', 'Justice of Supreme Court', 'President of Court of Appeal', 
           'Justice of Court of Appeal', 'Chief Judge of Federal High Court', 'Judge of Federal High Court'],
    required: true,
    index: true
  },
  court: {
    type: String,
    enum: ['Supreme Court', 'Court of Appeal', 'Federal High Court'],
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
}, { timestamps: true });

const FederalJudicialOfficial = mongoose.model('FederalJudicialOfficial', federalJudicialSchema);

// Federal Government Schema
const federalGovernmentSchema = new Schema({
  term: {
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date,
      index: true
    },
    number: {
      type: Number,
      required: true
    }
  },
  president: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FederalExecutiveOfficial',
    required: true
  },
  vicePresident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FederalExecutiveOfficial'
  },
  executiveCouncil: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FederalExecutiveOfficial'
  }],
  senate: {
    president: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalLegislativeOfficial'
    },
    deputyPresident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalLegislativeOfficial'
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalLegislativeOfficial'
    }]
  },
  houseOfReps: {
    speaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalLegislativeOfficial'
    },
    deputySpeaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalLegislativeOfficial'
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalLegislativeOfficial'
    }]
  },
  supremeCourt: {
    chiefJustice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalJudicialOfficial'
    },
    justices: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalJudicialOfficial'
    }]
  },
  courtOfAppeal: {
    president: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalJudicialOfficial'
    },
    justices: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalJudicialOfficial'
    }]
  },
  federalHighCourt: {
    chiefJudge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalJudicialOfficial'
    },
    judges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FederalJudicialOfficial'
    }]
  }
}, { timestamps: true });

const FederalGovernment = mongoose.model('FederalGovernment', federalGovernmentSchema);

export { 
  FederalExecutiveOfficial, 
  FederalLegislativeOfficial, 
  FederalJudicialOfficial,
  FederalGovernment
};
