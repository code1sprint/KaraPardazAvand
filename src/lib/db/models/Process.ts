import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocalizedString {
  fa: string;
  en?: string;
}

export interface IProcessStep {
  id: string;
  number: number;
  title: ILocalizedString;
  purpose: ILocalizedString;
  deliverables: ILocalizedString[];
  clientInvolvement: ILocalizedString;
  duration?: ILocalizedString | null;
}

export interface IEngagementModel {
  id: string;
  title: ILocalizedString;
  description: ILocalizedString;
  needs_business_confirmation?: boolean;
}

export interface ICommunicationRow {
  id: string;
  label: ILocalizedString;
  value?: ILocalizedString | null;
  needs_business_confirmation?: boolean;
}

export interface IProcess extends Document {
  hero?: {
    titleBefore?: ILocalizedString;
    titleGradient?: ILocalizedString;
    titleAfter?: ILocalizedString;
    lead?: ILocalizedString;
  };
  steps: IProcessStep[];
  engagementModels: IEngagementModel[];
  communicationRows: ICommunicationRow[];
  guide?: {
    title: ILocalizedString;
    tiptapBody?: {
      fa?: { html: string; json?: Record<string, unknown> | null };
      en?: { html: string; json?: Record<string, unknown> | null };
    };
  };
  updatedAt: Date;
}

const LocalizedStringSchema = new Schema(
  {
    fa: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false },
);

const ProcessStepSchema = new Schema(
  {
    id: { type: String, required: true },
    number: { type: Number, required: true },
    title: { type: LocalizedStringSchema, required: true },
    purpose: { type: LocalizedStringSchema, required: true },
    deliverables: { type: [LocalizedStringSchema], default: [] },
    clientInvolvement: { type: LocalizedStringSchema, required: true },
    duration: { type: LocalizedStringSchema, default: null },
  },
  { _id: false },
);

const EngagementModelSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedStringSchema, required: true },
    needs_business_confirmation: { type: Boolean, default: true },
  },
  { _id: false },
);

const CommunicationRowSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: LocalizedStringSchema, required: true },
    value: { type: LocalizedStringSchema, default: null },
    needs_business_confirmation: { type: Boolean, default: true },
  },
  { _id: false },
);

const TiptapBodyLocaleSchema = new Schema(
  {
    html: { type: String, default: "" },
    json: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const ProcessSchema = new Schema<IProcess>(
  {
    hero: {
      titleBefore: { type: LocalizedStringSchema },
      titleGradient: { type: LocalizedStringSchema },
      titleAfter: { type: LocalizedStringSchema },
      lead: { type: LocalizedStringSchema },
    },
    steps: { type: [ProcessStepSchema], default: [] },
    engagementModels: { type: [EngagementModelSchema], default: [] },
    communicationRows: { type: [CommunicationRowSchema], default: [] },
    guide: {
      title: { type: LocalizedStringSchema },
      tiptapBody: {
        fa: { type: TiptapBodyLocaleSchema, default: () => ({ html: "", json: null }) },
        en: { type: TiptapBodyLocaleSchema, default: () => ({ html: "", json: null }) },
      },
    },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "process",
  },
);

const Process: Model<IProcess> =
  mongoose.models.Process || mongoose.model<IProcess>("Process", ProcessSchema);

export async function getProcessModel(): Promise<Model<IProcess>> {
  if (mongoose.models.Process) {
    return mongoose.models.Process as Model<IProcess>;
  }
  return Process;
}

export default Process;
