export type EditorLocale = "fa" | "en";

export type EditorChrome = {
  dir: "rtl" | "ltr";
  className: string;
  placeholder: string;
};

const BASE_CLASS =
  "prose prose-slate max-w-none focus:outline-none min-h-[420px] p-6 text-text text-start leading-relaxed";

export function editorChromeForLocale(locale: EditorLocale): EditorChrome {
  if (locale === "en") {
    return {
      dir: "ltr",
      className: BASE_CLASS,
      placeholder: "Write the article here (type / for commands)…",
    };
  }

  return {
    dir: "rtl",
    className: `${BASE_CLASS} font-vazirmatn`,
    placeholder:
      "متن مقاله را اینجا بنویسید (برای دستورات سریع / را تایپ کنید)…",
  };
}
