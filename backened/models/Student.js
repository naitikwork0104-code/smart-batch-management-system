import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone: {
      type: String
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },

    semester: {
      type: Number
    },

    attendance: {
      type: Number,
      min: 0,
      max: 100
    },

    remarks: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;