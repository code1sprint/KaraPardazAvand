import mongoose, { Schema, Document, Model } from "mongoose";
import type {
  TicketPriorityType,
  TicketStatusType,
  TicketSenderRoleType,
} from "../validations/ticket";

export interface ITicketAttachment {
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
}

export interface ITicketMessage {
  _id?: mongoose.Types.ObjectId;
  senderRole: TicketSenderRoleType;
  senderId: string;
  senderName: string;
  message: string;
  attachments?: ITicketAttachment[];
  createdAt: Date;
}

export interface ITicketRequester {
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  organization?: string;
}

export interface ISupportTicket extends Document {
  ticketNumber: string;
  projectId: string;
  requester: ITicketRequester;
  department: string;
  subject: string;
  priority: TicketPriorityType;
  status: TicketStatusType;
  messages: ITicketMessage[];
  lastMessageAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketAttachmentSchema = new Schema<ITicketAttachment>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number },
    mimeType: { type: String },
  },
  { _id: false },
);

const TicketMessageSchema = new Schema<ITicketMessage>(
  {
    senderRole: {
      type: String,
      enum: ["CLIENT_USER", "SUPPORT_AGENT"],
      required: true,
    },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    attachments: { type: [TicketAttachmentSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const TicketRequesterSchema = new Schema<ITicketRequester>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    organization: { type: String, default: "" },
  },
  { _id: false },
);

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    projectId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    requester: {
      type: TicketRequesterSchema,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      index: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "ANSWERED", "RESOLVED", "CLOSED"],
      default: "OPEN",
      index: true,
    },
    messages: {
      type: [TicketMessageSchema],
      default: [],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for fast multi-tenant queries
SupportTicketSchema.index({ projectId: 1, "requester.userId": 1, status: 1 });
SupportTicketSchema.index({ projectId: 1, status: 1, lastMessageAt: -1 });
SupportTicketSchema.index({ projectId: 1, "requester.organization": 1 });

export const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);
