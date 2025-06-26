import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model, Types } = mongoose;

const userSchema=mongoose.Schema({
    UserName:{type:String, required:true},
    UserEmail:{type:String, required:true, unique:true},
    UserPassword:{type:String, required:true},
    UserChannel:{type: Types.ObjectId,ref: 'Channel'},
    UploadedVideo:[{
        type: Types.ObjectId, ref: 'video'
    }]},
    { timestamps: true, collection: 'users' }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("UserPassword")) return next();

  const salt = await bcrypt.genSalt(10);
  this.UserPassword = await bcrypt.hash(this.UserPassword, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.UserPassword);
};

export default model('User', userSchema);