import mongoose from 'mongoose';
import Local from './local.js';
import State from './state.js';
import Federal from './federal.js';
const Schema = mongoose.Schema;

const officialSchema = new Schema({
  name: {
    type: String,
    index: true
  },
  age: Number,
  currentLocal: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Local' }],
  currentState: [{ type: mongoose.Schema.Types.ObjectId, ref: 'State' }],
  currentFederal: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Federal' }],
  previousLocal: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Local' }],
  previousState: [{ type: mongoose.Schema.Types.ObjectId, ref: 'State' }],
  previousFederal: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Federal' }],
  party: [{type: mongoose.Schema.Types.ObjectId, ref: 'Party'}]
})

const Official = mongoose.model('Official', officialSchema);

export default Official;
