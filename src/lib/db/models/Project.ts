import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectResult {
  label: string;
  value: string;
  source?: string;
}

export interface IProjectGalleryItem {
  src: string;
  caption: string;
  alt?: string;
}

export interface IProjectSystemMap {
  windowTitle?: string;
  layout?: "hub" | "funnel" | "modules" | "pipeline" | "etl" | "stack";
  descriptionLead: string;
  description: string;
  nodes: {
    inputTop: string;
    inputBottom: string;
    core: string;
    outputTop: string;
    outputBottom: string;
  };
  logs: [string, string, string];
}

export interface IProject extends Document {
  slug: string;
  title: string;
  sector: string;
  year: string;
  services: string[];
  role: string;
  problem: string;
  solution: string;
  results: IProjectResult[];
  stack: string[];
  cover: string;
  gallery: IProjectGalleryItem[];
  systemMap: IProjectSystemMap;
  featured: boolean;
  status: "published" | "draft";
  contentJson?: Record<string, unknown>;
  contentHtml?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectModel = Model<IProject>;

const ProjectResultSchema = new Schema<IProjectResult>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    source: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const ProjectGalleryItemSchema = new Schema<IProjectGalleryItem>(
  {
    src: { type: String, required: true, trim: true },
    caption: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const ProjectSystemMapSchema = new Schema<IProjectSystemMap>(
  {
    windowTitle: { type: String, default: "kara://project" },
    layout: {
      type: String,
      enum: ["hub", "funnel", "modules", "pipeline", "etl", "stack"],
      default: "hub",
    },
    descriptionLead: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    nodes: {
      inputTop: { type: String, required: true, trim: true },
      inputBottom: { type: String, required: true, trim: true },
      core: { type: String, required: true, trim: true },
      outputTop: { type: String, required: true, trim: true },
      outputBottom: { type: String, required: true, trim: true },
    },
    logs: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length === 3, "logs must have exactly 3 entries"],
    },
  },
  { _id: false },
);

const ProjectSchema = new Schema<IProject, ProjectModel>(
  {
    slug: {
      type: String,
      required: [true, "اسلاگ الزامی است"],
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "فرمت اسلاگ نامعتبر است"],
    },
    title: {
      type: String,
      required: [true, "عنوان پروژه الزامی است"],
      trim: true,
    },
    sector: {
      type: String,
      required: [true, "حوزه صنعت الزامی است"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "سال اجرا الزامی است"],
      trim: true,
      default: "1403",
    },
    services: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      required: [true, "نقش شرکت در پروژه الزامی است"],
      trim: true,
    },
    problem: {
      type: String,
      required: [true, "طرح مسئله الزامی است"],
      trim: true,
    },
    solution: {
      type: String,
      required: [true, "راه‌حل ارائه‌شده الزامی است"],
      trim: true,
    },
    results: {
      type: [ProjectResultSchema],
      default: [],
    },
    stack: {
      type: [String],
      default: [],
    },
    cover: {
      type: String,
      required: true,
      default: "/projects/ops-crm-cover.svg",
    },
    gallery: {
      type: [ProjectGalleryItemSchema],
      default: [],
    },
    systemMap: {
      type: ProjectSystemMapSchema,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    contentJson: {
      type: Schema.Types.Mixed,
      default: { type: "doc", content: [] },
    },
    contentHtml: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ status: 1, sector: 1 });
ProjectSchema.index({ featured: 1 });

export async function getProjectModel(): Promise<ProjectModel> {
  return (
    (mongoose.models.Project as ProjectModel) ||
    mongoose.model<IProject, ProjectModel>("Project", ProjectSchema)
  );
}
