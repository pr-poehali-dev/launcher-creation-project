import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const HERO_IMG = "https://cdn.poehali.dev/projects/d3888ee6-1c93-4240-97d7-64d28b4c0960/files/db3a5cb4-41c3-495e-8f29-6a1beb46f549.jpg";

const GAMES = [
  { id: 1, title: "Neon Abyss", genre: "Roguelite", hours: 142, progress: 78, status: "installed", rating: 9.2 },
  { id: 2, title: "Cyber Protocol", genre: "Экшен", hours: 87, progress: 45, status: "installed", rating: 8.7 },
  { id: 3, title: "Void Runner", genre: "Шутер", hours: 230, progress: 92, status: "installed", rating: 9.5 },
  { id: 4, title: "Dark Orbit X", genre: "RPG", hours: 56, progress: 31, status: "installed", rating: 7.9 },
  { id: 5, title: "Pulse Drive", genre: "Гонки", hours: 18, progress: 12, status: "update", rating: 8.1 },
  { id: 6, title: "Echo Chamber", genre: "Стратегия", hours: 310, progress: 100, status: "installed", rating: 9.8 },
];

const ACHIEVEMENTS = [
  { id: 1, icon: "🏆", title: "Легенда Арены", desc: "Победи в 100 матчах", progress: 87, max: 100, rarity: "Легендарный", earned: false, color: "#ffd700" },
  { id: 2, icon: "⚡", title: "Молния", desc: "Завершить матч за 5 минут", progress: 1, max: 1, rarity: "Редкий", earned: true, color: "#00f5ff" },
  { id: 3, icon: "💀", title: "Несокрушимый", desc: "Пройти без смертей", progress: 0, max: 1, rarity: "Эпический", earned: false, color: "#bf5fff" },
  { id: 4, icon: "🎯", title: "Снайпер", desc: "1000 точных выстрелов", progress: 743, max: 1000, rarity: "Обычный", earned: false, color: "#00ff88" },
  { id: 5, icon: "🔥", title: "На горячих углях", desc: "7 дней подряд в игре", progress: 7, max: 7, rarity: "Редкий", earned: true, color: "#ff2d78" },
  { id: 6, icon: "🌟", title: "Всевидящий", desc: "Открой всю карту мира", progress: 42, max: 100, rarity: "Эпический", earned: false, color: "#bf5fff" },
];

const FRIENDS = [
  { id: 1, name: "CyberWolf", level: 47, status: "playing", game: "Void Runner", avatar: "CW" },
  { id: 2, name: "NeonHunter", level: 82, status: "online", game: null, avatar: "NH" },
  { id: 3, name: "DarkPhantom", level: 31, status: "playing", game: "Neon Abyss", avatar: "DP" },
  { id: 4, name: "PulseRider", level: 64, status: "offline", game: null, avatar: "PR" },
  { id: 5, name: "VoidStar", level: 99, status: "playing", game: "Echo Chamber", avatar: "VS" },
  { id: 6, name: "GlitchMaster", level: 55, status: "online", game: null, avatar: "GM" },
];

const CHAT_MESSAGES = [
  { id: 1, user: "CyberWolf", text: "Кто-нибудь в Void Runner? Нужен тиммейт", time: "14:23", avatar: "CW", isMe: false },
  { id: 2, user: "VoidStar", text: "Я уже там, заходи в лобби", time: "14:24", avatar: "VS", isMe: false },
  { id: 3, user: "NeonHunter", text: "Гляньте новый патч — нерфанули снайперов", time: "14:25", avatar: "NH", isMe: false },
  { id: 4, user: "DarkPhantom", text: "Наконец-то 😂 теперь хоть честно", time: "14:26", avatar: "DP", isMe: false },
  { id: 5, user: "Я", text: "Когда следующий ивент?", time: "14:27", avatar: "ME", isMe: true },
  { id: 6, user: "VoidStar", text: "В пятницу старт, не пропусти", time: "14:28", avatar: "VS", isMe: false },
];

const SHOP_ITEMS = [
  { id: 1, name: "Скин Неоновый Призрак", type: "Скин", price: 1200, oldPrice: 1800, hot: true },
  { id: 2, name: "Набор иконок Киберпанк", type: "Комплект", price: 450, oldPrice: null, hot: false },
  { id: 3, name: "Бустер опыта x2 (7 дней)", type: "Буст", price: 300, oldPrice: null, hot: false },
  { id: 4, name: "Боевой пропуск Сезон 12", type: "Пропуск", price: 950, oldPrice: 1200, hot: true },
];

const TROPHIES = [
  { icon: "🥇", title: "Золото", count: 3, color: "#ffd700" },
  { icon: "🥈", title: "Серебро", count: 12, color: "#c0c0c0" },
  { icon: "🥉", title: "Бронза", count: 28, color: "#cd7f32" },
  { icon: "💎", title: "Платина", count: 1, color: "#00f5ff" },
];

const NAV = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "library", label: "Библиотека", icon: "Gamepad2" },
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "friends", label: "Друзья", icon: "Users" },
  { id: "achievements", label: "Достижения", icon: "Trophy" },
  { id: "store", label: "Магазин", icon: "ShoppingBag" },
  { id: "chat", label: "Чат", icon: "MessageSquare" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = { playing: "#00ff88", online: "#00f5ff", offline: "#444" };
  const c = colors[status] || "#444";
  return (
    <span className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: c, boxShadow: status !== "offline" ? `0 0 6px ${c}` : "none" }} />
  );
}

function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    "Легендарный": "#ffd700", "Эпический": "#bf5fff", "Редкий": "#00f5ff", "Обычный": "#00ff88"
  };
  const c = colors[rarity] || "#888";
  return (
    <span className="text-xs font-orbitron px-2 py-0.5 rounded" style={{ color: c, border: `1px solid ${c}33`, background: `${c}11` }}>
      {rarity}
    </span>
  );
}

function NeonProgress({ value, color = "cyan" }: { value: number; color?: string }) {
  const grad = color === "gold" ? "#ffd700" : color === "pink" ? "#ff2d78" : "linear-gradient(90deg, #00f5ff, #bf5fff)";
  const glow = color === "gold" ? "rgba(255,215,0,0.5)" : "rgba(0,245,255,0.4)";
  return (
    <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: grad, boxShadow: `0 0 8px ${glow}` }} />
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(CHAT_MESSAGES);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    setMessages(prev => [...prev, {
      id: Date.now(), user: "Я", text: chatInput,
      time: now.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      avatar: "ME", isMe: true
    }]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen grid-bg scanlines" style={{ background: "linear-gradient(135deg, #060b12 0%, #0a0f1e 60%, #06091a 100%)" }}>

      {/* TOPBAR */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(6,11,18,0.96)", borderBottom: "1px solid rgba(0,245,255,0.12)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #00f5ff, #bf5fff)", boxShadow: "0 0 15px rgba(0,245,255,0.5)" }}>
            <span className="font-orbitron font-black text-black text-xs">NX</span>
          </div>
          <span className="font-orbitron font-bold text-lg tracking-widest"
            style={{ color: "#00f5ff", textShadow: "0 0 15px rgba(0,245,255,0.7)" }}>NEXUS</span>
          <span className="font-mono text-xs hidden sm:block" style={{ color: "rgba(0,245,255,0.35)" }}>v2.4.1</span>
        </div>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className="nav-item flex items-center gap-1.5 px-3 py-2 text-xs font-rajdhani font-semibold tracking-wider rounded-sm transition-all"
              style={{ color: activeTab === item.id ? "#00f5ff" : "rgba(160,190,210,0.55)", fontFamily: "Rajdhani, sans-serif" }}>
              <Icon name={item.icon} size={13} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile nav */}
        <div className="flex lg:hidden gap-1">
          {NAV.slice(0, 4).map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className="p-2 rounded transition-all"
              style={{ color: activeTab === item.id ? "#00f5ff" : "rgba(160,190,210,0.5)", background: activeTab === item.id ? "rgba(0,245,255,0.08)" : "transparent" }}>
              <Icon name={item.icon} size={16} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded"
            style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)" }}>
            <Icon name="Coins" size={13} style={{ color: "#ffd700" }} />
            <span className="font-mono text-sm" style={{ color: "#ffd700" }}>4,820</span>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs cursor-pointer"
            style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(191,95,255,0.15))", border: "1px solid rgba(0,245,255,0.3)", color: "#00f5ff" }}>
            GX
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">

        {/* ─── HOME ─── */}
        {activeTab === "home" && (
          <div className="space-y-5 animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 280 }}>
              <img src={HERO_IMG} alt="hero" className="w-full h-72 object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(6,11,18,0.97) 35%, rgba(6,11,18,0.3) 100%)" }} />
              <div className="absolute inset-0 flex flex-col justify-center px-8">
                <div className="font-mono text-xs mb-2 animate-pulse-neon" style={{ color: "#00ff88" }}>● РЕКОМЕНДУЕТСЯ ДЛЯ ВАС</div>
                <h1 className="font-orbitron font-black text-3xl md:text-4xl mb-2" style={{ color: "#fff", textShadow: "0 0 30px rgba(0,245,255,0.5)" }}>VOID RUNNER</h1>
                <p className="font-rajdhani text-base md:text-lg mb-5" style={{ color: "rgba(180,210,230,0.8)" }}>Шутер нового поколения · Сезон 4 активен</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveTab("library")}
                    className="flex items-center gap-2 px-5 py-2.5 font-orbitron font-bold text-sm tracking-wider rounded-lg"
                    style={{ background: "linear-gradient(135deg, #00f5ff, #00c8d4)", color: "#000", boxShadow: "0 0 20px rgba(0,245,255,0.4)" }}>
                    <Icon name="Play" size={15} /> ИГРАТЬ
                  </button>
                  <button className="px-5 py-2.5 font-orbitron font-semibold text-sm tracking-wider rounded-lg"
                    style={{ border: "1px solid rgba(0,245,255,0.35)", color: "#00f5ff", background: "rgba(0,245,255,0.05)" }}>
                    ПОДРОБНЕЕ
                  </button>
                </div>
              </div>
              <div className="absolute top-4 right-4 font-orbitron text-2xl font-bold"
                style={{ color: "#ffd700", textShadow: "0 0 15px rgba(255,215,0,0.6)" }}>9.5 ★</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Часов в игре", value: "843", icon: "Clock", color: "#00f5ff" },
                { label: "Достижений", value: "47/120", icon: "Trophy", color: "#ffd700" },
                { label: "Уровень", value: "64", icon: "Zap", color: "#bf5fff" },
                { label: "Друзей онлайн", value: "3", icon: "Users", color: "#00ff88" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl"
                  style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.1)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={stat.icon} size={15} style={{ color: stat.color }} />
                    <span className="font-rajdhani text-xs" style={{ color: "rgba(150,180,200,0.65)" }}>{stat.label}</span>
                  </div>
                  <div className="font-orbitron font-bold text-xl md:text-2xl"
                    style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}55` }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-orbitron font-bold text-xs tracking-widest" style={{ color: "rgba(0,245,255,0.6)" }}>НЕДАВНО ИГРАННЫЕ</h2>
                <button onClick={() => setActiveTab("library")} className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>все →</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {GAMES.slice(0, 3).map(game => (
                  <div key={game.id} className="game-card rounded-xl overflow-hidden cursor-pointer"
                    style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.1)" }}>
                    <div className="relative h-24">
                      <img src={HERO_IMG} alt={game.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,18,32,1), transparent 60%)" }} />
                      {game.status === "update" && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-orbitron font-bold" style={{ background: "#ff2d78", color: "#fff" }}>UP</div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="font-orbitron font-bold text-sm mb-1" style={{ color: "#e0f0ff" }}>{game.title}</div>
                      <div className="flex items-center justify-between text-xs mb-2" style={{ color: "rgba(150,180,200,0.55)" }}>
                        <span>{game.genre}</span><span>{game.hours}ч</span>
                      </div>
                      <NeonProgress value={game.progress} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── LIBRARY ─── */}
        {activeTab === "library" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-orbitron font-bold text-lg" style={{ color: "#00f5ff", textShadow: "0 0 15px rgba(0,245,255,0.4)" }}>БИБЛИОТЕКА</h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.15)" }}>
                <Icon name="Search" size={13} style={{ color: "rgba(0,245,255,0.5)" }} />
                <input placeholder="Поиск игр..." className="bg-transparent text-sm outline-none"
                  style={{ color: "#e0f0ff", width: 140, fontFamily: "Rajdhani" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {GAMES.map(game => (
                <div key={game.id} className="game-card rounded-xl overflow-hidden cursor-pointer"
                  style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.1)" }}>
                  <div className="relative h-32">
                    <img src={HERO_IMG} alt={game.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,18,32,1), transparent 55%)" }} />
                    <div className="absolute top-2 right-2 font-orbitron text-xs font-bold" style={{ color: "#ffd700" }}>★ {game.rating}</div>
                    {game.status === "update" && (
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-orbitron font-bold" style={{ background: "#ff2d78", color: "#fff" }}>UPDATE</div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-orbitron font-bold text-sm mb-0.5" style={{ color: "#e0f0ff" }}>{game.title}</div>
                    <div className="font-rajdhani text-xs mb-2" style={{ color: "rgba(150,180,200,0.55)" }}>{game.genre} · {game.hours}ч</div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <NeonProgress value={game.progress} />
                      <span className="font-mono text-xs whitespace-nowrap" style={{ color: "rgba(0,245,255,0.55)" }}>{game.progress}%</span>
                    </div>
                    <button className="w-full py-1.5 rounded-lg text-xs font-orbitron font-bold tracking-wider"
                      style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.12), rgba(191,95,255,0.12))", border: "1px solid rgba(0,245,255,0.25)", color: "#00f5ff" }}>
                      {game.status === "update" ? "ОБНОВИТЬ" : "ИГРАТЬ"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PROFILE ─── */}
        {activeTab === "profile" && (
          <div className="animate-fade-in space-y-5">
            <div className="relative rounded-2xl overflow-hidden p-5"
              style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.15)" }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.03), rgba(191,95,255,0.03))" }} />
              <div className="relative flex items-start gap-5">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center font-orbitron font-black text-2xl"
                    style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.18), rgba(191,95,255,0.18))", border: "2px solid rgba(0,245,255,0.4)", color: "#00f5ff", boxShadow: "0 0 25px rgba(0,245,255,0.25)" }}>
                    GX
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="font-orbitron font-black text-xl md:text-2xl" style={{ color: "#fff" }}>GalaxPlayer</h1>
                    <span className="px-2 py-0.5 rounded font-orbitron text-xs font-bold" style={{ background: "rgba(191,95,255,0.18)", color: "#bf5fff", border: "1px solid rgba(191,95,255,0.3)" }}>PRO</span>
                  </div>
                  <div className="font-mono text-xs mb-3" style={{ color: "rgba(0,245,255,0.55)" }}>@galaxplayer · С нами с 2021</div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron font-bold text-lg" style={{ color: "#00f5ff" }}>64</span>
                      <span className="font-rajdhani text-sm" style={{ color: "rgba(150,180,200,0.6)" }}>Уровень</span>
                    </div>
                    <div>
                      <div className="font-rajdhani text-xs mb-1" style={{ color: "rgba(150,180,200,0.45)" }}>До уровня 65</div>
                      <div className="flex items-center gap-2">
                        <div className="w-28 rounded-full h-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <div className="h-2 rounded-full" style={{ width: "67%", background: "linear-gradient(90deg, #00f5ff, #bf5fff)", boxShadow: "0 0 8px rgba(0,245,255,0.4)" }} />
                        </div>
                        <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.55)" }}>67%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-xs mb-1" style={{ color: "rgba(150,180,200,0.45)" }}>РЕЙТИНГ</div>
                  <div className="font-orbitron font-black text-3xl" style={{ color: "#ffd700", textShadow: "0 0 15px rgba(255,215,0,0.45)" }}>#847</div>
                  <div className="font-rajdhani text-xs" style={{ color: "rgba(150,180,200,0.45)" }}>из 1.2M</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-orbitron font-bold text-xs tracking-widest mb-3" style={{ color: "rgba(0,245,255,0.55)" }}>ТРОФЕИ</h2>
              <div className="grid grid-cols-4 gap-3">
                {TROPHIES.map(t => (
                  <div key={t.title} className="p-4 rounded-xl text-center"
                    style={{ background: "rgba(13,18,32,0.85)", border: `1px solid ${t.color}1a` }}>
                    <div className="text-2xl mb-1">{t.icon}</div>
                    <div className="font-orbitron font-black text-xl mb-1" style={{ color: t.color, textShadow: `0 0 8px ${t.color}55` }}>{t.count}</div>
                    <div className="font-rajdhani text-xs" style={{ color: "rgba(150,180,200,0.55)" }}>{t.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-orbitron font-bold text-xs tracking-widest mb-3" style={{ color: "rgba(0,245,255,0.55)" }}>ТОП ИГРЫ</h2>
              <div className="space-y-2">
                {[...GAMES].sort((a, b) => b.hours - a.hours).slice(0, 4).map((game, i) => (
                  <div key={game.id} className="flex items-center gap-4 p-3 rounded-xl"
                    style={{ background: "rgba(13,18,32,0.7)", border: "1px solid rgba(0,245,255,0.07)" }}>
                    <span className="font-orbitron font-bold w-5 text-sm" style={{ color: i === 0 ? "#ffd700" : "rgba(150,180,200,0.35)" }}>#{i + 1}</span>
                    <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={HERO_IMG} alt={game.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-orbitron font-bold text-sm mb-1 truncate" style={{ color: "#e0f0ff" }}>{game.title}</div>
                      <div className="flex items-center gap-2">
                        <NeonProgress value={(game.hours / 310) * 100} />
                        <span className="font-mono text-xs whitespace-nowrap" style={{ color: "rgba(0,245,255,0.55)" }}>{game.hours}ч</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── FRIENDS ─── */}
        {activeTab === "friends" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-orbitron font-bold text-lg" style={{ color: "#00f5ff", textShadow: "0 0 15px rgba(0,245,255,0.4)" }}>ДРУЗЬЯ</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs font-bold tracking-wider"
                style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.25)", color: "#00f5ff" }}>
                <Icon name="UserPlus" size={13} /> ДОБАВИТЬ
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FRIENDS.map(friend => (
                <div key={friend.id} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                  style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.08)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,245,255,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(0,245,255,0.08)")}>
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-orbitron font-bold text-sm"
                      style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.12), rgba(191,95,255,0.12))", border: "1px solid rgba(0,245,255,0.2)", color: "#00f5ff" }}>
                      {friend.avatar}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <StatusDot status={friend.status} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-orbitron font-bold text-sm" style={{ color: "#e0f0ff" }}>{friend.name}</span>
                      <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.5)" }}>Lv.{friend.level}</span>
                    </div>
                    <div className="font-rajdhani text-sm truncate"
                      style={{ color: friend.status === "offline" ? "rgba(150,180,200,0.35)" : "rgba(150,180,200,0.7)" }}>
                      {friend.status === "playing" ? `🎮 ${friend.game}` : friend.status === "online" ? "В сети" : "Не в сети"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {friend.status !== "offline" && (
                      <button className="p-2 rounded-lg" style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.15)", color: "#00f5ff" }}>
                        <Icon name="MessageSquare" size={13} />
                      </button>
                    )}
                    {friend.status === "playing" && (
                      <button className="p-2 rounded-lg" style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)", color: "#00ff88" }}>
                        <Icon name="UserCheck" size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ACHIEVEMENTS ─── */}
        {activeTab === "achievements" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-orbitron font-bold text-lg" style={{ color: "#00f5ff", textShadow: "0 0 15px rgba(0,245,255,0.4)" }}>ДОСТИЖЕНИЯ</h2>
              <span className="font-orbitron text-sm" style={{ color: "rgba(150,180,200,0.55)" }}>47 / 120</span>
            </div>
            <div className="p-4 rounded-xl mb-5" style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.15)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-orbitron font-bold text-sm" style={{ color: "#e0f0ff" }}>Общий прогресс</span>
                <span className="font-mono text-sm" style={{ color: "#00f5ff" }}>39.2%</span>
              </div>
              <div className="w-full rounded-full h-3 mb-3" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-3 rounded-full" style={{ width: "39.2%", background: "linear-gradient(90deg, #00f5ff, #bf5fff)", boxShadow: "0 0 12px rgba(0,245,255,0.45)" }} />
              </div>
              <div className="flex gap-5">
                {TROPHIES.map(t => (
                  <div key={t.title} className="flex items-center gap-1.5">
                    <span className="text-base">{t.icon}</span>
                    <span className="font-orbitron font-bold text-sm" style={{ color: t.color }}>{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ACHIEVEMENTS.map(ach => (
                <div key={ach.id} className="p-4 rounded-xl"
                  style={{ background: "rgba(13,18,32,0.85)", border: `1px solid ${ach.earned ? ach.color + "33" : "rgba(0,245,255,0.07)"}` }}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ background: ach.earned ? `${ach.color}18` : "rgba(255,255,255,0.04)", border: `1px solid ${ach.earned ? ach.color + "33" : "rgba(255,255,255,0.07)"}` }}>
                      {ach.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-orbitron font-bold text-sm" style={{ color: ach.earned ? ach.color : "#e0f0ff" }}>{ach.title}</span>
                        <RarityBadge rarity={ach.rarity} />
                        {ach.earned && <span className="text-xs" style={{ color: "#00ff88" }}>✓</span>}
                      </div>
                      <div className="font-rajdhani text-sm mb-2" style={{ color: "rgba(150,180,200,0.55)" }}>{ach.desc}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                          <div className="h-1.5 rounded-full" style={{
                            width: `${(ach.progress / ach.max) * 100}%`,
                            background: ach.earned ? ach.color : "linear-gradient(90deg, #00f5ff, #bf5fff)",
                            boxShadow: `0 0 6px ${ach.color}66`
                          }} />
                        </div>
                        <span className="font-mono text-xs whitespace-nowrap" style={{ color: "rgba(0,245,255,0.55)" }}>{ach.progress}/{ach.max}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── STORE ─── */}
        {activeTab === "store" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-orbitron font-bold text-lg" style={{ color: "#00f5ff", textShadow: "0 0 15px rgba(0,245,255,0.4)" }}>МАГАЗИН</h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)" }}>
                <Icon name="Coins" size={13} style={{ color: "#ffd700" }} />
                <span className="font-orbitron font-bold text-sm" style={{ color: "#ffd700" }}>4,820</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SHOP_ITEMS.map(item => (
                <div key={item.id} className="game-card rounded-xl overflow-hidden"
                  style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.1)" }}>
                  <div className="relative h-36">
                    <img src={HERO_IMG} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,18,32,1), transparent 55%)" }} />
                    {item.hot && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-orbitron font-bold"
                        style={{ background: "#ff2d78", color: "#fff", boxShadow: "0 0 10px rgba(255,45,120,0.5)" }}>🔥 ХИТ</div>
                    )}
                    {item.oldPrice && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-orbitron font-bold"
                        style={{ background: "#00ff88", color: "#000" }}>
                        -{Math.round((1 - item.price / item.oldPrice) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-mono text-xs mb-0.5" style={{ color: "rgba(0,245,255,0.45)" }}>{item.type}</div>
                    <div className="font-orbitron font-bold text-sm mb-3" style={{ color: "#e0f0ff" }}>{item.name}</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-orbitron font-bold" style={{ color: "#ffd700" }}>{item.price.toLocaleString("ru")}</span>
                          <Icon name="Coins" size={12} style={{ color: "#ffd700" }} />
                        </div>
                        {item.oldPrice && <div className="font-mono text-xs line-through" style={{ color: "rgba(150,180,200,0.35)" }}>{item.oldPrice}</div>}
                      </div>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold"
                        style={{ background: "linear-gradient(135deg, #00f5ff, #00c8d4)", color: "#000", boxShadow: "0 0 12px rgba(0,245,255,0.3)" }}>
                        КУПИТЬ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── CHAT ─── */}
        {activeTab === "chat" && (
          <div className="animate-fade-in flex flex-col" style={{ height: "calc(100vh - 130px)" }}>
            <h2 className="font-orbitron font-bold text-lg mb-4" style={{ color: "#00f5ff", textShadow: "0 0 15px rgba(0,245,255,0.4)" }}>ЧАТ СООБЩЕСТВА</h2>
            <div className="flex-1 rounded-xl p-4 overflow-y-auto space-y-3 mb-3"
              style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.1)" }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs flex-shrink-0"
                    style={{ background: msg.isMe ? "rgba(0,245,255,0.2)" : "rgba(255,255,255,0.06)", color: "#00f5ff", border: "1px solid rgba(0,245,255,0.2)" }}>
                    {msg.avatar}
                  </div>
                  <div className={`max-w-xs flex flex-col gap-0.5 ${msg.isMe ? "items-end" : "items-start"}`}>
                    <div className={`flex items-center gap-2 ${msg.isMe ? "flex-row-reverse" : ""}`}>
                      <span className="font-orbitron text-xs font-bold" style={{ color: msg.isMe ? "#00f5ff" : "#bf5fff" }}>{msg.user}</span>
                      <span className="font-mono text-xs" style={{ color: "rgba(150,180,200,0.38)" }}>{msg.time}</span>
                    </div>
                    <div className="px-3 py-2 rounded-xl font-rajdhani text-sm"
                      style={{
                        background: msg.isMe ? "rgba(0,245,255,0.1)" : "rgba(255,255,255,0.05)",
                        border: msg.isMe ? "1px solid rgba(0,245,255,0.22)" : "1px solid rgba(255,255,255,0.07)",
                        color: "#e0f0ff"
                      }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Написать сообщение..."
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.15)", color: "#e0f0ff", fontFamily: "Rajdhani" }} />
              <button onClick={sendMessage} className="px-4 py-3 rounded-xl"
                style={{ background: "linear-gradient(135deg, #00f5ff, #00c8d4)", color: "#000", boxShadow: "0 0 15px rgba(0,245,255,0.3)" }}>
                <Icon name="Send" size={17} />
              </button>
            </div>
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {activeTab === "settings" && (
          <div className="animate-fade-in space-y-5">
            <h2 className="font-orbitron font-bold text-lg" style={{ color: "#00f5ff", textShadow: "0 0 15px rgba(0,245,255,0.4)" }}>НАСТРОЙКИ</h2>
            {[
              { section: "Аккаунт", items: [
                { label: "Имя пользователя", value: "GalaxPlayer", icon: "User" },
                { label: "Email", value: "galaxplayer@nexus.gg", icon: "Mail" },
                { label: "Статус профиля", value: "Публичный", icon: "Globe" },
              ]},
              { section: "Уведомления", items: [
                { label: "Инвайты от друзей", value: "Включено", icon: "Bell" },
                { label: "Новости об играх", value: "Включено", icon: "Newspaper" },
                { label: "Промо-акции", value: "Выключено", icon: "Tag" },
              ]},
              { section: "Интерфейс", items: [
                { label: "Качество графики", value: "Высокое", icon: "Monitor" },
                { label: "Анимации", value: "Включено", icon: "Sparkles" },
                { label: "Звуки UI", value: "Выключено", icon: "Volume2" },
              ]},
            ].map(group => (
              <div key={group.section}>
                <h3 className="font-orbitron font-bold text-xs tracking-widest mb-3" style={{ color: "rgba(0,245,255,0.48)" }}>
                  {group.section.toUpperCase()}
                </h3>
                <div className="space-y-1.5">
                  {group.items.map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                      style={{ background: "rgba(13,18,32,0.85)", border: "1px solid rgba(0,245,255,0.07)" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(0,245,255,0.07)")}>
                      <div className="flex items-center gap-3">
                        <Icon name={item.icon} size={15} style={{ color: "rgba(0,245,255,0.45)" }} />
                        <span className="font-rajdhani font-semibold" style={{ color: "#e0f0ff" }}>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm" style={{ color: "rgba(0,245,255,0.55)" }}>{item.value}</span>
                        <Icon name="ChevronRight" size={13} style={{ color: "rgba(0,245,255,0.28)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}