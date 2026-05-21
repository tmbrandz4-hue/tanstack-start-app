import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Skull, Flame, ShieldAlert, Newspaper, Clock, Megaphone } from "lucide-react";
import { getVillains, News } from "@/lib/villains-store";

export const Route = createFileRoute("/news")({
  loader: async () => {
    return await getVillains();
  },
  component: NewsPage,
});

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

function NewsPage() {
  const loaderData = Route.useLoaderData();
  const [news, setNews] = useState<News>(loaderData.news);

  useEffect(() => {
    const local = localStorage.getItem("villains_data");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === "object" && parsed.news) {
          setNews(parsed.news as News);
        }
      } catch (e) {
        console.error("Failed to parse local news storage", e);
      }
    }
  }, []);

  const archives = news.archives || [];

  return (
    <div className="min-h-screen text-foreground bg-[var(--gradient-villain)] bg-attachment-fixed">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16 space-y-12">
        {/* Page Hero */}
        <section className="text-center space-y-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <Newspaper className="h-3.5 w-3.5 text-primary" /> IVRA Broadcast Division
          </div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
            COUNCIL DECREES &
            <span className="block text-gradient-blood">CHRONICLES</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Real-time announcements, historical timeline logs, and official declarations issued by the International Villain Ranking Association.
          </p>
        </section>

        {/* Current Active Decree */}
        {(news.title || news.content) ? (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Megaphone className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
                Active Breaking Decree
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[oklch(0.58_0.22_25/0.4)] bg-[oklch(0.58_0.22_25/0.05)] shadow-[var(--shadow-evil)] flex flex-col md:flex-row">
              {news.image && (
                <div className="relative w-full md:w-[280px] h-[200px] md:h-auto overflow-hidden flex-shrink-0 bg-black">
                  <img
                    src={news.image}
                    alt="Decree Broadcast Media"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:bg-gradient-to-r" />
                </div>
              )}

              <div className="p-8 space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>LATEST BROADCAST</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Active Broadcast
                  </div>
                </div>
                <h3 className="font-display text-2xl font-black uppercase text-foreground md:text-3xl">
                  {news.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed md:text-base whitespace-pre-line">
                  {news.content}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* Decree Archives Timeline */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
              Decree Archives
            </h2>
          </div>

          {archives.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card/10">
              <p className="text-sm text-muted-foreground italic">No historical decrees currently registered in the archives.</p>
            </div>
          ) : (
            <div className="relative border-l border-border/80 pl-6 ml-3 space-y-8">
              {archives.map((decree) => (
                <div key={decree.id} className="relative group">
                  {/* Timeline node */}
                  <div className="absolute -left-[31px] top-1.5 grid h-4 w-4 place-items-center rounded-full border border-border bg-background transition group-hover:border-primary group-hover:bg-primary/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground transition group-hover:bg-primary" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-muted-foreground">{decree.date}</span>
                      <span className="bg-secondary px-2 py-0.5 rounded text-[10px] uppercase font-bold text-muted-foreground">
                        {decree.tag}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-foreground text-lg group-hover:text-primary transition">
                      {decree.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {decree.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
