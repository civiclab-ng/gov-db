import mongoose from "mongoose";
const Schema = mongoose.Schema;

const partySchema = new Schema({
  name: String,
    party :{
      type: String,
      index: true,
      unique: true,
      enum:['PDP', 'APC', 'LP']
    }
})

const Party = mongoose.model('Party', partySchema);

export default Party;
