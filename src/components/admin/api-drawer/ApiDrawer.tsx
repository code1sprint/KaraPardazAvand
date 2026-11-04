"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "@/i18n/navigation";
import {
  API_REGISTRY,
  getResourceConfigFromPath,
  type HttpMethod,
} from "./api-registry";
import { cn } from "@/lib/cn";
import {
  IconClose,
  IconCheck,
  IconCheckCircle,
  IconArrowLeft,
  IconRefresh,
} from "@/components/admin/editor/EditorIcons";

interface ApiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiDrawer({ isOpen, onClose }: ApiDrawerProps) {
  const pathname = usePathname();

  // Active Tab: 'runner' | 'endpoints' | 'curl' | 'keys' | 'live-json'
  const [activeTab, setActiveTab] = useState<
    "runner" | "endpoints" | "curl" | "keys" | "live-json"
  >("runner");

  // Resource detection
  const { config, detectedId, isEditPage } = useMemo(
    () => getResourceConfigFromPath(pathname),
    [pathname],
  );

  // Selected resource dropdown (can switch between services, projects, posts, etc.)
  const [selectedResourceId, setSelectedResourceId] = useState<string>(config.id);
  const [prevConfigId, setPrevConfigId] = useState<string>(config.id);

  if (prevConfigId !== config.id) {
    setPrevConfigId(config.id);
    setSelectedResourceId(config.id);
  }

  const activeResource = API_REGISTRY[selectedResourceId] || config;

  // Selected endpoint in Runner
  const defaultEndpoint = useMemo(() => {
    if (isEditPage && detectedId) {
      const patchEp = activeResource.endpoints.find(
        (e) => (e.method === "PATCH" || e.method === "PUT") && e.path.includes(":"),
      );
      if (patchEp) {
        return {
          method: patchEp.method,
          path: patchEp.path.replace(/:(?:id|slug)/, detectedId),
          def: patchEp,
        };
      }
    }
    const firstEp = activeResource.endpoints[0];
    return {
      method: firstEp?.method || "GET",
      path: firstEp?.path || activeResource.basePath,
      def: firstEp,
    };
  }, [activeResource, isEditPage, detectedId]);

  const [runnerMethod, setRunnerMethod] = useState<HttpMethod>(defaultEndpoint.method);
  const [runnerPath, setRunnerPath] = useState<string>(defaultEndpoint.path);
  const [runnerBody, setRunnerBody] = useState<string>("");
  const [runnerLoading, setRunnerLoading] = useState(false);
  const [runnerResponse, setRunnerResponse] = useState<{
    status: number;
    statusText: string;
    timeMs: number;
    data: unknown;
  } | null>(null);

  // Auth tokens
  const [bearerToken, setBearerToken] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [maskedApiKey, setMaskedApiKey] = useState<string | null>(null);
  const [apiKeyCreatedAt, setApiKeyCreatedAt] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Live JSON data
  const [liveJsonData, setLiveJsonData] = useState<unknown>(null);
  const [liveJsonLoading, setLiveJsonLoading] = useState(false);

  // Update runner when default endpoint changes
  const [prevDefaultEndpoint, setPrevDefaultEndpoint] = useState(defaultEndpoint);
  if (prevDefaultEndpoint !== defaultEndpoint) {
    setPrevDefaultEndpoint(defaultEndpoint);
    setRunnerMethod(defaultEndpoint.method);
    setRunnerPath(defaultEndpoint.path);
    if (defaultEndpoint.def?.sampleBody) {
      setRunnerBody(JSON.stringify(defaultEndpoint.def.sampleBody, null, 2));
    } else {
      setRunnerBody("");
    }
    setRunnerResponse(null);
  }

  // Load Auth Tokens & API Key
  const loadAuthCredentials = useCallback(async () => {
    await Promise.resolve();
    try {
      setLoadingAuth(true);
      // 1. Fetch JWT token
      const tokenRes = await fetch("/api/admin/token");
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        if (tokenData.token) setBearerToken(tokenData.token);
      }

      // 2. Fetch API Key status
      const apiKeyRes = await fetch("/api/admin/api-key");
      if (apiKeyRes.ok) {
        const keyData = await apiKeyRes.json();
        setMaskedApiKey(keyData.maskedKey);
        setApiKeyCreatedAt(keyData.apiKeyCreatedAt);
      }
    } catch (e) {
      console.warn("Failed to fetch API credentials", e);
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  // Load Live JSON for this resource/item
  const loadLiveJson = useCallback(async () => {
    try {
      setLiveJsonLoading(true);
      let targetUrl = activeResource.basePath;
      if (isEditPage && detectedId) {
        targetUrl = `${activeResource.basePath}/${detectedId}`;
      }
      const res = await fetch(targetUrl);
      if (res.ok) {
        const data = await res.json();
        setLiveJsonData(data);
      } else {
        setLiveJsonData({ error: `HTTP ${res.status}: ${res.statusText}` });
      }
    } catch (err: unknown) {
      setLiveJsonData({ error: err instanceof Error ? err.message : "خطا در برقراری ارتباط" });
    } finally {
      setLiveJsonLoading(false);
    }
  }, [activeResource.basePath, isEditPage, detectedId]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      void loadAuthCredentials();
      void loadLiveJson();
    }, 0);
    return () => clearTimeout(timer);
  }, [isOpen, loadAuthCredentials, loadLiveJson]);

  // Generate / Regenerate API Key
  const generateApiKey = async () => {
    try {
      setLoadingAuth(true);
      const res = await fetch("/api/admin/api-key", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.apiKey) {
          setApiKey(data.apiKey);
          setMaskedApiKey(data.apiKey);
          setApiKeyCreatedAt(new Date().toISOString());
        }
      }
    } catch (e) {
      console.error("Failed to generate API Key", e);
    } finally {
      setLoadingAuth(false);
    }
  };

  // Revoke API Key
  const revokeApiKey = async () => {
    if (!confirm("آیا از ابطال کلید API خود اطمینان دارید؟ تمامی اسکریپت‌ها با این کلید متوقف خواهند شد.")) {
      return;
    }
    try {
      setLoadingAuth(true);
      const res = await fetch("/api/admin/api-key", { method: "DELETE" });
      if (res.ok) {
        setApiKey("");
        setMaskedApiKey(null);
        setApiKeyCreatedAt(null);
      }
    } catch (e) {
      console.error("Failed to revoke API key", e);
    } finally {
      setLoadingAuth(false);
    }
  };

  // Execute API in Runner
  const handleExecuteRunner = async () => {
    setRunnerLoading(true);
    setRunnerResponse(null);
    const start = performance.now();

    try {
      const headers: Record<string, string> = {};
      if (bearerToken) {
        headers["Authorization"] = `Bearer ${bearerToken}`;
      }
      if (["POST", "PUT", "PATCH"].includes(runnerMethod)) {
        headers["Content-Type"] = "application/json";
      }

      const options: RequestInit = {
        method: runnerMethod,
        headers,
      };

      if (["POST", "PUT", "PATCH"].includes(runnerMethod) && runnerBody.trim()) {
        options.body = runnerBody;
      }

      const res = await fetch(runnerPath, options);
      const end = performance.now();
      const timeMs = Math.round(end - start);

      let data: unknown;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }

      setRunnerResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs,
        data,
      });

      // If mutation succeeded, notify UI to refresh!
      if (res.ok && ["POST", "PUT", "PATCH", "DELETE"].includes(runnerMethod)) {
        window.dispatchEvent(
          new CustomEvent("kara-content-updated", {
            detail: {
              method: runnerMethod,
              path: runnerPath,
              resource: activeResource.id,
              data,
            },
          }),
        );
      }
    } catch (err: unknown) {
      const end = performance.now();
      setRunnerResponse({
        status: 0,
        statusText: "Connection Error",
        timeMs: Math.round(end - start),
        data: { error: err instanceof Error ? err.message : "خطا در اتصال به سرور" },
      });
    } finally {
      setRunnerLoading(false);
    }
  };

  // Helper copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="کنسول و مدیریت API سامانه"
      className="fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-xs transition-opacity duration-300"
    >
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative flex h-full w-full max-w-2xl md:max-w-3xl lg:max-w-[880px] flex-col border-s border-line bg-panel shadow-2xl transition-transform duration-300">
        {/* Drawer Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-4 bg-panel">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy text-white shadow-xs">
              <span className="font-mono text-sm font-black">&lt;/&gt;</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-black text-text">
                  مدیریت محتوا از طریق API
                </h3>
                <span className="rounded-full bg-blue/10 px-2 py-0.5 font-mono text-[10px] font-bold text-blue">
                  PayloadCMS Parity
                </span>
              </div>
              <p className="truncate text-xs text-muted">
                کنترل، استعلام و ویرایش مستقیم تمامی بخش‌های سایت از طریق REST API
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition hover:bg-bg hover:text-text"
            aria-label="بستن پنجره API"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        {/* Resource Selector & Quick Context */}
        <div className="shrink-0 border-b border-line bg-bg/60 px-6 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted">بخش فعال:</span>
              <select
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                className="rounded-xl border border-line bg-panel px-3 py-1.5 text-xs font-bold text-text outline-none focus:border-blue"
              >
                {Object.values(API_REGISTRY).map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.title} ({res.titleEn})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-md border border-line bg-panel px-2 py-0.5 font-mono text-[11px] text-muted">
                {activeResource.basePath}
              </span>
              {detectedId && (
                <span className="rounded-md bg-orange/10 px-2 py-0.5 font-mono text-[11px] font-bold text-orange">
                  ID: {detectedId}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex shrink-0 border-b border-line bg-panel px-6 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("runner")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 py-3 px-3 transition-colors",
              activeTab === "runner"
                ? "border-blue text-blue"
                : "border-transparent text-muted hover:text-text",
            )}
          >
            <span>کنسول اجرای API</span>
            <span className="rounded-full bg-blue/10 px-1.5 py-0.2 text-[10px] text-blue">
              زنده
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("endpoints")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 py-3 px-3 transition-colors",
              activeTab === "endpoints"
                ? "border-blue text-blue"
                : "border-transparent text-muted hover:text-text",
            )}
          >
            <span>مستندات اندپوینت‌ها</span>
            <span className="rounded-full bg-bg px-1.5 py-0.2 text-[10px] text-muted">
              {activeResource.endpoints.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("curl")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 py-3 px-3 transition-colors",
              activeTab === "curl"
                ? "border-blue text-blue"
                : "border-transparent text-muted hover:text-text",
            )}
          >
            <span>دستورات cURL و کدها</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("keys")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 py-3 px-3 transition-colors",
              activeTab === "keys"
                ? "border-blue text-blue"
                : "border-transparent text-muted hover:text-text",
            )}
          >
            <span>احراز هویت و API Key</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("live-json")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 py-3 px-3 transition-colors",
              activeTab === "live-json"
                ? "border-blue text-blue"
                : "border-transparent text-muted hover:text-text",
            )}
          >
            <span>داده زنده JSON</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: RUNNER (Interactive API Management) */}
          {activeTab === "runner" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-line bg-bg/50 p-4">
                <p className="text-xs text-muted leading-relaxed">
                  با استفاده از این کنسول می‌توانید بدون خروج از پنل، انواع درخواست‌های{" "}
                  <code className="font-bold text-text">GET</code>،{" "}
                  <code className="font-bold text-text">POST</code>،{" "}
                  <code className="font-bold text-text">PATCH</code> یا{" "}
                  <code className="font-bold text-text">DELETE</code> را مستقیماً به سرور ارسال
                  کنید. هر تغییری که از طریق API اعمال شود، بلافاصله رابط کاربری پنل را هم
                  به‌روزرسانی می‌کند.
                </p>
              </div>

              {/* URL & Method Input Bar */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-text">
                  متد و اندپوینت API:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={runnerMethod}
                    onChange={(e) => setRunnerMethod(e.target.value as HttpMethod)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 font-mono text-xs font-black outline-none",
                      runnerMethod === "GET" && "border-blue/30 bg-blue/10 text-blue",
                      runnerMethod === "POST" && "border-ok/30 bg-ok/10 text-ok",
                      (runnerMethod === "PUT" || runnerMethod === "PATCH") &&
                        "border-amber/30 bg-amber/10 text-amber-700",
                      runnerMethod === "DELETE" &&
                        "border-red-500/30 bg-red-500/10 text-red-600",
                    )}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PATCH">PATCH</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>

                  <input
                    type="text"
                    value={runnerPath}
                    onChange={(e) => setRunnerPath(e.target.value)}
                    dir="ltr"
                    className="flex-1 rounded-xl border border-line bg-panel px-3.5 py-2.5 font-mono text-xs text-text outline-none focus:border-blue"
                    placeholder="/api/admin/services"
                  />

                  <button
                    type="button"
                    onClick={handleExecuteRunner}
                    disabled={runnerLoading}
                    className="flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white transition hover:bg-navy-2 disabled:opacity-50 shadow-xs"
                  >
                    {runnerLoading ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>در حال ارسال...</span>
                      </>
                    ) : (
                      <span>ارسال درخواست API</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Preset Endpoint Quick Picker */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted">اندپوینت‌های پیشنهادی:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeResource.endpoints.map((ep, idx) => {
                    const resolvedPath =
                      detectedId && ep.path.includes(":")
                        ? ep.path.replace(/:(?:id|slug)/, detectedId)
                        : ep.path;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setRunnerMethod(ep.method);
                          setRunnerPath(resolvedPath);
                          if (ep.sampleBody) {
                            setRunnerBody(JSON.stringify(ep.sampleBody, null, 2));
                          }
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-line bg-panel px-2.5 py-1 text-[11px] text-text transition hover:border-blue hover:text-blue"
                      >
                        <span
                          className={cn(
                            "font-mono font-bold text-[10px]",
                            ep.method === "GET" && "text-blue",
                            ep.method === "POST" && "text-ok",
                            (ep.method === "PATCH" || ep.method === "PUT") && "text-amber-600",
                            ep.method === "DELETE" && "text-red-500",
                          )}
                        >
                          {ep.method}
                        </span>
                        <span className="truncate max-w-[200px]">{ep.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* JSON Payload Editor (for POST/PUT/PATCH) */}
              {["POST", "PUT", "PATCH"].includes(runnerMethod) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-text">
                      بدنه درخواست (JSON Request Payload):
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            const formatted = JSON.stringify(JSON.parse(runnerBody), null, 2);
                            setRunnerBody(formatted);
                          } catch {
                            // ignore invalid json formatting
                          }
                        }}
                        className="text-[11px] text-blue hover:underline font-bold"
                      >
                        مرتب‌سازی JSON
                      </button>
                      {Boolean(liveJsonData) && (
                        <button
                          type="button"
                          onClick={() => {
                            const item =
                              (liveJsonData as Record<string, unknown>).service ||
                              (liveJsonData as Record<string, unknown>).project ||
                              (liveJsonData as Record<string, unknown>).post ||
                              (liveJsonData as Record<string, unknown>).doc ||
                              (liveJsonData as Record<string, unknown>).settings ||
                              liveJsonData;
                            setRunnerBody(JSON.stringify(item, null, 2));
                          }}
                          className="rounded-md border border-line bg-panel px-2 py-0.5 text-[11px] text-muted hover:text-text"
                        >
                          پر کردن با سند فعلی
                        </button>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={15}
                    value={runnerBody}
                    onChange={(e) => setRunnerBody(e.target.value)}
                    dir="ltr"
                    className="w-full min-h-[320px] resize-y rounded-2xl border border-line bg-win-deep p-4 font-mono text-xs leading-relaxed text-win-text outline-none focus:border-blue shadow-inner"
                    placeholder='{\n  "title": "عنوان جدید",\n  "status": "published"\n}'
                  />
                </div>
              )}

              {/* Response Viewer */}
              {runnerResponse && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">پاسخ سرور (Response):</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 font-bold",
                          runnerResponse.status >= 200 && runnerResponse.status < 300
                            ? "bg-ok/20 text-ok"
                            : "bg-red-500/20 text-red-500",
                        )}
                      >
                        HTTP {runnerResponse.status} {runnerResponse.statusText}
                      </span>
                      <span className="text-muted">{runnerResponse.timeMs}ms</span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(runnerResponse.data, null, 2),
                            "resp-copied",
                          )
                        }
                        className="rounded-md border border-line bg-panel px-2 py-0.5 text-[11px] text-muted hover:text-text"
                      >
                        {copiedKey === "resp-copied" ? (
                          <span className="inline-flex items-center gap-1 text-ok">
                            <IconCheck className="size-3" />
                            <span>کپی شد</span>
                          </span>
                        ) : (
                          "کپی پاسخ"
                        )}
                      </button>
                    </div>
                  </div>

                  <pre
                    dir="ltr"
                    className="max-h-96 overflow-auto rounded-2xl border border-win-line bg-win-bg p-4 font-mono text-xs text-win-text leading-relaxed"
                  >
                    <code>{JSON.stringify(runnerResponse.data, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ENDPOINTS DOCUMENTATION */}
          {activeTab === "endpoints" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-bg/50 p-4">
                <h4 className="text-xs font-bold text-text">
                  مستندات REST API بخش {activeResource.title}
                </h4>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  تمام عملیات CRUD از طریق اندپوینت‌های استاندارد REST در دسترس است. پاسخ‌ها به فرمت{" "}
                  <code className="text-text font-bold">JSON</code> با کدهای استاندارد HTTP برگردانده می‌شوند.
                </p>
              </div>

              <div className="space-y-3">
                {activeResource.endpoints.map((ep, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-line bg-panel p-4 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-lg px-2.5 py-1 font-mono text-xs font-black",
                            ep.method === "GET" && "bg-blue/15 text-blue",
                            ep.method === "POST" && "bg-ok/15 text-ok",
                            (ep.method === "PATCH" || ep.method === "PUT") &&
                              "bg-amber/15 text-amber-700",
                            ep.method === "DELETE" && "bg-red-500/15 text-red-600",
                          )}
                        >
                          {ep.method}
                        </span>
                        <code dir="ltr" className="font-mono text-xs font-bold text-text">
                          {ep.path}
                        </code>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const resolvedPath =
                            detectedId && ep.path.includes(":")
                              ? ep.path.replace(/:(?:id|slug)/, detectedId)
                              : ep.path;
                          setRunnerMethod(ep.method);
                          setRunnerPath(resolvedPath);
                          if (ep.sampleBody) {
                            setRunnerBody(JSON.stringify(ep.sampleBody, null, 2));
                          }
                          setActiveTab("runner");
                        }}
                        className="rounded-xl border border-line px-3 py-1 text-xs font-bold text-blue hover:border-blue transition inline-flex items-center gap-1"
                      >
                        <span>تست در کنسول API</span>
                        <IconArrowLeft className="size-3" />
                      </button>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-text">{ep.title}</h5>
                      <p className="text-xs text-muted mt-0.5">{ep.description}</p>
                    </div>

                    {ep.queryParams && ep.queryParams.length > 0 && (
                      <div className="rounded-xl border border-line bg-bg/40 p-3 text-xs space-y-1.5">
                        <span className="font-bold text-[11px] text-muted">
                          پارامترهای Query:
                        </span>
                        <div className="space-y-1">
                          {ep.queryParams.map((qp, qidx) => (
                            <div key={qidx} className="flex items-baseline gap-2">
                              <code className="font-mono font-bold text-text">{qp.name}</code>
                              <span className="text-[10px] text-muted">({qp.type}):</span>
                              <span className="text-muted">{qp.desc}</span>
                              {qp.sample && (
                                <code className="text-[10px] text-blue ms-auto">
                                  ?{qp.name}={qp.sample}
                                </code>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CURL & SDK SNIPPETS */}
          {activeTab === "curl" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-line bg-bg/50 p-4">
                <p className="text-xs text-muted leading-relaxed">
                  دستورات زیر همراه با هدر احراز هویت توکن کاربری شما تنظیم شده‌اند و بدون نیاز به
                  تنظیمات اضافه، آماده کپی و اجرا در ترمینال، ابزارهای CI/CD، اسکریپت‌های پایتون یا Postman هستند.
                </p>
              </div>

              {/* cURL Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text">
                    دستور cURL (دریافت اطلاعات GET):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const curlCmd = `curl -X GET "${window.location.origin}${activeResource.basePath}" \\\n  -H "Authorization: Bearer ${bearerToken || "<YOUR_TOKEN>"}" \\\n  -H "Content-Type: application/json"`;
                      copyToClipboard(curlCmd, "curl-get");
                    }}
                    className="rounded-lg border border-line px-2.5 py-1 text-xs font-bold text-muted hover:text-text"
                  >
                    {copiedKey === "curl-get" ? (
                      <span className="inline-flex items-center gap-1 text-ok">
                        <IconCheck className="size-3" />
                        <span>کپی شد</span>
                      </span>
                    ) : (
                      "کپی دستور"
                    )}
                  </button>
                </div>
                <pre
                  dir="ltr"
                  className="rounded-2xl border border-win-line bg-win-bg p-4 font-mono text-xs text-win-text overflow-x-auto"
                >
                  <code>
                    {`curl -X GET "${typeof window !== "undefined" ? window.location.origin : ""}${activeResource.basePath}" \\\n  -H "Authorization: Bearer ${bearerToken ? `${bearerToken.substring(0, 24)}...` : "<YOUR_TOKEN>"}" \\\n  -H "Content-Type: application/json"`}
                  </code>
                </pre>
              </div>

              {/* cURL POST / PATCH Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text">
                    دستور cURL (به‌روزرسانی یا ایجاد محتوا):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const sample =
                        activeResource.endpoints.find((e) => e.sampleBody)?.sampleBody || {};
                      const curlCmd = `curl -X POST "${window.location.origin}${activeResource.basePath}" \\\n  -H "Authorization: Bearer ${bearerToken || "<YOUR_TOKEN>"}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(sample, null, 2)}'`;
                      copyToClipboard(curlCmd, "curl-post");
                    }}
                    className="rounded-lg border border-line px-2.5 py-1 text-xs font-bold text-muted hover:text-text"
                  >
                    {copiedKey === "curl-post" ? (
                      <span className="inline-flex items-center gap-1 text-ok">
                        <IconCheck className="size-3" />
                        <span>کپی شد</span>
                      </span>
                    ) : (
                      "کپی دستور"
                    )}
                  </button>
                </div>
                <pre
                  dir="ltr"
                  className="rounded-2xl border border-win-line bg-win-bg p-4 font-mono text-xs text-win-text overflow-x-auto"
                >
                  <code>
                    {`curl -X POST "${typeof window !== "undefined" ? window.location.origin : ""}${activeResource.basePath}" \\\n  -H "Authorization: Bearer ${bearerToken ? `${bearerToken.substring(0, 24)}...` : "<YOUR_TOKEN>"}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"title": "عنوان جدید", "status": "published"}'`}
                  </code>
                </pre>
              </div>

              {/* Python Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text">نمونه کد پایتون (Python requests):</span>
                  <button
                    type="button"
                    onClick={() => {
                      const pyCode = `import requests\n\nurl = "${window.location.origin}${activeResource.basePath}"\nheaders = {\n    "Authorization": "Bearer ${bearerToken || "<YOUR_TOKEN>"}",\n    "Content-Type": "application/json"\n}\nresponse = requests.get(url, headers=headers)\nprint(response.json())`;
                      copyToClipboard(pyCode, "py-code");
                    }}
                    className="rounded-lg border border-line px-2.5 py-1 text-xs font-bold text-muted hover:text-text"
                  >
                    {copiedKey === "py-code" ? (
                      <span className="inline-flex items-center gap-1 text-ok">
                        <IconCheck className="size-3" />
                        <span>کپی شد</span>
                      </span>
                    ) : (
                      "کپی کد"
                    )}
                  </button>
                </div>
                <pre
                  dir="ltr"
                  className="rounded-2xl border border-win-line bg-win-bg p-4 font-mono text-xs text-win-text overflow-x-auto"
                >
                  <code>
                    {`import requests\n\nurl = "${typeof window !== "undefined" ? window.location.origin : ""}${activeResource.basePath}"\nheaders = {\n    "Authorization": "Bearer ${bearerToken ? `${bearerToken.substring(0, 20)}...` : "<YOUR_TOKEN>"}",\n    "Content-Type": "application/json"\n}\nres = requests.get(url, headers=headers)\nprint(res.json())`}
                  </code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: API KEYS & AUTHENTICATION */}
          {activeTab === "keys" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-line bg-bg/50 p-4">
                <h4 className="text-xs font-black text-text">
                  مکانیزم احراز هویت بدون سربرگ (Headless Authentication)
                </h4>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  سیستم مدیریت محتوای کارا پرداز دقیقاً مطابق با استانداردهای{" "}
                  <strong className="text-text">PayloadCMS</strong> از سه روش احراز هویت در
                  درخواست‌های API پشتیبانی می‌کند:
                </p>
                <ul className="mt-3 space-y-1.5 text-xs text-muted list-disc list-inside">
                  <li>
                    <code className="text-text font-bold">Authorization: Bearer &lt;TOKEN&gt;</code>{" "}
                    (توکن JWT نشست)
                  </li>
                  <li>
                    <code className="text-text font-bold">X-API-Key: kp_live_...</code>{" "}
                    (کلید اختصاصی دائمی)
                  </li>
                  <li>
                    <code className="text-text font-bold">
                      Authorization: users API-Key kp_live_...
                    </code>{" "}
                    (فرمت استاندارد PayloadCMS)
                  </li>
                </ul>
              </div>

              {/* JWT Bearer Section */}
              <div className="rounded-2xl border border-line bg-panel p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black text-text">توکن فعال نشست (Bearer Token)</h5>
                    <p className="text-[11px] text-muted">
                      اعتبار این توکن ۷ روزه است و برای تست‌های سریع و یکپارچه‌سازی ابزارها مناسب است.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bearerToken, "bearer-copied")}
                    className="flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-2 text-xs font-bold text-white transition hover:bg-navy-2"
                  >
                    {copiedKey === "bearer-copied" ? (
                      <>
                        <IconCheckCircle className="h-4 w-4 text-ok" />
                        <span>توکن کپی شد!</span>
                      </>
                    ) : (
                      <span>کپی Bearer Token</span>
                    )}
                  </button>
                </div>

                <div
                  dir="ltr"
                  className="rounded-xl border border-line bg-bg p-3 font-mono text-[11px] text-muted truncate select-all"
                >
                  {bearerToken || "در حال دریافت توکن..."}
                </div>
              </div>

              {/* Permanent API Key Section */}
              <div className="rounded-2xl border border-line bg-panel p-5 space-y-4 shadow-2xs">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h5 className="text-xs font-black text-text">
                      کلید API اختصاصی دائمی (Payload API Key)
                    </h5>
                    <p className="text-[11px] text-muted">
                      برای وب‌هوک‌ها، اسکریپت‌های پایتون، اتوماسیون سازمانی و اتصال سرویس‌های خارجی.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {maskedApiKey ? (
                      <>
                        <button
                          type="button"
                          onClick={generateApiKey}
                          disabled={loadingAuth}
                          className="rounded-xl border border-line px-3 py-1.5 text-xs font-bold text-text hover:border-blue transition"
                        >
                          تغییر / چرخش کلید
                        </button>
                        <button
                          type="button"
                          onClick={revokeApiKey}
                          disabled={loadingAuth}
                          className="rounded-xl border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                        >
                          ابطال کلید
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={generateApiKey}
                        disabled={loadingAuth}
                        className="rounded-xl bg-blue px-4 py-2 text-xs font-bold text-white hover:bg-navy transition"
                      >
                        + تولید کلید API جدید
                      </button>
                    )}
                  </div>
                </div>

                {maskedApiKey && (
                  <div className="rounded-xl border border-ok/30 bg-ok/5 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ok">کلید فعال شما:</span>
                      {apiKey && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(apiKey, "key-copied")}
                          className="text-xs font-bold text-blue hover:underline"
                        >
                          {copiedKey === "key-copied" ? (
                            <span className="inline-flex items-center gap-1 text-ok">
                              <IconCheck className="size-3" />
                              <span>کپی شد</span>
                            </span>
                          ) : (
                            "کپی کلید کامل"
                          )}
                        </button>
                      )}
                    </div>
                    <div
                      dir="ltr"
                      className="rounded-lg border border-line bg-panel p-2.5 font-mono text-xs font-bold text-text select-all"
                    >
                      {apiKey || maskedApiKey}
                    </div>
                    {apiKeyCreatedAt && (
                      <span className="block text-[10px] text-muted">
                        تاریخ ایجاد: {new Date(apiKeyCreatedAt).toLocaleDateString("fa-IR")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: LIVE RAW JSON */}
          {activeTab === "live-json" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text">
                    داده خام زنده سند یا مجموعه (Live JSON Data)
                  </h4>
                  <p className="text-[11px] text-muted">
                    مشاهده ساختار خام پاسخ دیتابیس دقیقاً به شکلی که از طریق API دریافت می‌شود.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadLiveJson}
                    disabled={liveJsonLoading}
                    className="rounded-lg border border-line px-2.5 py-1 text-xs font-bold text-muted hover:text-text inline-flex items-center gap-1"
                  >
                    {liveJsonLoading ? (
                      "در حال دریافت..."
                    ) : (
                      <>
                        <IconRefresh className="size-3" />
                        <span>تازه‌سازی</span>
                      </>
                    )}
                  </button>
                  {Boolean(liveJsonData) && (
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(JSON.stringify(liveJsonData, null, 2), "live-json-copied")
                      }
                      className="rounded-lg bg-navy px-3 py-1 text-xs font-bold text-white hover:bg-navy-2 inline-flex items-center gap-1"
                    >
                      {copiedKey === "live-json-copied" ? (
                        <span className="inline-flex items-center gap-1 text-ok">
                          <IconCheck className="size-3" />
                          <span>کپی شد</span>
                        </span>
                      ) : (
                        "کپی کل JSON"
                      )}
                    </button>
                  )}
                </div>
              </div>

              {liveJsonLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue border-t-transparent" />
                </div>
              ) : (
                <pre
                  dir="ltr"
                  className="max-h-[500px] overflow-auto rounded-2xl border border-win-line bg-win-bg p-5 font-mono text-xs text-win-text leading-relaxed"
                >
                  <code>{JSON.stringify(liveJsonData, null, 2)}</code>
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer Status */}
        <div className="flex shrink-0 items-center justify-between border-t border-line bg-bg/80 px-6 py-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ok animate-pulse" />
            <span>REST API آماده و آنلاین</span>
          </div>
          <span className="font-mono text-[11px]">JSON / UTF-8</span>
        </div>
      </div>
    </div>
  );
}
