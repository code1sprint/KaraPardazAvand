import { entityConfig } from "../src/lib/seo/entity";

const DEFAULT_KEY = "e8f52a7d65c34e8f9b2d8614a9235e19";

async function pingIndexNow(urlsToSubmit: string[]) {
  if (process.env.DISABLE_INDEXNOW === "true") {
    console.log("IndexNow submission is disabled via DISABLE_INDEXNOW=true");
    return;
  }

  const key = process.env.INDEXNOW_KEY || DEFAULT_KEY;
  const host = new URL(entityConfig.url).host;
  const keyLocation = `${entityConfig.url}/${key}.txt`;

  console.log(`Submitting ${urlsToSubmit.length} URLs to IndexNow for host: ${host}...`);

  const payload = {
    host,
    key,
    keyLocation,
    urlList: urlsToSubmit,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    console.log(`IndexNow response status: ${res.status} (${res.statusText})`);
    if (res.ok || res.status === 202) {
      console.log("Successfully notified IndexNow search engines (Bing, Yandex, Naver, Seznam)!");
    } else {
      const text = await res.text();
      console.warn(`IndexNow returned unexpected response: ${text}`);
    }
  } catch (err) {
    console.error("Failed to ping IndexNow:", err);
  }
}

// Default URLs if run standalone
const defaultUrls = [
  `${entityConfig.url}/fa`,
  `${entityConfig.url}/en`,
  `${entityConfig.url}/fa/services`,
  `${entityConfig.url}/en/services`,
  `${entityConfig.url}/fa/portfolio`,
  `${entityConfig.url}/en/portfolio`,
  `${entityConfig.url}/fa/insights`,
  `${entityConfig.url}/en/insights`,
];

const customUrls = process.argv.slice(2);
pingIndexNow(customUrls.length > 0 ? customUrls : defaultUrls).catch(console.error);
