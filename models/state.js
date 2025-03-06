import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const stateSchema = new Schema({
  title: {
    type: String,
    index: true
  },
  desc: String,
  tenure: Date,
  state: {
    type: String,
    index: true,
    name: {
      enum: ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
        'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 
        'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 
        'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 
        'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 
        'Taraba', 'Yobe', 'Zamfara', 'Federal Capital Territory']
    }
  },
  branch: {type: String, category: {enum:['executive', 'legislative', 'judiciary']}}
})

const State = mongoose.model('State', stateSchema);

export default State;
