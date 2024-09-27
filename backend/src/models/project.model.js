import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim:true
  },
  description: {
    type: String,
    required: true,
    trim:true
  },
  projectLink: {
    type: String,
  },
  githubLink: {
    type: String,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  estimatedEndDate: {
    type: Date,
    required: true,
  },
  actualEndDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "completed","cancelled", "on hold", "in review"],
    default: "active",
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
},{
  timestamps: true,
});

projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: "group",
    select: "name",
  }).populate({
    path: "createdBy",
    select: "username",
  })
  .populate(
    {
      path:"group"
      ,populate:{
        path:"members"
        ,select:"username profilePicture emal"
      }
    }
  )
  .populate({
    path: "tasks",
    select: "title",
  });
  next();
}); 


export const Project = mongoose.model('Project', projectSchema);