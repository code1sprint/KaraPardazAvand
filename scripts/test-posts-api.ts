import assert from "node:assert";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getPostModel } from "../src/lib/db/models/Post";
import { GET as getPostsList, POST as createPost } from "../src/app/api/admin/posts/route";
import {
  GET as getPostById,
  PUT as updatePostById,
  DELETE as deletePostById,
} from "../src/app/api/admin/posts/[id]/route";
import { signAuthToken } from "../src/lib/auth/jwt";

async function run() {
  console.log("Testing Admin Posts API Endpoints...");
  await connectToDatabase();
  const Post = await getPostModel();

  // Clean test doc if exists
  await Post.deleteMany({ slug: "api-test-post" });

  const adminToken = await signAuthToken({
    sub: "test-admin-id",
    email: "admin@karapardaz.com",
    role: "admin",
    name: "Admin Tester",
  });

  const authHeaders = {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  };

  // 1. Test POST /api/admin/posts
  const newPostData = {
    slug: "api-test-post",
    locale: "fa",
    title: "مقاله آزمایشی برای تست API",
    summary: "این خلاصه مقاله آزمایشی برای سنجش عملکرد روت‌های اختصاصی ادمین است.",
    tags: ["API", "Next.js"],
    author: {
      name: "کارا پرداز",
      role: "معماری نرم‌افزار",
    },
    status: "draft",
    publishedAt: new Date().toISOString(),
    contentHtml: "<h2>سرتیتر اول</h2><p>توضیحات پاراگراف با ارقام 1405</p>",
    contentJson: { type: "doc", content: [] },
  };

  const createReq = new Request("http://localhost:3000/api/admin/posts", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(newPostData),
  });

  const createRes = await createPost(createReq);
  const createJson = await createRes.json();
  assert.strictEqual(createRes.status, 201, `Failed to create post: ${JSON.stringify(createJson)}`);
  assert(createJson.post._id, "Created post must have an _id");
  const postId = createJson.post._id;

  // 2. Test GET /api/admin/posts
  const listReq = new Request("http://localhost:3000/api/admin/posts?locale=fa", {
    method: "GET",
    headers: authHeaders,
  });
  const listRes = await getPostsList(listReq);
  const listJson = await listRes.json();
  assert.strictEqual(listRes.status, 200);
  assert(listJson.posts.some((p: { slug: string }) => p.slug === "api-test-post"), "List must contain created test post");

  // 3. Test GET /api/admin/posts/[id]
  const getReq = new Request(`http://localhost:3000/api/admin/posts/${postId}`, {
    method: "GET",
    headers: authHeaders,
  });
  const getRes = await getPostById(getReq, { params: Promise.resolve({ id: postId }) });
  const getJson = await getRes.json();
  assert.strictEqual(getRes.status, 200);
  assert.strictEqual(getJson.post.slug, "api-test-post");
  assert(getJson.post.toc.length > 0, "TOC should be precomputed in saved post");

  // 4. Test PUT /api/admin/posts/[id]
  const updateReq = new Request(`http://localhost:3000/api/admin/posts/${postId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      ...newPostData,
      title: "عنوان به‌روزرسانی شده",
      status: "published",
    }),
  });
  const updateRes = await updatePostById(updateReq, { params: Promise.resolve({ id: postId }) });
  const updateJson = await updateRes.json();
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateJson.post.title, "عنوان به‌روزرسانی شده");
  assert.strictEqual(updateJson.post.status, "published");

  // 5. Test DELETE /api/admin/posts/[id]
  const deleteReq = new Request(`http://localhost:3000/api/admin/posts/${postId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  const deleteRes = await deletePostById(deleteReq, { params: Promise.resolve({ id: postId }) });
  assert.strictEqual(deleteRes.status, 200);

  // Verify it's gone
  const deletedCheck = await Post.findById(postId);
  assert.strictEqual(deletedCheck, null, "Deleted post should no longer exist in DB");

  console.log("PASS: Admin Posts API Endpoints tests passed!");
  process.exit(0);
}

run().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
