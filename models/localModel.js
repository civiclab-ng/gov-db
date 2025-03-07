import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// LOCAL LEVEL SCHEMA
const localOfficialSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  desc: {
    type: String,
    default: ''
  },
  tenure: {
    type: Date,
    required: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true,
    index: true
  },
  lga: {
    type: String,
    required: true
  },
  councilPosition: {
    type: String,
    enum: ['chairman', 'vice-chairman', 'councilor'],
    required: true
  }
}, {
  timestamps: true
});

const LocalOfficial = mongoose.model('LocalOfficial', localOfficialSchema);

export { LocalOfficial };
