import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITocItem {
  id: string;
  title: string;
  depth: number;
}

export interface IPost extends Document {
  slug: string;
  locale: "fa" | "en";
  title: string;
  summary: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  cover?: string;
  status: "published" | "draft";
  readingTime: number;
  publishedAt: Date;
  toc: ITocItem[];
  contentJson: Record<string, unknown>;
  contentHtml: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PostModel = Model<IPost>;

const TocSchema = new Schema<ITocItem>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    depth: { type: Number, required: true, default: 2 },
  },
  { _id: false },
);

const AuthorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
  },
  { _id: false },
);

const PostSchema = new Schema<IPost, PostModel>(
  {
    slug: {
      type: String,
      required: [true, "اسلاگ الزامی است"],
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "فرمت اسلاگ نامعتبر است"],
    },
    locale: {
      type: String,
      enum: ["fa", "en"],
      required: true,
      default: "fa",
    },
    title: {
      type: String,
      required: [true, "عنوان الزامی است"],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "خلاصه الزامی است"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: AuthorSchema,
      required: true,
    },
    cover: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    toc: {
      type: [TocSchema],
      default: [],
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

// Compound unique index for multilingual slugs
PostSchema.index({ slug: 1, locale: 1 }, { unique: true });
// Fast queries for public blog listing
PostSchema.index({ locale: 1, status: 1, publishedAt: -1 });

export async function getPostModel(): Promise<PostModel> {
  return (
    (mongoose.models.Post as PostModel) ||
    mongoose.model<IPost, PostModel>("Post", PostSchema)
  );
}
