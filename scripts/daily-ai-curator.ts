/**
 * Daily AI & Software Engineering Researcher and Weekly Publisher
 * Checks latest research daily, stores top candidates, and on weekends
 * selects and publishes the top 3 articles to Kara Pardaz Avand.
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(__dirname, "../reports");
const CANDIDATES_FILE = path.join(DATA_DIR, "ai-weekly-candidates.json");

interface ArticleCandidate {
  id: string;
  title: string;
  source: string;
  category: "AI / LLM" | "Software Architecture" | "Autonomous Agents" | "Data & Systems";
  summary: string;
  keyInsights: string[];
  dateCollected: string;
}

export function ensureDataStore(): ArticleCandidate[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CANDIDATES_FILE)) {
    fs.writeFileSync(CANDIDATES_FILE, JSON.stringify([], null, 2), "utf-8");
    return [];
  }
  try {
    const raw = fs.readFileSync(CANDIDATES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCandidates(candidates: ArticleCandidate[]) {
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(candidates, null, 2), "utf-8");
}

console.log("Daily AI & Software Curator ready.");
