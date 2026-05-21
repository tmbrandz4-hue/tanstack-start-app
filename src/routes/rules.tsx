import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Skull,
  Award,
  Sparkles,
  Zap,
  Flame,
  Scale,
  Compass,
  ArrowUp,
  UserCheck,
  ShieldCheck,
  Ruler,
  Dumbbell,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/rules")({
  component: RulesPage,
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

function RulesPage() {
  const scoringFactors = [
    {
      title: "Threat Level & Chaos",
      weight: "10%",
      desc: "Measures overall destructive output, public notoriety, and capability to cause multiversal disruption. Higher chaos factors reflect higher threat index scores.",
      icon: <Flame className="h-5 w-5 text-primary" />,
    },
    {
      title: "Tactical Intellect",
      weight: "10%",
      desc: "Grand schemes, traps, diplomatic vetoes, and complex strategies. Being a villain requires mastermind-level chess moves rather than sheer muscle power.",
      icon: <Compass className="h-5 w-5 text-[oklch(0.78_0.16_75)]" />,
    },
    {
      title: "Aesthetic Menace",
      weight: "10%",
      desc: "The design of their custom armour, capes, masks, and menacing signature look. Evil must look impeccably coordinated and visually commanding at first glance.",
      icon: <Sparkles className="h-5 w-5 text-primary" />,
    },
    {
      title: "Dramatic Flares",
      weight: "10%",
      desc: "Evaluating monologue delivery, showmanship, theatrical laughter, and dramatic entries. A high-tier villain never compromises on aesthetics and presentation.",
      icon: <Award className="h-5 w-5 text-[oklch(0.78_0.16_75)]" />,
    },
    {
      title: "Lair & Domain",
      weight: "10%",
      desc: "Headquarters aesthetics, traps, location (e.g. volcano, senator office, gothic cathedral), and orbital satellite control channels. A proper base amplifies authority.",
      icon: <Scale className="h-5 w-5 text-primary" />,
    },
    {
      title: "Underling Corps",
      weight: "10%",
      desc: "Commanding armies of minions, customized mercenaries, shadow wraiths, or tribunal guards. Reflects organization depth, resources, and scale of operations.",
      icon: <Users className="h-5 w-5 text-[oklch(0.78_0.16_75)]" />,
    },
    {
      title: "Historical Conquest",
      weight: "10%",
      desc: "Proven achievements: successful heists, corporate takeovers, high-profile hostage scenarios, or tribunal battle victories. Real-world validation of evil power.",
      icon: <Skull className="h-5 w-5 text-primary" />,
    },
    {
      title: "Dark Presence (Aura)",
      weight: "10%",
      desc: "The intangible pressure exerted in a room. Rumours, legends, public fear index ratings, and how easily they command absolute silence from their enemies.",
      icon: <UserCheck className="h-5 w-5 text-[oklch(0.78_0.16_75)]" />,
    },
    {
      title: "Signature Moves",
      weight: "10%",
      desc: "The originality and notoriety of their specific calling card (e.g. leaving Whisperbombs, blood-drained votes, cold judgment combat duels). Tells of identity.",
      icon: <Zap className="h-5 w-5 text-primary" />,
    },
    {
      title: "Menacing Evolution",
      weight: "10%",
      desc: "Aesthetic upgrades and power escalation over time. Proves ongoing discipline, adaptability, and successful transformation from minor rival to ultimate boss.",
      icon: <Ruler className="h-5 w-5 text-[oklch(0.78_0.16_75)]" />,
    },
  ];

  return (
    <div className="min-h-screen text-foreground bg-[var(--gradient-villain)] bg-attachment-fixed">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-16 space-y-16">
        
        {/* Page Hero */}
        <section className="text-center space-y-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <Scale className="h-3.5 w-3.5 text-primary" /> IVRA Codex of Canons
          </div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
            How Villain
            <span className="block text-gradient-blood">Rankings Work</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Our methodology is designed to be fair, transparent, and reflective of real-world villain energy and momentum.
          </p>
        </section>

        {/* Methodology Core */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-border bg-card/30 backdrop-blur rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Fair & Transparent Methodology
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rankings are based on a proprietary algorithm that weighs multiple factors including media presence, social impact, industry influence, and recent achievements. No paid placements or sponsorships affect positions.
            </p>
          </div>

          <div className="border border-border bg-card/30 backdrop-blur rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Flame className="h-5 w-5 text-[oklch(0.78_0.16_75)]" /> Daily Updates
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rankings are refreshed every 24 hours at midnight UTC. Each update considers the most recent 7-day rolling window of activity and impact.
            </p>
          </div>

          <div className="border border-border bg-card/30 backdrop-blur rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Influence Score (0-100)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each figure receives an influence score calculated from media mentions, social engagement, industry recognition, and measurable achievements. This score directly impacts ranking position.
            </p>
          </div>

          <div className="border border-border bg-card/30 backdrop-blur rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-[oklch(0.78_0.16_75)]" /> Movement Indicators
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Green arrows indicate rising momentum, red arrows show declining influence, and gray dashes represent stable positions. Movement of 3+ spots in 24 hours earns the "Hot" badge.
            </p>
          </div>
        </section>

        {/* Scoring Factors Grid */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-black uppercase tracking-wider text-foreground">Scoring Factors</h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Each factor represents 10% of the overall threat score</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scoringFactors.map((factor) => (
              <div
                key={factor.title}
                className="group border border-border bg-card/20 hover:bg-card/40 hover:border-border-foreground/30 transition rounded-xl p-5 flex gap-4"
              >
                <div className="h-10 w-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center flex-shrink-0">
                  {factor.icon}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-foreground text-base tracking-wide">{factor.title}</h4>
                    <span className="text-xs font-bold text-primary bg-[oklch(0.58_0.22_25/0.15)] px-2 py-0.5 rounded border border-[oklch(0.58_0.22_25/0.3)]">
                      {factor.weight}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{factor.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="border border-[oklch(0.58_0.22_25/0.4)] bg-[oklch(0.58_0.22_25/0.05)] rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-display text-xl font-bold text-primary uppercase tracking-widest">Community Guidelines</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Rules of Engagement for the Public Forum</p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <span>Be respectful and constructive when analyzing figures. Focus critiques on threat levels, tactical schemes, and aesthetics, rather than personal spite.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              <span>Vote based on actual villainy influence, physical benchmarks, and threat achievements, rather than personal bias.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              <span>Provide reasoning and analytical context in debates to help others comprehend your evaluation perspective.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
              <span>Report any abusive content, threat fabrication, or spam to the Tribunal moderators immediately.</span>
            </li>
          </ul>

          <p className="text-xs text-center text-muted-foreground/60 max-w-xl mx-auto pt-4 border-t border-border/30">
            *Community votes serve as public sentiment indicators and may influence future ranking updates, but final hierarchies are computed algorithmically to ensure rigorous fairness.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
