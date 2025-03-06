import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const federalSchema = new Schema({
  title: {
    type: String,
    index: true
  },
  desc: String,
  tenure: Date,
  branch: {
    type: String,
    enum:['executive', 'legislative', 'judiciary']
  }
})

const Federal = mongoose.model('Federal', federalSchema);

export default Federal;
