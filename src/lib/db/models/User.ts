import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "editor";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "نام کاربر الزامی است"],
      trim: true,
      maxlength: [100, "نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد"],
    },
    email: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "فرمت ایمیل وارد شده معتبر نمی‌باشد",
      ],
    },
    password: {
      type: String,
      required: [true, "کلمه عبور الزامی است"],
      minlength: [8, "کلمه عبور باید حداقل ۸ کاراکتر باشد"],
      select: false, // Never return password hash in regular queries
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "editor"],
        message: "نقش کاربر باید admin یا editor باشد",
      },
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving if modified
UserSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent recompilation in Next.js HMR
export const User: UserModel =
  (mongoose.models?.User as UserModel) ||
  mongoose.model<IUser, UserModel>("User", UserSchema);
