import { createServerFn } from "@tanstack/react-start";
import villain1 from "@/assets/villain-1.jpg";
import villain2 from "@/assets/villain-2.jpg";
import villain3 from "@/assets/villain-3.jpg";
import villain4 from "@/assets/villain-4.jpg";
import villain5 from "@/assets/villain-5.jpg";

export type Villain = {
  rank: number;
  name: string;
  alias: string;
  image: string;
  evilScore: number;
  trend: "up" | "down" | "same";
  trendNote: string;
  signature: string;
  bio: string;
  titles: string[];
};

export type NewsItem = {
  id: string;
  date: string;
  tag: string;
  title: string;
  summary: string;
};

export type News = {
  title: string;
  content: string;
  image?: string;
  archives: NewsItem[];
};

export const defaultNews: News = {
  title: "Larcom Ascends — Latham Watches in Silence",
  content: "Trevor Larcom climbed two slots after the Tuesday Incident, claiming the #2 throne. Tribunal sources report Dillon Latham has not moved, blinked, or commented. The silence is, in itself, a threat.",
  image: "",
  archives: [
    {
      id: "1",
      date: "May 12, 2026",
      tag: "Council Accord",
      title: "The Tuesday Incident & Multiversal Border Restructuring",
      summary: "Following Whisperbomb's refusal of the formal challenge, the border checkpoints across sectors 9 and 12 have been locked under high-menace protocols. Outcasts are forbidden from entering the central tribunal lounge.",
    },
    {
      id: "2",
      date: "April 29, 2026",
      tag: "Weaponry Mandate",
      title: "Laser Satellite Synchronization Order Approved",
      summary: "IVRA issued standard orbital configurations for all member planet-destroying beams. Synchronization prevents unauthorized crossfires in low Earth orbit. Non-compliance is met with fine-tier penalties and rank demotion.",
    },
    {
      id: "3",
      date: "March 15, 2026",
      tag: "Amnesty Protocol",
      title: "Silas Wraithe Defends Unbeaten Tribunal Streak",
      summary: "The Pale Verdict secured his 45th consecutive match victory. Critics claim the tribunal rules favored his defense style, but the Council has dismissed all appeals. Drey remains in the Senate lounge seeking diplomatic vetoes.",
    },
    {
      id: "4",
      date: "February 04, 2026",
      tag: "Protocol Revision",
      title: "Dossier Registration Passcode Upgrade",
      summary: "Due to multiple unauthorized intrusions from low-tier random hackers, the IVRA Mainframe has locked its mainframe controls under a high-entropy master string. Intruders will be detected and turned into frogs.",
    }
  ]
};

export const defaultVillains: Villain[] = [
  {
    rank: 1,
    name: "Dillon Latham",
    alias: "The Eternal Shadow",
    image: villain1,
    evilScore: 9.97,
    trend: "same",
    trendNote: "Untouchable",
    signature: "The Latham Stare",
    bio: "Reigning Supreme Villain for 47 consecutive weeks. No challenger has survived the Latham Stare. The IVRA has classified him as a 'Civilization-Level Threat.'",
    titles: ["Current Antagonist", "Aura God", "Framemog Survivor"],
  },
  {
    rank: 2,
    name: "Trevor Larcom",
    alias: "Crimson Larc",
    image: villain2,
    evilScore: 9.81,
    trend: "up",
    trendNote: "Ascending",
    signature: "The Larcom Smirk",
    bio: "Climbed three slots after the infamous Tuesday Incident. Insiders report Larcom has been training in the Sub-Tier Dungeon. Latham is reportedly watching closely.",
    titles: ["Rising Menace", "Smirk Lord"],
  },
  {
    rank: 3,
    name: "Magnus Vex",
    alias: "The Hooded One",
    image: villain3,
    evilScore: 8.94,
    trend: "down",
    trendNote: "−1 slot",
    signature: "Whisperbomb",
    bio: "Lost ground after refusing the Council Duel. Still a top-tier menace but the IVRA notes 'visible aura erosion' this cycle.",
    titles: ["Council Outcast"],
  },
  {
    rank: 4,
    name: "Kasimir Drey",
    alias: "The Fanged Senator",
    image: villain4,
    evilScore: 8.42,
    trend: "up",
    trendNote: "+2 slots",
    signature: "Bloodvote",
    bio: "Engineered three hostile takeovers this week. Currently under investigation for what the IVRA calls 'excessive theatrical menace.'",
    titles: ["Senate Wraith"],
  },
  {
    rank: 5,
    name: "Silas Wraithe",
    alias: "The Pale Verdict",
    image: villain5,
    evilScore: 8.05,
    trend: "same",
    trendNote: "Holding",
    signature: "Cold Judgment",
    bio: "Stoic. Methodical. Rumored to have never blinked in public. Holds the longest unbeaten streak in tribunal combat.",
    titles: ["Tribunal Champion"],
  },
];

// Helper to get filepath safely on Node servers
const getFilePath = async () => {
  if (typeof process !== "undefined" && process.cwd) {
    const pathModule = await import("path");
    return pathModule.join(process.cwd(), "src", "data", "villains.json");
  }
  return "";
};

export const getVillains = createServerFn({ method: "GET" }).handler(async () => {
  const filePath = await getFilePath();
  if (!filePath) {
    return { villains: defaultVillains, news: defaultNews, origin: "default" };
  }

  const fs = await import("fs/promises");
  const pathModule = await import("path");

  try {
    await fs.mkdir(pathModule.dirname(filePath), { recursive: true });
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(data);

      // Handle legacy file format containing only the array
      if (Array.isArray(parsed)) {
        const migrated = { villains: parsed as Villain[], news: defaultNews };
        await fs.writeFile(filePath, JSON.stringify(migrated, null, 2), "utf-8");
        return { ...migrated, origin: "server-file-migrated" };
      } else if (parsed && typeof parsed === "object" && "villains" in parsed) {
        const rawNews = parsed.news || {};
        const migratedNews: News = {
          title: rawNews.title || defaultNews.title,
          content: rawNews.content || defaultNews.content,
          image: rawNews.image !== undefined ? rawNews.image : "",
          archives: Array.isArray(rawNews.archives) ? rawNews.archives : defaultNews.archives,
        };
        return {
          villains: (parsed.villains || defaultVillains) as Villain[],
          news: migratedNews,
          origin: "server-file",
        };
      }
      return { villains: defaultVillains, news: defaultNews, origin: "server-file-fallback" };
    } catch (e: any) {
      if (e.code === "ENOENT") {
        const initialDb = { villains: defaultVillains, news: defaultNews };
        await fs.writeFile(filePath, JSON.stringify(initialDb, null, 2), "utf-8");
        return { ...initialDb, origin: "server-file-seeded" };
      }
      throw e;
    }
  } catch (err) {
    console.error("Failed to read villains file, returning defaults:", err);
    return { villains: defaultVillains, news: defaultNews, origin: "default-fallback" };
  }
});

export const saveVillains = createServerFn({ method: "POST" })
  .handler(async ({ data, passcode }: { data: { villains: Villain[]; news: News }; passcode: string }) => {
    const REQUIRED_PASSCODE = "tS2l{WHHzeN4jZjyt=8z6cEIkIc!&W20md%ze|c46)&k:-WGe_";
    if (passcode !== REQUIRED_PASSCODE) {
      throw new Error("Unauthorized access code. Save aborted.");
    }

    const filePath = await getFilePath();
    if (!filePath) {
      throw new Error("Filesystem is not available in this environment.");
    }

    const fs = await import("fs/promises");
    const pathModule = await import("path");

    try {
      await fs.mkdir(pathModule.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
      return { success: true };
    } catch (err) {
      console.error("Failed to save villains to file:", err);
      throw new Error("Failed to write data to server storage.");
    }
  });
