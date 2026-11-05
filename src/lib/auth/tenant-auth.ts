import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { SupportedProject, ISupportedProject } from "@/lib/db/models/SupportedProject";

export interface TenantHeaderVerificationResult {
  error: { status: number; message: string } | null;
  projectId?: string;
  projectKey?: string;
}

export function verifyTenantHeaders(request: Request): TenantHeaderVerificationResult {
  const projectId = request.headers.get("x-project-id")?.trim().toLowerCase();
  const projectKey = request.headers.get("x-project-key")?.trim();

  if (!projectId || !projectKey) {
    return {
      error: {
        status: 401,
        message: "سربرگ‌های احراز هویت پروژه (x-project-id و x-project-key) الزامی هستند.",
      },
    };
  }

  return {
    error: null,
    projectId,
    projectKey,
  };
}

export type TenantAuthResult =
  | { project: ISupportedProject; errorResponse?: never }
  | { errorResponse: NextResponse; project?: never };

export async function verifyTenantRequest(
  request: Request,
): Promise<TenantAuthResult> {
  const headerCheck = verifyTenantHeaders(request);
  if (headerCheck.error) {
    return {
      errorResponse: NextResponse.json(
        { ok: false, message: headerCheck.error.message },
        { status: headerCheck.error.status },
      ),
    };
  }

  try {
    await connectToDatabase();

    const project = await SupportedProject.findOne({
      projectId: headerCheck.projectId,
      isActive: true,
    });

    if (!project) {
      return {
        errorResponse: NextResponse.json(
          { ok: false, message: "پروژه یافت نشد یا غیرفعال است." },
          { status: 401 },
        ),
      };
    }

    const isMatch = await bcrypt.compare(
      headerCheck.projectKey!,
      project.apiKeyHash,
    );

    if (!isMatch) {
      return {
        errorResponse: NextResponse.json(
          { ok: false, message: "کلید دسترسی پروژه نامعتبر است." },
          { status: 401 },
        ),
      };
    }

    return { project };
  } catch (error) {
    console.error("[TENANT_AUTH_ERROR]", error);
    return {
      errorResponse: NextResponse.json(
        { ok: false, message: "خطای سرور در اعتبارسنجی پروژه." },
        { status: 500 },
      ),
    };
  }
}
