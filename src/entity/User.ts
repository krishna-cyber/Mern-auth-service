import mongoose, { Document } from "mongoose";
import { UserData } from "../types/types";
import { ROLES } from "../constants/constants";
import bcrypt from "bcryptjs";
// Define the User document and the User model
interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  tenantId?: mongoose.Schema.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      default: ROLES.CUSTOMER,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },
  },
  { timestamps: true }
);

// hash password before saving to the database
userSchema.pre("save", function (next) {
  const user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  const saltRounds = 5;

  // hash the password using our new salt
  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    if (err) return next(err);
    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

//define function for password comparision
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;
  return await bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export { User, UserDocument };
