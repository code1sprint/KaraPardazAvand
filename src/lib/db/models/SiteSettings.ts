import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocalizedString {
  fa: string;
  en?: string;
}

export interface ISiteSettings extends Document {
  hero: {
    pill: ILocalizedString;
    titleBefore: ILocalizedString;
    titleGradient: ILocalizedString;
    titleAfter: ILocalizedString;
    lead: ILocalizedString;
    ctaPrimary: {
      label: ILocalizedString;
      href: string;
    };
    ctaSecondary: {
      label: ILocalizedString;
      href: string;
    };
    techMarquee: string[];
  };
  whyStatements: Array<{
    id: string;
    title: ILocalizedString;
    body: ILocalizedString;
  }>;
  stats: Array<{
    id: string;
    value?: string;
    label: ILocalizedString;
    source?: string;
  }>;
  contact: {
    phone?: string;
    email?: string;
    address?: ILocalizedString;
    workingHours?: ILocalizedString;
    socials: {
      linkedin?: string;
      github?: string;
      telegram?: string;
      instagram?: string;
    };
  };
  seo: {
    siteName: ILocalizedString;
    homeTitle: ILocalizedString;
    homeDescription: ILocalizedString;
    ogImageAlt: ILocalizedString;
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

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    hero: {
      pill: { type: LocalizedStringSchema, required: true },
      titleBefore: { type: LocalizedStringSchema, required: true },
      titleGradient: { type: LocalizedStringSchema, required: true },
      titleAfter: { type: LocalizedStringSchema, required: true },
      lead: { type: LocalizedStringSchema, required: true },
      ctaPrimary: {
        label: { type: LocalizedStringSchema, required: true },
        href: { type: String, required: true },
      },
      ctaSecondary: {
        label: { type: LocalizedStringSchema, required: true },
        href: { type: String, required: true },
      },
      techMarquee: { type: [String], default: [] },
    },
    whyStatements: [
      {
        id: { type: String, required: true },
        title: { type: LocalizedStringSchema, required: true },
        body: { type: LocalizedStringSchema, required: true },
      },
    ],
    stats: [
      {
        id: { type: String, required: true },
        value: { type: String, default: "" },
        label: { type: LocalizedStringSchema, required: true },
        source: { type: String, default: "" },
      },
    ],
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: LocalizedStringSchema },
      workingHours: { type: LocalizedStringSchema },
      socials: {
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        telegram: { type: String, default: "" },
        instagram: { type: String, default: "" },
      },
    },
    seo: {
      siteName: { type: LocalizedStringSchema, required: true },
      homeTitle: { type: LocalizedStringSchema, required: true },
      homeDescription: { type: LocalizedStringSchema, required: true },
      ogImageAlt: { type: LocalizedStringSchema, required: true },
    },
  },
  {
    timestamps: true,
    collection: "site_settings",
  },
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export async function getSiteSettingsModel(): Promise<Model<ISiteSettings>> {
  if (mongoose.models.SiteSettings) {
    return mongoose.models.SiteSettings as Model<ISiteSettings>;
  }
  return SiteSettings;
}

export default SiteSettings;
