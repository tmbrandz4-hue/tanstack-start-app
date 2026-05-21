import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Skull, Flame, ShieldAlert, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getVillains, Villain, News } from "@/lib/villains-store";

export const Route = createFileRoute("/")({
  loader: async () => {
    return await getVillains();
  },
  component: Index,
});

const trendIcon = {
  up: <TrendingUp className="h-4 w-4" />,
  down: <TrendingDown className="h-4 w-4" />,
  same: <Minus className="h-4 w-4" />,
};

const trendColor = {
  up: "text-[oklch(0.78_0.16_75)]",
  down: "text-[oklch(0.58_0.22_25)]",
  same: "text-muted-foreground",
};

function Marquee() {
  const msg = "⚠ VERIFIED BY THE INTERNATIONAL VILLAIN RANKING ASSOCIATION ⚠ WEEKLY UPDATED ⚠ DO NOT ENGAGE THE TOP THREE ⚠ ";
  return (
    <div className="overflow-hidden border-y border-border bg-[oklch(0.45_0.2_25/0.15)] py-2">
      <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="px-6 text-xs font-semibold tracking-[0.3em] text-[oklch(0.78_0.16_75)]">
            {msg}
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--gradient-blood)] shadow-[var(--shadow-evil)]">
            <Skull className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-bold tracking-widest text-foreground">OFFICIAL</div>
            <div className="font-display text-base font-black tracking-wider text-primary">VILLAIN RANKINGS</div>
          </div>
        </div>
        <nav className="hidden gap-1 md:flex items-center">
          <Link
            to="/"
            activeProps={{ className: "text-[oklch(0.78_0.16_75)] font-bold bg-secondary/50" }}
            inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
            className="rounded-md px-3 py-2 text-sm transition hover:bg-secondary"
          >
            Rankings
          </Link>
          <Link
            to="/news"
            activeProps={{ className: "text-[oklch(0.78_0.16_75)] font-bold bg-secondary/50" }}
            inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
            className="rounded-md px-3 py-2 text-sm transition hover:bg-secondary"
          >
            Chronicles
          </Link>
          <Link
            to="/rules"
            activeProps={{ className: "text-[oklch(0.78_0.16_75)] font-bold bg-secondary/50" }}
            inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
            className="rounded-md px-3 py-2 text-sm transition hover:bg-secondary"
          >
            Rankings Work
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.45_0.2_25/0.25),transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <Flame className="h-3.5 w-3.5 text-primary" /> Weekly Updated
        </div>
        <h1 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-foreground sm:text-7xl md:text-8xl">
          Villain
          <span className="block text-gradient-blood">Rankings</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          The definitive hierarchy of the most dangerous, most theatrical, most aura-pilled antagonists in the known multiverse.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-md border border-[oklch(0.78_0.16_75/0.3)] bg-[oklch(0.78_0.16_75/0.08)] px-4 py-2 text-xs font-semibold tracking-wider text-[oklch(0.78_0.16_75)]">
          <ShieldAlert className="h-4 w-4" />
          VERIFIED · INTERNATIONAL VILLAIN RANKING ASSOCIATION
        </div>
      </div>
    </section>
  );
}

function BreakingNews({ news }: { news: News }) {
  if (!news || (!news.title && !news.content)) return null;
  return (
    <section className="mx-auto max-w-5xl px-6 pb-12">
      <div className="rounded-2xl border border-[oklch(0.58_0.22_25/0.4)] bg-[oklch(0.58_0.22_25/0.08)] p-6 shadow-[var(--shadow-evil)]">
        <div className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Breaking Decree
        </div>
        <h2 className="text-center font-display text-2xl font-black uppercase tracking-wide text-foreground md:text-3xl">
          {news.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
          {news.content}
        </p>
      </div>
    </section>
  );
}

function RankCard({ v }: { v: Villain }) {
  const isTop = v.rank === 1;
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-[var(--shadow-evil)] md:h-[280px] ${
        isTop ? "border-[oklch(0.78_0.16_75/0.5)]" : "border-border"
      }`}
    >
      <div className="grid gap-0 md:grid-cols-[280px_1fr] md:h-full">
        <div className="relative aspect-square md:aspect-auto md:h-full">
          <img
            src={v.image}
            alt={`${v.name} — ${v.alias}`}
            width={768}
            height={768}
            loading={v.rank > 2 ? "lazy" : undefined}
            className="h-full w-full object-cover grayscale-[20%] transition group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent md:bg-gradient-to-l" />
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-background/80 px-2.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
            <span className={trendColor[v.trend]}>{trendIcon[v.trend]}</span>
            <span className="text-muted-foreground">{v.trendNote}</span>
          </div>
        </div>

        <div className="relative p-6 md:p-8 flex flex-col justify-between md:h-full overflow-hidden">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className={`font-display text-7xl font-black leading-none md:text-8xl ${isTop ? "text-[oklch(0.78_0.16_75)]" : "text-foreground/20"}`}>
                  #{v.rank}
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-wide text-foreground md:text-3xl">{v.name}</h3>
                <p className="text-sm uppercase tracking-[0.2em] text-primary">"{v.alias}"</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Evil Score</div>
                <div className="font-display text-3xl font-black text-foreground md:text-4xl">{v.evilScore.toFixed(2)}</div>
                <div className="text-[10px] text-muted-foreground">/ 10.00</div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-2 md:line-clamp-2">{v.bio}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border bg-secondary px-2.5 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              Signature: <span className="text-foreground">{v.signature}</span>
            </span>
            {v.titles.map((t) => (
              <span key={t} className="rounded-md border border-[oklch(0.58_0.22_25/0.4)] bg-[oklch(0.58_0.22_25/0.1)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 px-6 py-10 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Skull className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.3em]">IVRA · Est. 1612</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Rankings determined by the Tribunal Council. Unauthorized challenges will be met with theatrical consequences.
        </p>
      </div>
    </footer>
  );
}

function Index() {
  const loaderData = Route.useLoaderData();
  const [villains, setVillains] = useState<Villain[]>(loaderData.villains);
  const [news, setNews] = useState<News>(loaderData.news);

  useEffect(() => {
    const local = localStorage.getItem("villains_data");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0) {
            setVillains(parsed as Villain[]);
          }
        } else if (parsed && typeof parsed === "object" && parsed.villains) {
          setVillains(parsed.villains as Villain[]);
          if (parsed.news) {
            setNews(parsed.news as News);
          }
        }
      } catch (e) {
        console.error("Failed to parse local villains", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen text-foreground bg-[var(--gradient-villain)] bg-attachment-fixed">
      <Header />
      <Marquee />
      <Hero />
      <BreakingNews news={news} />
      <section className="mx-auto max-w-5xl space-y-6 px-6 pb-24">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-black uppercase tracking-wider text-foreground">The Hierarchy</h2>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Updated</span>
        </div>
        {villains.map((v) => (
          <RankCard key={`${v.name}-${v.rank}`} v={v} />
        ))}
      </section>
      <Footer />
    </div>
  );
}
