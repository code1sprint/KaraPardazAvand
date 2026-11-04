import mongoose, { Schema, Document, Model } from "mongoose";

export type InquiryStatus = "new" | "reviewed" | "contacted";

export interface IInquiry extends Document {
  name: string;
  email?: string;
  phone?: string;
  service: string;
  stage: string;
  message: string;
  status: InquiryStatus;
  notes?: string;
  consent?: boolean;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, "نام فرستنده پیام الزامی است"],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    service: {
      type: String,
      required: [true, "نوع خدمت مورد نظر الزامی است"],
      trim: true,
    },
    stage: {
      type: String,
      required: [true, "مرحله پروژه الزامی است"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "شرح پروژه الزامی است"],
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "contacted"],
      default: "new",
      index: true,
    },
    notes: {
      type: String,
      default: "",
    },
    consent: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: "website",
    },
  },
  {
    timestamps: true,
  },
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
