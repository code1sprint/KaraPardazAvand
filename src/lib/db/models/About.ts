import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocalizedString {
  fa: string;
  en?: string;
}

export interface IAboutPrinciple {
  id: string;
  title: ILocalizedString;
  body: ILocalizedString;
}

export interface IAboutBrandNode {
  id: "code1sprint" | "kara";
  name: ILocalizedString;
  focus: ILocalizedString;
}

export interface IAboutTeamMember {
  id: string;
  name: ILocalizedString;
  role: ILocalizedString;
  photo?: string | null;
}

export interface IAboutCultureItem {
  id: string;
  title: ILocalizedString;
  body: ILocalizedString;
  needs_business_confirmation?: boolean;
}

export interface IAbout extends Document {
  intro: {
    title: ILocalizedString;
    lead: ILocalizedString;
  };
  story: {
    title: ILocalizedString;
    tiptapBody?: {
      fa?: { html: string; json?: Record<string, unknown> | null };
      en?: { html: string; json?: Record<string, unknown> | null };
    };
  };
  principles: IAboutPrinciple[];
  brandNodes: IAboutBrandNode[];
  team: IAboutTeamMember[];
  culture: IAboutCultureItem[];
  updatedAt: Date;
}

const LocalizedStringSchema = new Schema(
  {
    fa: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false },
);

const AboutPrincipleSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: LocalizedStringSchema, required: true },
    body: { type: LocalizedStringSchema, required: true },
  },
  { _id: false },
);

const AboutBrandNodeSchema = new Schema(
  {
    id: { type: String, enum: ["code1sprint", "kara"], required: true },
    name: { type: LocalizedStringSchema, required: true },
    focus: { type: LocalizedStringSchema, required: true },
  },
  { _id: false },
);

const AboutTeamMemberSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: LocalizedStringSchema, required: true },
    role: { type: LocalizedStringSchema, required: true },
    photo: { type: String, default: null },
  },
  { _id: false },
);

const AboutCultureItemSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: LocalizedStringSchema, required: true },
    body: { type: LocalizedStringSchema, required: true },
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

const AboutSchema = new Schema<IAbout>(
  {
    intro: {
      title: { type: LocalizedStringSchema, required: true },
      lead: { type: LocalizedStringSchema, required: true },
    },
    story: {
      title: { type: LocalizedStringSchema, required: true },
      tiptapBody: {
        fa: { type: TiptapBodyLocaleSchema, default: () => ({ html: "", json: null }) },
        en: { type: TiptapBodyLocaleSchema, default: () => ({ html: "", json: null }) },
      },
    },
    principles: { type: [AboutPrincipleSchema], default: [] },
    brandNodes: { type: [AboutBrandNodeSchema], default: [] },
    team: { type: [AboutTeamMemberSchema], default: [] },
    culture: { type: [AboutCultureItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "about",
  },
);

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export async function getAboutModel(): Promise<Model<IAbout>> {
  if (mongoose.models.About) {
    return mongoose.models.About as Model<IAbout>;
  }
  return About;
}

export default About;

