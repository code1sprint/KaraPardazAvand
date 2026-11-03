import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocalizedString {
  fa: string;
  en: string;
}

export interface IServiceDeliverable {
  title: ILocalizedString;
  description: ILocalizedString;
}

export interface IServiceStep {
  title: ILocalizedString;
  description: ILocalizedString;
}

export interface IServiceStackGroup {
  label: ILocalizedString;
  items: string[];
}

export interface IServiceFaq {
  id: string;
  question: ILocalizedString;
  answer: ILocalizedString;
}

export interface IServiceSystemMap {
  windowTitle?: string;
  layout?: "hub" | "funnel" | "modules" | "pipeline" | "etl" | "stack";
  descriptionLead: ILocalizedString;
  description: ILocalizedString;
  nodes: {
    inputTop: ILocalizedString;
    inputBottom: ILocalizedString;
    core: ILocalizedString;
    outputTop: ILocalizedString;
    outputBottom: ILocalizedString;
  };
  logs: [ILocalizedString, ILocalizedString, ILocalizedString];
}

export interface IServiceBento {
  order: number;
  span: 2 | 4 | 6;
  image: string;
  shortTitle: ILocalizedString;
}

export interface IService extends Document {
  slug: string;
  title: ILocalizedString;
  outcome: ILocalizedString;
  audience: ILocalizedString[];
  deliverables: IServiceDeliverable[];
  steps: IServiceStep[];
  stack: IServiceStackGroup[];
  systemMap: IServiceSystemMap;
  faqs: IServiceFaq[];
  relatedProjects: string[];
  bento: IServiceBento;
  deepDiveJson?: Record<string, unknown>;
  deepDiveHtml?: string;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceModel = Model<IService>;

const LocalizedStringSchema = new Schema<ILocalizedString>(
  {
    fa: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const DeliverableSchema = new Schema<IServiceDeliverable>(
  {
    title: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedStringSchema, required: true },
  },
  { _id: false },
);

const StepSchema = new Schema<IServiceStep>(
  {
    title: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedStringSchema, required: true },
  },
  { _id: false },
);

const StackGroupSchema = new Schema<IServiceStackGroup>(
  {
    label: { type: LocalizedStringSchema, required: true },
    items: { type: [String], required: true },
  },
  { _id: false },
);

const FaqSchema = new Schema<IServiceFaq>(
  {
    id: { type: String, required: true },
    question: { type: LocalizedStringSchema, required: true },
    answer: { type: LocalizedStringSchema, required: true },
  },
  { _id: false },
);

const SystemMapSchema = new Schema<IServiceSystemMap>(
  {
    windowTitle: { type: String, default: "karapardaz-system" },
    layout: {
      type: String,
      enum: ["hub", "funnel", "modules", "pipeline", "etl", "stack"],
      default: "hub",
    },
    descriptionLead: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedStringSchema, required: true },
    nodes: {
      inputTop: { type: LocalizedStringSchema, required: true },
      inputBottom: { type: LocalizedStringSchema, required: true },
      core: { type: LocalizedStringSchema, required: true },
      outputTop: { type: LocalizedStringSchema, required: true },
      outputBottom: { type: LocalizedStringSchema, required: true },
    },
    logs: {
      type: [LocalizedStringSchema],
      required: true,
      validate: [(val: ILocalizedString[]) => val.length === 3, "logs must have exactly 3 entries"],
    },
  },
  { _id: false },
);

const BentoSchema = new Schema<IServiceBento>(
  {
    order: { type: Number, required: true, default: 0 },
    span: { type: Number, required: true, enum: [2, 4, 6], default: 4 },
    image: { type: String, required: true, default: "/brand/bento/crm.svg" },
    shortTitle: { type: LocalizedStringSchema, required: true },
  },
  { _id: false },
);

const ServiceSchema = new Schema<IService, ServiceModel>(
  {
    slug: {
      type: String,
      required: [true, "اسلاگ الزامی است"],
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "فرمت اسلاگ نامعتبر است"],
    },
    title: {
      type: LocalizedStringSchema,
      required: true,
    },
    outcome: {
      type: LocalizedStringSchema,
      required: true,
    },
    audience: {
      type: [LocalizedStringSchema],
      default: [],
    },
    deliverables: {
      type: [DeliverableSchema],
      default: [],
    },
    steps: {
      type: [StepSchema],
      default: [],
    },
    stack: {
      type: [StackGroupSchema],
      default: [],
    },
    systemMap: {
      type: SystemMapSchema,
      required: true,
    },
    faqs: {
      type: [FaqSchema],
      default: [],
    },
    relatedProjects: {
      type: [String],
      default: [],
    },
    bento: {
      type: BentoSchema,
      required: true,
    },
    deepDiveJson: {
      type: Schema.Types.Mixed,
      default: { type: "doc", content: [] },
    },
    deepDiveHtml: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ status: 1, "bento.order": 1 });

export async function getServiceModel(): Promise<ServiceModel> {
  return (
    (mongoose.models.Service as ServiceModel) ||
    mongoose.model<IService, ServiceModel>("Service", ServiceSchema)
  );
}
