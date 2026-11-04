import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocalizedString {
  fa: string;
  en?: string;
}

export interface ILegalDoc extends Document {
  slug: string;
  title: ILocalizedString;
  summary?: ILocalizedString;
  updatedIso?: string;
  tiptapBody?: {
    fa?: { html: string; json?: Record<string, unknown> | null };
    en?: { html: string; json?: Record<string, unknown> | null };
  };
  status: "published" | "draft";
  updatedAt: Date;
  createdAt: Date;
}

const LocalizedStringSchema = new Schema(
  {
    fa: { type: String, required: true },
    en: { type: String, default: "" },
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

const LegalDocSchema = new Schema<ILegalDoc>(
  {
    slug: { type: String, required: true, index: true },
    title: { type: LocalizedStringSchema, required: true },
    summary: { type: LocalizedStringSchema },
    updatedIso: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    tiptapBody: {
      fa: {
        type: TiptapBodyLocaleSchema,
        default: () => ({ html: "", json: null }),
      },
      en: {
        type: TiptapBodyLocaleSchema,
        default: () => ({ html: "", json: null }),
      },
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  {
    timestamps: true,
    collection: "legal_docs",
  },
);

const LegalDoc: Model<ILegalDoc> =
  mongoose.models.LegalDoc ||
  mongoose.model<ILegalDoc>("LegalDoc", LegalDocSchema);

export async function getLegalDocModel(): Promise<Model<ILegalDoc>> {
  if (mongoose.models.LegalDoc) {
    return mongoose.models.LegalDoc as Model<ILegalDoc>;
  }
  return LegalDoc;
}

export default LegalDoc;
