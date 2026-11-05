import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectDepartment {
  id: string;
  nameFa: string;
  nameEn?: string;
}

export interface ISupportedProject extends Document {
  projectId: string;
  name: string;
  apiKeyHash: string;
  departments: IProjectDepartment[];
  isActive: boolean;
  webhookUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectDepartmentSchema = new Schema<IProjectDepartment>(
  {
    id: { type: String, required: true, trim: true },
    nameFa: { type: String, required: true, trim: true },
    nameEn: { type: String, trim: true },
  },
  { _id: false },
);

const SupportedProjectSchema = new Schema<ISupportedProject>(
  {
    projectId: {
      type: String,
      required: [true, "شناسه پروژه الزامی است"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "نام پروژه الزامی است"],
      trim: true,
    },
    apiKeyHash: {
      type: String,
      required: [true, "هش کلید دسترسی پروژه الزامی است"],
    },
    departments: {
      type: [ProjectDepartmentSchema],
      default: [
        { id: "technical", nameFa: "پشتیبانی فنی و سامانه" },
        { id: "general", nameFa: "عمومی و راهنمایی" },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    webhookUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SupportedProject: Model<ISupportedProject> =
  mongoose.models.SupportedProject ||
  mongoose.model<ISupportedProject>("SupportedProject", SupportedProjectSchema);
