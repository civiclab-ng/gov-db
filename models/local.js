import mongoose from 'mongoose';
import State from './state.js';
const Schema = mongoose.Schema;

const localSchema = new Schema({
  title: {
    type: String,
    index: true
  },
  desc: String,
  tenure: Date,
  state:{
    name: String,
    index: true,
    title: {type: mongoose.Schema.Types.ObjectId, ref: 'State'}
  },
  lga: {
    type: String,
    enum: ['']
  }
})

const Local = mongoose.model('Local', localSchema);

export default Local;
