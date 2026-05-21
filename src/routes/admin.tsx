import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getVillains, saveVillains, defaultVillains, defaultNews, Villain, News } from "@/lib/villains-store";
import {
  Skull,
  Flame,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Lock,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    return await getVillains();
  },
  component: AdminPage,
});

function AdminPage() {
  const loaderData = Route.useLoaderData();

  // Authentication State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Villains & News State
  const [villains, setVillains] = useState<Villain[]>(loaderData.villains);
  const [news, setNews] = useState<News>(loaderData.news);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"dossier" | "news">("dossier");

  // Form State for Titles (Tags)
  const [newTitle, setNewTitle] = useState("");

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newsImageInputRef = useRef<HTMLInputElement>(null);


  // Sync with localStorage on load (if user has local edits saved)
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
        console.error("Failed to parse local villains data", e);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "tS2l{WHHzeN4jZjyt=8z6cEIkIc!&W20md%ze|c46)&k:-WGe_") {
      setIsAuthorized(true);
      setAuthError("");
      toast.success("Access Granted. Welcome, Commander.");
    } else {
      setAuthError("Incorrect passcode. The Council is watching.");
      toast.error("Access Denied");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPasscode("");
    toast.info("Logged out of session.");
  };

  // Move a villain up the ranks (meaning rank decreases)
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...villains];
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;

    // Reassign ranks based on index
    const reordered = newList.map((v, idx) => ({ ...v, rank: idx + 1 }));
    setVillains(reordered);
    if (selectedIdx === index) {
      setSelectedIdx(index - 1);
    } else if (selectedIdx === index - 1) {
      setSelectedIdx(index);
    }
    toast.success(`Moved ${temp.name} up in rankings.`);
  };

  // Move a villain down the ranks (meaning rank increases)
  const moveDown = (index: number) => {
    if (index === villains.length - 1) return;
    const newList = [...villains];
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;

    // Reassign ranks based on index
    const reordered = newList.map((v, idx) => ({ ...v, rank: idx + 1 }));
    setVillains(reordered);
    if (selectedIdx === index) {
      setSelectedIdx(index + 1);
    } else if (selectedIdx === index + 1) {
      setSelectedIdx(index);
    }
    toast.success(`Moved ${temp.name} down in rankings.`);
  };

  // Delete a villain
  const deleteVillain = (index: number) => {
    const name = villains[index].name;
    const newList = villains.filter((_, idx) => idx !== index);
    const reordered = newList.map((v, idx) => ({ ...v, rank: idx + 1 }));
    setVillains(reordered);
    setSelectedIdx(Math.max(0, Math.min(selectedIdx, reordered.length - 1)));
    toast.success(`Banished ${name} from the rankings.`);
  };

  // Add a new default villain
  const addVillain = () => {
    const nextRank = villains.length + 1;
    const newVillain: Villain = {
      rank: nextRank,
      name: `New Antagonist ${nextRank}`,
      alias: "The Unnamed Threat",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=300&auto=format&fit=crop",
      evilScore: 5.0,
      trend: "same",
      trendNote: "Neutral",
      signature: "Mysterious Aura",
      bio: "A newly detected anomaly in the Looksmaxxing multiverse. The IVRA is currently evaluating their threat potential.",
      titles: ["Rookie Threat"],
    };

    setVillains([...villains, newVillain]);
    setSelectedIdx(villains.length);
    toast.success("Summoned a new villain into the archives.");
  };

  // Edit fields for selected villain
  const updateSelectedField = (field: keyof Villain, value: any) => {
    if (villains.length === 0) return;
    const newList = [...villains];
    newList[selectedIdx] = {
      ...newList[selectedIdx],
      [field]: value,
    };
    setVillains(newList);
  };

  // Title managers (Add/Delete)
  const addTitleTag = () => {
    if (!newTitle.trim()) return;
    const currentTitles = villains[selectedIdx]?.titles || [];
    if (currentTitles.includes(newTitle.trim())) {
      toast.warning("Title already exists for this villain.");
      return;
    }
    updateSelectedField("titles", [...currentTitles, newTitle.trim()]);
    setNewTitle("");
  };

  const removeTitleTag = (titleToRemove: string) => {
    const currentTitles = villains[selectedIdx]?.titles || [];
    updateSelectedField(
      "titles",
      currentTitles.filter((t) => t !== titleToRemove)
    );
  };

  // Image Upload handler (Base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file is too large. Max size is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        updateSelectedField("image", reader.result);
        toast.success("Photo uploaded successfully.");
      }
    };
    reader.readAsDataURL(file);
  };

  // News Image Upload handler (Base64)
  const handleNewsImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file is too large. Max size is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setNews((prev) => ({ ...prev, image: reader.result }));
        toast.success("Decree photo uploaded successfully.");
      }
    };
    reader.readAsDataURL(file);
  };

  // Add a new archive log
  const addArchiveLog = () => {
    const newLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      tag: "General Decree",
      title: "New Decree Title",
      summary: "Decree summary details go here.",
    };
    setNews((prev) => ({
      ...prev,
      archives: [newLog, ...(prev.archives || [])],
    }));
    toast.success("Added a new archive log.");
  };

  // Update a field in a specific archive log
  const updateArchiveLogField = (id: string, field: string, value: string) => {
    setNews((prev) => ({
      ...prev,
      archives: (prev.archives || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Delete a specific archive log
  const deleteArchiveLog = (id: string) => {
    setNews((prev) => ({
      ...prev,
      archives: (prev.archives || []).filter((item) => item.id !== id),
    }));
    toast.success("Banished log from the archives.");
  };

  // Save changes to Server (with client-side fallback)
  const saveAllChanges = async () => {
    setIsSaving(true);
    const payload = { villains, news };
    const savePromise = saveVillains({ data: payload, passcode });

    toast.promise(savePromise, {
      loading: "Transmitting rankings & decrees to the mainframe...",
      success: () => {
        // Also sync local storage so everything matches
        localStorage.setItem("villains_data", JSON.stringify(payload));
        setIsSaving(false);
        return "Rankings & decrees permanently secured on the server.";
      },
      error: (err) => {
        // Fallback to client-side localStorage
        localStorage.setItem("villains_data", JSON.stringify(payload));
        setIsSaving(false);
        console.warn("Server save failed, saved to browser storage instead:", err);
        return "Saved to browser storage (read-only environment fallback).";
      },
    });
  };

  // Reset to default villains list
  const resetToDefault = () => {
    if (confirm("Are you sure you want to reset the database? All custom modifications will be lost.")) {
      setVillains(defaultVillains);
      setNews(defaultNews);
      setSelectedIdx(0);
      localStorage.removeItem("villains_data");
      // Call save server function to reset file
      saveVillains({ data: { villains: defaultVillains, news: defaultNews }, passcode })
        .then(() => {
          toast.success("Database restored to defaults.");
        })
        .catch(() => {
          toast.info("Database reset in browser cache.");
        });
    }
  };

  // Render Lock Screen if unauthorized
  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-foreground bg-[var(--gradient-villain)]">
        <Toaster theme="dark" position="bottom-right" />
        <Card className="w-full max-w-md border-[oklch(0.58_0.22_25/0.4)] bg-[oklch(0.17_0.025_25/0.8)] backdrop-blur shadow-[var(--shadow-evil)] animate-in fade-in-50 zoom-in-95 duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[var(--gradient-blood)] shadow-[var(--shadow-evil)]">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-display text-2xl uppercase tracking-wider text-foreground">
              IVRA Mainframe
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs uppercase tracking-widest mt-1">
              International Villain Ranking Association
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode" className="text-sm font-semibold tracking-wider text-muted-foreground">
                  ENTER ACCESS CODE
                </Label>
                <Input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="border-border bg-background text-center text-lg font-black tracking-widest focus-visible:ring-primary"
                  autoFocus
                />
              </div>
              {authError && <p className="text-xs text-red-500 text-center font-semibold">{authError}</p>}
              <Button type="submit" className="w-full bg-[var(--gradient-blood)] font-bold text-primary-foreground hover:opacity-95">
                Unlock Files
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center border-t border-border/50 py-4">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">
              Authorized personnel only. Logs are recorded.
            </span>
            <Link to="/" className="mt-3 text-xs text-muted-foreground hover:text-foreground underline">
              ← Return to rankings
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Active Selected Villain data helper
  const selectedVillain = villains[selectedIdx] || null;

  // Compute stats
  const totalThreats = villains.length;
  const avgEvilScore = totalThreats > 0 ? villains.reduce((acc, v) => acc + v.evilScore, 0) / totalThreats : 0;
  const topThreat = villains.length > 0 ? villains.reduce((prev, curr) => (prev.evilScore > curr.evilScore ? prev : curr)) : null;

  return (
    <div className="min-h-screen text-foreground bg-[var(--gradient-villain)] bg-attachment-fixed pb-16">
      <Toaster theme="dark" position="bottom-right" />
      
      {/* Admin Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--gradient-blood)] shadow-[var(--shadow-evil)]">
              <Skull className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-xs font-bold tracking-widest text-primary">ADMIN DECREE</div>
              <div className="font-display text-sm font-black tracking-wider text-foreground">IVRA RANKING MANAGER</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-1 items-center">
              <Link
                to="/"
                activeProps={{ className: "text-[oklch(0.78_0.16_75)] font-bold bg-secondary/50" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="rounded-md px-3 py-1.5 text-xs transition hover:bg-secondary"
              >
                Rankings
              </Link>
              <Link
                to="/news"
                activeProps={{ className: "text-[oklch(0.78_0.16_75)] font-bold bg-secondary/50" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="rounded-md px-3 py-1.5 text-xs transition hover:bg-secondary"
              >
                Chronicles
              </Link>
              <Link
                to="/rules"
                activeProps={{ className: "text-[oklch(0.78_0.16_75)] font-bold bg-secondary/50" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="rounded-md px-3 py-1.5 text-xs transition hover:bg-secondary"
              >
                Rankings Work
              </Link>
            </nav>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs border-border bg-secondary hover:bg-destructive hover:text-destructive-foreground transition cursor-pointer"
            >
              Lock Panel
            </Button>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="mx-auto max-w-7xl px-6 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border bg-card/40 backdrop-blur p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monitored Threats</p>
            <h4 className="text-3xl font-black font-display text-foreground mt-1">{totalThreats}</h4>
          </div>
          <Flame className="h-8 w-8 text-primary opacity-60" />
        </Card>
        <Card className="border-border bg-card/40 backdrop-blur p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Average Evil Index</p>
            <h4 className="text-3xl font-black font-display text-primary mt-1">{avgEvilScore.toFixed(2)}</h4>
          </div>
          <ShieldAlert className="h-8 w-8 text-[oklch(0.78_0.16_75)] opacity-60" />
        </Card>
        <Card className="border-border bg-card/40 backdrop-blur p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Apex Antagonist</p>
            <h4 className="text-lg font-black font-display text-foreground mt-2 truncate max-w-[200px]">
              {topThreat ? topThreat.name : "None"}
            </h4>
          </div>
          <Sparkles className="h-8 w-8 text-yellow-500 opacity-60" />
        </Card>
      </section>

      {/* Dashboard Main Grid */}
      <main className="mx-auto max-w-7xl px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
          
          {/* LEFT COLUMN: List & Rank Controller */}
          <section className="space-y-4">
            <div className="flex items-center justify-between bg-card/20 border border-border/50 rounded-lg p-3">
              <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground">The Hierarchy</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetToDefault} className="h-8 text-xs gap-1 border-border">
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
                <Button variant="default" size="sm" onClick={addVillain} className="h-8 text-xs gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <Plus className="h-3.5 w-3.5" /> Summon
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {villains.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <Skull className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground text-sm">No villains are currently registered in the archives.</p>
                </div>
              ) : (
                villains.map((v, index) => {
                  const isSelected = selectedIdx === index;
                  return (
                    <div
                      key={`${v.name}-${v.rank}`}
                      onClick={() => setSelectedIdx(index)}
                      className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[oklch(0.78_0.16_75)] bg-[oklch(0.78_0.16_75/0.05)]"
                          : "border-border bg-card/30 hover:border-border-foreground/40 hover:bg-card/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail preview */}
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted border border-border/80 flex-shrink-0">
                          <img src={v.image} alt={v.name} className="h-full w-full object-cover grayscale-[20%]" />
                        </div>
                        <div className="min-w-0 leading-tight">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black tracking-tighter ${isSelected ? "text-[oklch(0.78_0.16_75)]" : "text-muted-foreground"}`}>
                              #{v.rank}
                            </span>
                            <h4 className="text-sm font-bold truncate text-foreground">{v.name}</h4>
                          </div>
                          <p className="text-[11px] text-primary truncate mt-0.5">"{v.alias}"</p>
                        </div>
                      </div>

                      {/* Rank Action Buttons */}
                      <div className="flex items-center gap-1.5 ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-20"
                          title="Move Rank Up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveDown(index)}
                          disabled={index === villains.length - 1}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-20"
                          title="Move Rank Down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteVillain(index)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          title="Banish (Delete)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Global Save */}
            <Button
              onClick={saveAllChanges}
              disabled={isSaving}
              className="w-full bg-[var(--gradient-blood)] font-bold text-primary-foreground hover:opacity-95 shadow-[var(--shadow-evil)] py-6 mt-6"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Locking changes..." : "SAVE ALL CHANGES"}
            </Button>
          </section>

          {/* RIGHT COLUMN: Edit Form Panel */}
          <section className="space-y-4">
            {/* Tabs Control */}
            <div className="flex gap-2 border-b border-border pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("dossier")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition cursor-pointer ${
                  activeTab === "dossier"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/45"
                }`}
              >
                Edit Dossier
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("news")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition cursor-pointer ${
                  activeTab === "news"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/45"
                }`}
              >
                News & Decrees
              </button>
            </div>

            {activeTab === "dossier" ? (
              selectedVillain ? (
                <Card className="border-border bg-card/30 backdrop-blur shadow-[var(--shadow-evil)]">
                  <CardHeader className="border-b border-border/50 py-4 flex flex-row items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-border flex-shrink-0 bg-muted">
                      <img src={selectedVillain.image} alt={selectedVillain.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground">
                        Edit File: {selectedVillain.name}
                      </CardTitle>
                      <CardDescription className="text-xs uppercase tracking-widest text-primary">
                        Ranked #{selectedVillain.rank} · Alias "{selectedVillain.alias}"
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    
                    {/* Identity Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="v-name" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                          Villain Name
                        </Label>
                        <Input
                          id="v-name"
                          value={selectedVillain.name}
                          onChange={(e) => updateSelectedField("name", e.target.value)}
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="v-alias" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                          Codename / Alias
                        </Label>
                        <Input
                          id="v-alias"
                          value={selectedVillain.alias}
                          onChange={(e) => updateSelectedField("alias", e.target.value)}
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    {/* Metrics and Score */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="v-score" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                          Evil Score (0 - 10)
                        </Label>
                        <Input
                          id="v-score"
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={selectedVillain.evilScore}
                          onChange={(e) => updateSelectedField("evilScore", parseFloat(e.target.value) || 0)}
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                          Trend Direction
                        </Label>
                        <Select
                          value={selectedVillain.trend}
                          onValueChange={(val) => updateSelectedField("trend", val)}
                        >
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select trend" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="up">Up (Ascending)</SelectItem>
                            <SelectItem value="down">Down (Descending)</SelectItem>
                            <SelectItem value="same">Same (Stable)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="v-trendnote" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                          Trend Note (e.g. +2 slots)
                        </Label>
                        <Input
                          id="v-trendnote"
                          value={selectedVillain.trendNote}
                          onChange={(e) => updateSelectedField("trendNote", e.target.value)}
                          placeholder="e.g. Ascending"
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    {/* Character Traits */}
                    <div className="space-y-2">
                      <Label htmlFor="v-sig" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Signature Move
                      </Label>
                      <Input
                        id="v-sig"
                        value={selectedVillain.signature}
                        onChange={(e) => updateSelectedField("signature", e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="v-bio" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Description / Dossier Bio
                      </Label>
                      <Textarea
                        id="v-bio"
                        rows={4}
                        value={selectedVillain.bio}
                        onChange={(e) => updateSelectedField("bio", e.target.value)}
                        className="bg-background border-border resize-none"
                      />
                    </div>

                    {/* Photo Manager */}
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Dossier Photo
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-center border border-border bg-background/50 p-3 rounded-lg">
                        <div className="relative h-28 w-28 mx-auto md:mx-0 rounded-md overflow-hidden bg-muted border border-border group/photo">
                          <img src={selectedVillain.image} alt={selectedVillain.name} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center text-[10px] text-white font-semibold transition cursor-pointer"
                          >
                            <Upload className="h-4 w-4 mb-1" />
                            Upload JPG
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="v-img-url" className="text-[10px] uppercase font-bold text-muted-foreground">
                              IMAGE URL
                            </Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                id="v-img-url"
                                value={selectedVillain.image.startsWith("data:") ? "" : selectedVillain.image}
                                onChange={(e) => updateSelectedField("image", e.target.value)}
                                placeholder="Paste external image URL..."
                                className="bg-background border-border h-9 text-xs"
                              />
                              {selectedVillain.image.startsWith("data:") && (
                                <Badge variant="outline" className="border-primary/40 text-primary text-[10px] self-center flex-shrink-0">
                                  Inlined (Base64)
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageFileChange}
                              accept="image/png, image/jpeg, image/jpg"
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="h-8 text-xs gap-1.5 border-border bg-secondary"
                            >
                              <Upload className="h-3.5 w-3.5" /> Upload File
                            </Button>
                            <span className="text-[10px] text-muted-foreground">PNG/JPG (Max 2MB)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title Tags Manager */}
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Titles & Accolades
                      </Label>
                      <div className="flex flex-wrap gap-1.5 border border-border bg-background/50 p-2.5 rounded-lg min-h-[44px]">
                        {(selectedVillain.titles || []).map((title) => (
                          <Badge
                            key={title}
                            className="bg-[oklch(0.58_0.22_25/0.15)] hover:bg-[oklch(0.58_0.22_25/0.25)] border border-[oklch(0.58_0.22_25/0.4)] text-primary-foreground pr-1 flex items-center gap-1 text-[11px] font-medium tracking-wide"
                          >
                            {title}
                            <button
                              type="button"
                              onClick={() => removeTitleTag(title)}
                              className="hover:bg-primary/20 rounded-full p-0.5 text-primary hover:text-foreground transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(selectedVillain.titles || []).length === 0 && (
                          <span className="text-xs text-muted-foreground italic self-center">No titles. Add one below.</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Add new title (e.g. Overlord)..."
                          className="bg-background border-border text-xs h-9"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTitleTag();
                            }
                          }}
                        />
                        <Button type="button" size="sm" onClick={addTitleTag} className="bg-secondary border border-border h-9 px-3">
                          Add
                        </Button>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/10">
                  <Skull className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                  <h3 className="font-display text-lg font-bold">No Villain Selected</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-2">
                    Select a villain from the left panel or click "Summon" to create a new profile.
                  </p>
                </div>
              )
            ) : (
              <Card className="border-border bg-card/30 backdrop-blur shadow-[var(--shadow-evil)] animate-in fade-in-50 duration-200">
                <CardHeader className="border-b border-border/50 py-4 flex flex-row items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--gradient-blood)] shadow-[var(--shadow-evil)] flex-shrink-0">
                    <Flame className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      Edit News & Decrees
                    </CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest text-primary">
                      Broadcast announcements and archive historical logs
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Active Decree Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                        Active Breaking Decree
                      </h3>
                      {(news.title || news.content || news.image) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to clear/delete the active breaking decree?")) {
                              setNews((prev) => ({ ...prev, title: "", content: "", image: "" }));
                              toast.success("Active decree cleared.");
                            }
                          }}
                          className="text-[10px] font-semibold text-red-500 hover:text-red-400 hover:underline cursor-pointer"
                        >
                          Clear Active Decree
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-title" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Decree Title
                      </Label>
                      <Input
                        id="news-title"
                        value={news.title}
                        onChange={(e) => setNews({ ...news, title: e.target.value })}
                        className="bg-background border-border text-sm"
                        placeholder="e.g. Larcom Ascends — Latham Watches in Silence"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-content" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Decree Content Description
                      </Label>
                      <Textarea
                        id="news-content"
                        rows={4}
                        value={news.content}
                        onChange={(e) => setNews({ ...news, content: e.target.value })}
                        className="bg-background border-border text-sm resize-none"
                        placeholder="Enter breaking news detail text here..."
                      />
                    </div>
                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">
                        Decree Photo / Visual Media
                      </Label>
                      <div className="flex flex-wrap items-center gap-4">
                        {news.image ? (
                          <div className="relative h-20 w-36 overflow-hidden rounded-md border border-border bg-black">
                            <img src={news.image} className="h-full w-full object-cover" alt="Decree preview" />
                            <button
                              type="button"
                              onClick={() => setNews((prev) => ({ ...prev, image: "" }))}
                              className="absolute right-1 top-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-red-400 border border-red-900 transition hover:bg-red-950 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="h-20 w-36 rounded-md border border-dashed border-border bg-background/50 flex flex-col items-center justify-center text-muted-foreground text-[10px] italic">
                            No Photo Attached
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            ref={newsImageInputRef}
                            onChange={handleNewsImageFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => newsImageInputRef.current?.click()}
                            className="text-xs border-border bg-secondary hover:bg-accent cursor-pointer"
                          >
                            Upload Photo
                          </Button>
                          <p className="mt-1 text-[10px] text-muted-foreground">Max file size: 2MB. 16:9 recommended.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Archives Editor Section */}
                  <div className="border-t border-border/50 pt-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/30 pb-2">
                      <div>
                        <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                          Decree Archives (History Log)
                        </h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Manage chronological logs displayed on the News tab</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={addArchiveLog}
                        className="bg-secondary text-foreground hover:bg-accent text-xs font-semibold h-8 cursor-pointer"
                      >
                        + Add Archive Log
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {(news.archives || []).length === 0 ? (
                        <div className="text-center py-8 text-xs text-muted-foreground italic border border-dashed border-border rounded-lg">
                          No archive logs registered. Click "+ Add Archive Log" to add one.
                        </div>
                      ) : (
                        (news.archives || []).map((log, index) => (
                          <div key={log.id} className="p-4 rounded-lg border border-border bg-background/45 space-y-3 relative">
                            <div className="flex items-center justify-between border-b border-border/20 pb-1.5">
                              <span className="text-[10px] font-bold text-primary uppercase bg-[oklch(0.58_0.22_25/0.15)] px-2 py-0.5 rounded border border-[oklch(0.58_0.22_25/0.3)]">
                                Archive Item #{index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => deleteArchiveLog(log.id)}
                                className="text-[10px] font-semibold text-red-500 hover:text-red-400 hover:underline cursor-pointer"
                              >
                                Delete Log
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Date</Label>
                                <Input
                                  value={log.date}
                                  onChange={(e) => updateArchiveLogField(log.id, "date", e.target.value)}
                                  className="bg-background border-border text-xs h-8"
                                  placeholder="e.g. May 12, 2026"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Category/Tag</Label>
                                <Input
                                  value={log.tag}
                                  onChange={(e) => updateArchiveLogField(log.id, "tag", e.target.value)}
                                  className="bg-background border-border text-xs h-8"
                                  placeholder="e.g. Council Accord"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Title</Label>
                              <Input
                                value={log.title}
                                onChange={(e) => updateArchiveLogField(log.id, "title", e.target.value)}
                                className="bg-background border-border text-xs h-8"
                                placeholder="Archive Decree Title"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Summary details</Label>
                              <Textarea
                                value={log.summary}
                                onChange={(e) => updateArchiveLogField(log.id, "summary", e.target.value)}
                                className="bg-background border-border text-xs resize-none"
                                rows={2}
                                placeholder="Details regarding the event..."
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
