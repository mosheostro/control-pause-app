import { useState, useEffect, useRef, useCallback } from "react";

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    appName: "Control Pause",
    appTagline: "Buteyko Breath Test",
    tabs: ["Guide", "Timer", "Scale", "Progress", "Learn"],
    guide: {
      title: "How to Test", subtitle: "Control Pause Measurement",
      steps: [
        { icon: "🪑", title: "Sit Quietly",    desc: "Find a comfortable seat. Relax your shoulders and jaw." },
        { icon: "🌬️", title: "Breathe Normally",desc: "Allow your breathing to settle for 1–2 minutes. Don't control it." },
        { icon: "💨", title: "Exhale Gently",   desc: "Take a normal (not deep) exhale through your nose." },
        { icon: "▶️", title: "Press START",     desc: "Begin the timer immediately after your exhale." },
        { icon: "🤐", title: "Hold Gently",     desc: "Hold your breath until you feel the first natural urge to breathe." },
        { icon: "⏹️", title: "Press STOP",      desc: "Release and breathe normally. This is your Control Pause." },
      ],
      note: "The test should be comfortable — never force or strain.", ready: "I'm Ready",
    },
    timer: {
      exhaleNow: "Exhale now…", holdBreath: "Hold your breath", result: "Your result",
      seconds: "seconds", save: "Save Result", saved: "Saved ✓",
      reset: "Reset", start: "START", stop: "STOP", ready: "Ready?",
    },
    scale: {
      title: "Health Scale", subtitle: "What your Control Pause means",
      levels: [
        { range: "< 20 sec",   label: "Critical", desc: "Very low respiratory tolerance. Significant breathing dysfunction.",                    color: "#ef4444" },
        { range: "20–40 sec",  label: "Low",      desc: "Below healthy range. Common with stress, anxiety, or poor breathing habits.",           color: "#f97316" },
        { range: "40–60 sec",  label: "Healthy",  desc: "Good respiratory health. Normal function and energy levels.",                           color: "#eab308" },
        { range: "60–90 sec",  label: "Excellent",desc: "Strong CO₂ tolerance. High vitality and physical resilience.",                          color: "#22c55e" },
        { range: "90–120 sec", label: "Advanced", desc: "Elite level. Exceptional cellular oxygenation and microbiome health.",                  color: "#06b6d4" },
        { range: "> 120 sec",  label: "Master",   desc: "Fully optimized physiology. Profound resistance to stress, pathogens, and aging.",      color: "#8b5cf6" },
      ],
    },
    progress: {
      title: "Your Progress", noData: "No results yet. Take your first breath test!",
      dailyAvg: "Daily Avg", lastResult: "Last", bestResult: "Best", sessions: "Days",
      chart7: "7 days", chart30: "30 days", chartAll: "All time",
      clearData: "Delete All Data", confirmClear: "Delete all saved data? This cannot be undone.",
      history: "Results", addResult: "+ Add Result", addPrompt: "Enter breath-hold duration in seconds.",
      day: "Day", time: "Time", duration: "Duration",
    },
    learn: {
      title: "The Science",
      sections: [
        { title: "The Buteyko Method", icon: "🫁", content: "Developed by Dr. Konstantin Buteyko in the 1950s, this method recognizes that modern humans chronically overbreathe — exhaling too much CO₂, which paradoxically reduces oxygen delivery to cells. The Control Pause is the core diagnostic tool." },
        { title: "Why CO₂ Matters",    icon: "🔬", content: "Carbon dioxide is not just a waste gas — it's the primary trigger for the breathing reflex and enables hemoglobin to release oxygen (the Bohr Effect). Higher CO₂ tolerance means more efficient oxygen delivery to every cell." },
        { title: "Nasal Breathing",    icon: "👃", content: "The nose filters, humidifies, and warms air. It produces nitric oxide which dilates blood vessels and kills pathogens. Mouth breathing bypasses all of this, increasing CO₂ loss and reducing cellular oxygen." },
        { title: "How to Improve",     icon: "📈", content: "Practice nasal breathing 24/7. Tape your mouth during sleep. Do gentle breathing exercises daily — reduced breathing (breathing less than your urge demands). Consistency over weeks builds lasting improvement." },
        { title: "Safety First",       icon: "⚠️", content: "Never force breath holds. The test should feel natural and comfortable. If you have cardiovascular conditions, epilepsy, or are pregnant, consult your doctor before practice." },
      ],
    },
    consult: { button: "Book a Consultation" },
  },
  ru: {
    appName: "Контрольная Пауза", appTagline: "Тест дыхания по Бутейко",
    tabs: ["Инструкция", "Таймер", "Шкала", "Прогресс", "Знания"],
    guide: {
      title: "Как проводить тест", subtitle: "Измерение контрольной паузы",
      steps: [
        { icon: "🪑", title: "Сядьте спокойно",    desc: "Найдите удобное положение. Расслабьте плечи и челюсть." },
        { icon: "🌬️", title: "Дышите естественно", desc: "Дайте дыханию успокоиться 1–2 минуты. Не контролируйте его." },
        { icon: "💨", title: "Выдохните мягко",     desc: "Сделайте обычный (не глубокий) выдох через нос." },
        { icon: "▶️", title: "Нажмите СТАРТ",       desc: "Запустите таймер сразу после выдоха." },
        { icon: "🤐", title: "Задержите дыхание",   desc: "Держите до первого желания вдохнуть." },
        { icon: "⏹️", title: "Нажмите СТОП",        desc: "Дышите нормально. Это и есть ваша контрольная пауза." },
      ],
      note: "Тест должен быть комфортным — никакого напряжения.", ready: "Я готов",
    },
    timer: {
      exhaleNow: "Выдыхайте…", holdBreath: "Задержите дыхание", result: "Ваш результат",
      seconds: "секунд", save: "Сохранить результат", saved: "Сохранено ✓",
      reset: "Сбросить", start: "СТАРТ", stop: "СТОП", ready: "Готов?",
    },
    scale: {
      title: "Шкала здоровья", subtitle: "Что означает ваша контрольная пауза",
      levels: [
        { range: "< 20 сек",   label: "Критично",   desc: "Очень низкая дыхательная толерантность. Серьёзная дисфункция.",                                  color: "#ef4444" },
        { range: "20–40 сек",  label: "Низко",      desc: "Ниже нормы. Характерно для стресса, тревоги, плохих привычек.",                                  color: "#f97316" },
        { range: "40–60 сек",  label: "Здоров",     desc: "Хорошее здоровье дыхательной системы. Нормальное функционирование.",                            color: "#eab308" },
        { range: "60–90 сек",  label: "Отлично",    desc: "Сильная толерантность к CO₂. Высокая жизненная сила.",                                          color: "#22c55e" },
        { range: "90–120 сек", label: "Продвинуто", desc: "Элитный уровень. Исключительная оксигенация клеток, здоровая микрофлора.",                      color: "#06b6d4" },
        { range: "> 120 сек",  label: "Мастер",     desc: "Полностью оптимизированная физиология. Устойчивость к стрессу, вирусам, бактериям, паразитам.", color: "#8b5cf6" },
      ],
    },
    progress: {
      title: "Ваш прогресс", noData: "Результатов пока нет. Пройдите первый тест!",
      dailyAvg: "Среднее", lastResult: "Последний", bestResult: "Лучший", sessions: "Дней",
      chart7: "7 дней", chart30: "30 дней", chartAll: "Всё время",
      clearData: "Удалить все данные", confirmClear: "Удалить все сохранённые данные? Это необратимо.",
      history: "Результаты", addResult: "+ Добавить", addPrompt: "Введите задержку дыхания в секундах.",
      day: "День", time: "Время", duration: "Длит.",
    },
    learn: {
      title: "Наука",
      sections: [
        { title: "Метод Бутейко",            icon: "🫁", content: "Разработан д-ром Константином Бутейко в 1950-х. Метод признаёт, что современные люди хронически перегружают дыхание — выдыхая слишком много CO₂, что парадоксально снижает доставку кислорода к клеткам." },
        { title: "Почему важен CO₂",         icon: "🔬", content: "Углекислый газ — не просто отход, это основной триггер дыхательного рефлекса и помогает гемоглобину отдавать кислород (эффект Бора). Выше толерантность к CO₂ — эффективнее кислород." },
        { title: "Носовое дыхание",          icon: "👃", content: "Нос фильтрует, увлажняет и согревает воздух. Производит оксид азота, расширяющий сосуды. Ротовое дыхание лишает вас всего этого и увеличивает потерю CO₂." },
        { title: "Как улучшить показатель",  icon: "📈", content: "Дышите носом 24/7. Заклеивайте рот на ночь. Выполняйте упражнения на уменьшение дыхания каждый день. Постоянство в течение недель даёт долгосрочный эффект." },
        { title: "Безопасность прежде всего",icon: "⚠️", content: "Никогда не форсируйте задержку дыхания. Тест должен быть естественным. При сердечно-сосудистых заболеваниях, эпилепсии или беременности — сначала проконсультируйтесь с врачом." },
      ],
    },
    consult: { button: "Записаться на консультацию" },
  },
  he: {
    appName: "הפסקת שליטה", appTagline: "בדיקת נשימה בשיטת בוטייקו",
    tabs: ["מדריך", "טיימר", "סולם", "התקדמות", "לימוד"],
    guide: {
      title: "כיצד לבצע את הבדיקה", subtitle: "מדידת הפסקת שליטה",
      steps: [
        { icon: "🪑", title: "שב בשקט",        desc: "מצא תנוחה נוחה. הרפה את הכתפיים והלסת." },
        { icon: "🌬️", title: "נשום באופן טבעי", desc: "אפשר לנשימה להתייצב 1–2 דקות. אל תשלוט בה." },
        { icon: "💨", title: "נשוף בעדינות",    desc: "בצע נשיפה רגילה (לא עמוקה) דרך האף." },
        { icon: "▶️", title: "לחץ על התחל",    desc: "הפעל את הטיימר מיד לאחר הנשיפה." },
        { icon: "🤐", title: "עצור נשימה",     desc: "עצור עד לדחף הראשון לנשום." },
        { icon: "⏹️", title: "לחץ עצור",       desc: "שוב לנשימה רגילה. זוהי הפסקת השליטה שלך." },
      ],
      note: "הבדיקה צריכה להיות נוחה — ללא כפייה או לחץ.", ready: "אני מוכן",
    },
    timer: {
      exhaleNow: "נשוף עכשיו…", holdBreath: "עצור נשימה", result: "התוצאה שלך",
      seconds: "שניות", save: "שמור תוצאה", saved: "נשמר ✓",
      reset: "אפס", start: "התחל", stop: "עצור", ready: "מוכן?",
    },
    scale: {
      title: "סולם הבריאות", subtitle: "מה משמעות הפסקת השליטה שלך",
      levels: [
        { range: "< 20 שנ",   label: "קריטי",  desc: "סובלנות נשימתית נמוכה מאוד. הפרעת נשימה משמעותית.",              color: "#ef4444" },
        { range: "20–40 שנ",  label: "נמוך",   desc: "מתחת לרמה הבריאה. אופייני ללחץ, חרדה, או הרגלי נשימה לקויים.", color: "#f97316" },
        { range: "40–60 שנ",  label: "בריא",   desc: "בריאות נשימתית טובה. תפקוד ורמות אנרגיה תקינות.",               color: "#eab308" },
        { range: "60–90 שנ",  label: "מצוין",  desc: "סובלנות CO₂ חזקה. חיוניות גבוהה וחוסן פיזי.",                  color: "#22c55e" },
        { range: "90–120 שנ", label: "מתקדם",  desc: "רמה עילית. חמצון תאי יוצא דופן ובריאות המיקרוביום.",           color: "#06b6d4" },
        { range: "> 120 שנ",  label: "מאסטר",  desc: "פיזיולוגיה מיטבית מלאה. עמידות עמוקה למתח, פתוגנים והזדקנות.", color: "#8b5cf6" },
      ],
    },
    progress: {
      title: "ההתקדמות שלך", noData: "עדיין אין תוצאות. בצע את בדיקת הנשימה הראשונה שלך!",
      dailyAvg: "ממוצע", lastResult: "אחרון", bestResult: "הטוב", sessions: "ימים",
      chart7: "7 ימים", chart30: "30 ימים", chartAll: "כל הזמן",
      clearData: "מחק את כל הנתונים", confirmClear: "למחוק את כל הנתונים השמורים? לא ניתן לבטל פעולה זו.",
      history: "תוצאות", addResult: "+ הוסף", addPrompt: "הזן את משך עצירת הנשימה בשניות.",
      day: "יום", time: "שעה", duration: "משך",
    },
    learn: {
      title: "המדע",
      sections: [
        { title: "שיטת בוטייקו",    icon: "🫁", content: "פותחה על ידי ד\"ר קונסטנטין בוטייקו בשנות ה-50. השיטה מכירה בכך שבני אדם מודרניים נושמים יותר מדי — פולטים יותר מדי CO₂, מה שמפחית אספקת חמצן לתאים." },
        { title: "מדוע CO₂ חשוב",   icon: "🔬", content: "פחמן דו-חמצני אינו רק גז פסולת — הוא הגורם העיקרי לרפלקס הנשימה ומאפשר להמוגלובין לשחרר חמצן (אפקט בוהר). סובלנות גבוהה יותר ל-CO₂ מאפשרת אספקת חמצן יעילה יותר." },
        { title: "נשימה דרך האף",   icon: "👃", content: "האף מסנן, מלחלח ומחמם אוויר. הוא מייצר תחמוצת חנקן שמרחיבה כלי דם. נשימת פה עוקפת את כל אלה ומגבירה אובדן CO₂." },
        { title: "כיצד להשתפר",     icon: "📈", content: "נשם דרך האף 24/7. הדבק את הפה בזמן שינה. בצע תרגילי נשימה מופחתת מדי יום. עקביות לאורך שבועות מביאה שיפור מתמשך." },
        { title: "בטיחות קודם כל",  icon: "⚠️", content: "לעולם אל תאלץ עצירת נשימה. הבדיקה צריכה להיות נוחה. אם יש לך מצבים לבביים, אפילפסיה, או הריון — התייעץ עם רופא לפני האימון." },
      ],
    },
    consult: { button: "קבע ייעוץ עם מומחה" },
  },
};

const CONSULT_URLS = {
  he: "https://get-marketing.co.il/moshe-om/",
  ru: "https://get-marketing.net/moshe-om/",
  en: "https://get-marketing.net/moshe-om/",
};

function detectLang() {
  const l = navigator.language || "en";
  if (l.startsWith("he") || l.startsWith("iw")) return "he";
  if (l.startsWith("ru")) return "ru";
  return "en";
}

function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function getLevel(sec, t) {
  const lv = t.scale.levels;
  if (sec < 20) return lv[0];
  if (sec < 40) return lv[1];
  if (sec < 60) return lv[2];
  if (sec < 90) return lv[3];
  if (sec < 120) return lv[4];
  return lv[5];
}

// ─── Health Zone Chart ────────────────────────────────────────────────────────
function HealthChart({ data, range }) {
  if (!data.length) return null;
  const now = Date.now();
  const cutoff = range === "7" ? now - 7 * 86400000 : range === "30" ? now - 30 * 86400000 : 0;
  const pts = data.filter(function(d) { return d.ts >= cutoff; });

  if (!pts.length) {
    return (
      <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8", fontSize: 13 }}>
        No data in this range
      </div>
    );
  }

  var W = 320, H = 200, padL = 34, padR = 8, padT = 10, padB = 28;
  var plotW = W - padL - padR;
  var plotH = H - padT - padB;
  var Y_MIN = 0, Y_MAX = 130;

  function yS(v) { return padT + plotH - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * plotH; }
  function xS(i) {
    if (pts.length === 1) return padL + plotW * 0.25;
    return padL + (i / (pts.length - 1)) * plotW;
  }

  var zones = [
    { lo: 0, hi: 20, color: "#ef4444" }, { lo: 20, hi: 40, color: "#f97316" },
    { lo: 40, hi: 60, color: "#eab308" }, { lo: 60, hi: 90, color: "#22c55e" },
    { lo: 90, hi: 120, color: "#06b6d4" }, { lo: 120, hi: 130, color: "#8b5cf6" },
  ];
  var yTicks = [0, 20, 40, 60, 90, 120];

  var linePts = pts.map(function(d, i) { return xS(i) + "," + yS(d.avg); }).join(" ");

  var areaD = "";
  if (pts.length > 1) {
    areaD = "M" + xS(0) + "," + yS(pts[0].avg);
    for (var k = 1; k < pts.length; k++) {
      areaD += " L" + xS(k) + "," + yS(pts[k].avg);
    }
    areaD += " L" + xS(pts.length - 1) + "," + yS(0) + " L" + xS(0) + "," + yS(0) + " Z";
  }

  var xLabelIdx = pts.length <= 5
    ? pts.map(function(_, i) { return i; })
    : [0, Math.floor((pts.length - 1) / 3), Math.floor((pts.length - 1) * 2 / 3), pts.length - 1];

  return (
    <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", display: "block", margin: "0 auto", overflow: "visible" }}>
      <defs>
        <clipPath id="cp">
          <rect x={padL} y={padT} width={plotW} height={plotH} />
        </clipPath>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <g clipPath="url(#cp)">
        {zones.map(function(z, i) {
          var y1 = yS(Math.min(z.hi, Y_MAX));
          var y2 = yS(Math.max(z.lo, Y_MIN));
          return <rect key={i} x={padL} y={y1} width={plotW} height={y2 - y1} fill={z.color} opacity="0.10" />;
        })}
        {yTicks.map(function(v) {
          return <line key={v} x1={padL} y1={yS(v)} x2={padL + plotW} y2={yS(v)}
            stroke={v === 0 ? "#cbd5e1" : "#e2e8f0"} strokeWidth={v === 0 ? 1.5 : 1}
            strokeDasharray={v === 0 ? "none" : "3 3"} />;
        })}
        {pts.map(function(_, i) {
          return <line key={i} x1={xS(i)} y1={padT} x2={xS(i)} y2={padT + plotH}
            stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />;
        })}
        {pts.length > 1 && <path d={areaD} fill="url(#ag)" />}
        {pts.length > 1 && (
          <polyline points={linePts} fill="none" stroke="#059669" strokeWidth="2.5"
            strokeLinejoin="round" strokeLinecap="round" />
        )}
        {pts.length === 1 && (
          <line x1={padL} y1={yS(pts[0].avg)} x2={padL + plotW} y2={yS(pts[0].avg)}
            stroke="#059669" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        )}
        {pts.map(function(d, i) {
          var c = d.avg < 20 ? "#ef4444" : d.avg < 40 ? "#f97316" : d.avg < 60 ? "#ca8a04"
            : d.avg < 90 ? "#16a34a" : d.avg < 120 ? "#0891b2" : "#7c3aed";
          return (
            <g key={i}>
              <circle cx={xS(i)} cy={yS(d.avg)} r="5" fill={c} stroke="#fff" strokeWidth="2" />
              {pts.length <= 7 && (
                <text x={xS(i)} y={yS(d.avg) - 9} fontSize="9" fill={c} textAnchor="middle" fontWeight="700">
                  {d.avg}s
                </text>
              )}
            </g>
          );
        })}
      </g>
      {yTicks.map(function(v) {
        return <text key={v} x={padL - 5} y={yS(v) + 3.5} fontSize="9" fill="#94a3b8" textAnchor="end">{v}</text>;
      })}
      {xLabelIdx.map(function(idx, k) {
        var lbl = new Date(pts[idx].ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        var anchor = k === 0 ? "start" : k === xLabelIdx.length - 1 ? "end" : "middle";
        return <text key={idx} x={xS(idx)} y={H - 6} fontSize="9" fill="#94a3b8" textAnchor={anchor}>{lbl}</text>;
      })}
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(function() { return load("cp_lang", detectLang()); });
  const t = T[lang] || T.en;
  const isRTL = lang === "he";
  const [tab, setTab] = useState(0);

  const [users, setUsers]               = useState(function() { return load("cp_users", []); });
  const [activeUserId, setActiveUserId] = useState(function() { return load("cp_active_user", null); });
  const [allResults, setAllResults]     = useState(function() { return load("cp_all_results", {}); });
  const [newUserName, setNewUserName]   = useState("");

  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);
  const [confirmClearData, setConfirmClearData]       = useState(false);
  const [renameUserId, setRenameUserId]               = useState(null);
  const [renameValue, setRenameValue]                 = useState("");
  const [showAddResult, setShowAddResult]             = useState(false);
  const [manualSec, setManualSec]                     = useState("");

  useEffect(function() { save("cp_users", users); }, [users]);
  useEffect(function() { save("cp_active_user", activeUserId); }, [activeUserId]);
  useEffect(function() { save("cp_all_results", allResults); }, [allResults]);

  const results = activeUserId ? (allResults[activeUserId] || []) : [];

  function handleCreateUser() {
    var name = newUserName.trim();
    if (!name) return;
    var id = Date.now().toString();
    var updated = users.concat([{ id: id, name: name }]);
    setUsers(updated);
    setActiveUserId(id);
    save("cp_users", updated);
    save("cp_active_user", id);
    setNewUserName("");
  }

  function handleDeleteUser(id) {
    var updatedUsers = users.filter(function(u) { return u.id !== id; });
    var updatedResults = Object.assign({}, allResults);
    delete updatedResults[id];
    var newActive = activeUserId === id
      ? (updatedUsers.length ? updatedUsers[updatedUsers.length - 1].id : null)
      : activeUserId;
    setUsers(updatedUsers);
    setAllResults(updatedResults);
    setActiveUserId(newActive);
    save("cp_users", updatedUsers);
    save("cp_all_results", updatedResults);
    save("cp_active_user", newActive);
  }

  function handleRenameUser(id, newName) {
    var trimmed = newName.trim();
    if (!trimmed) return;
    var updated = users.map(function(u) { return u.id === id ? Object.assign({}, u, { name: trimmed }) : u; });
    setUsers(updated);
    save("cp_users", updated);
    setRenameUserId(null);
    setRenameValue("");
  }

  function handleDeleteResult(index) {
    if (!activeUserId) return;
    var current = allResults[activeUserId] || [];
    var updated = Object.assign({}, allResults, {
      [activeUserId]: current.filter(function(_, i) { return i !== index; })
    });
    setAllResults(updated);
    save("cp_all_results", updated);
  }

  function handleAddManualResult() {
    var sec = parseInt(manualSec, 10);
    if (isNaN(sec) || sec <= 0) return;
    var current = allResults[activeUserId] || [];
    var updated = Object.assign({}, allResults, {
      [activeUserId]: current.concat([{ ts: Date.now(), sec: sec }])
    });
    setAllResults(updated);
    save("cp_all_results", updated);
    setManualSec("");
    setShowAddResult(false);
  }

  const [phase, setPhase]         = useState("idle");
  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed]     = useState(0);
  const [saved, setSaved]         = useState(false);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const [chartRange, setChartRange] = useState("30");

  function clearTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  const handleStart = useCallback(function() {
    if (phase !== "idle") return;
    setPhase("countdown"); setCountdown(3); setSaved(false);
    var c = 3;
    timerRef.current = setInterval(function() {
      c--;
      if (c <= 0) {
        clearInterval(timerRef.current);
        setPhase("running");
        startRef.current = Date.now();
        timerRef.current = setInterval(function() {
          setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }, 100);
      } else { setCountdown(c); }
    }, 1000);
  }, [phase]);

  const handleStop = useCallback(function() {
    if (phase !== "running") return;
    clearTimer();
    setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    setPhase("done");
  }, [phase]);

  const handleReset = useCallback(function() {
    clearTimer(); setPhase("idle"); setElapsed(0); setCountdown(3); setSaved(false);
  }, []);

  const handleSave = useCallback(function() {
    if (phase !== "done" || saved) return;
    var entry = { ts: Date.now(), sec: elapsed };
    var targetId = activeUserId;
    if (!targetId) {
      var id = Date.now().toString();
      var defaultUser = { id: id, name: "Default User" };
      var updatedUsers = [defaultUser];
      setUsers(updatedUsers);
      setActiveUserId(id);
      save("cp_users", updatedUsers);
      save("cp_active_user", id);
      targetId = id;
    }
    setAllResults(function(prev) {
      var updated = Object.assign({}, prev, {
        [targetId]: (prev[targetId] || []).concat([entry])
      });
      save("cp_all_results", updated);
      return updated;
    });
    setSaved(true);
  }, [phase, saved, elapsed, activeUserId]);

  const dailyData = (function() {
    var map = {};
    results.forEach(function(r) {
      var day = new Date(r.ts).toDateString();
      if (!map[day]) map[day] = { ts: new Date(r.ts).setHours(12, 0, 0, 0), vals: [] };
      map[day].vals.push(r.sec);
    });
    return Object.values(map)
      .map(function(d) { return { ts: d.ts, avg: Math.round(d.vals.reduce(function(a, b) { return a + b; }, 0) / d.vals.length) }; })
      .sort(function(a, b) { return a.ts - b.ts; });
  })();

  const lastSec   = results.length ? results[results.length - 1].sec : null;
  const bestSec   = results.length ? Math.max.apply(null, results.map(function(r) { return r.sec; })) : null;
  const lastLevel = lastSec !== null ? getLevel(lastSec, t) : null;
  const consultUrl = CONSULT_URLS[lang];
  var activeUser = users.find(function(u) { return u.id === activeUserId; });
  const userName = activeUser ? activeUser.name : "";

  const zoneLegend = [
    { color: "#ef4444", label: "<20s" }, { color: "#f97316", label: "20–40s" },
    { color: "#eab308", label: "40–60s" }, { color: "#22c55e", label: "60–90s" },
    { color: "#06b6d4", label: "90–120s" }, { color: "#8b5cf6", label: ">120s" },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Outfit',sans-serif;background:#f0faf4;min-height:100vh;color:#1a2e22;}
    .app{max-width:440px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;}
    .header{background:linear-gradient(135deg,#0d9488 0%,#059669 100%);padding:20px 20px 0;position:sticky;top:0;z-index:100;box-shadow:0 4px 20px rgba(5,150,105,0.3);}
    .header-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
    .app-title{font-family:'Lora',serif;font-size:22px;font-weight:600;color:#fff;letter-spacing:-0.3px;}
    .app-subtitle{font-size:11px;color:rgba(255,255,255,0.7);margin-top:1px;letter-spacing:0.5px;text-transform:uppercase;}
    .lang-sel{display:flex;gap:4px;}
    .lang-btn{padding:4px 10px;border-radius:20px;border:1.5px solid rgba(255,255,255,0.4);background:transparent;color:rgba(255,255,255,0.8);font-size:12px;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif;}
    .lang-btn.active{background:rgba(255,255,255,0.25);color:#fff;border-color:rgba(255,255,255,0.7);}
    .status-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;background:rgba(255,255,255,0.15);font-size:12px;color:rgba(255,255,255,0.9);margin-bottom:12px;}
    .status-dot{width:8px;height:8px;border-radius:50%;}
    .tabs{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;}
    .tabs::-webkit-scrollbar{display:none;}
    .tab-btn{flex:1;min-width:60px;padding:10px 4px;background:transparent;border:none;color:rgba(255,255,255,0.6);font-size:11px;font-weight:500;cursor:pointer;font-family:'Outfit',sans-serif;border-bottom:2.5px solid transparent;white-space:nowrap;transition:all 0.2s;}
    .tab-btn.active{color:#fff;border-bottom-color:#fff;}
    .content{flex:1;padding:20px 16px 100px;overflow-y:auto;}
    .card{background:#fff;border-radius:20px;padding:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);margin-bottom:16px;}
    .step{display:flex;gap:14px;align-items:flex-start;margin-bottom:16px;}
    .step-icon{font-size:24px;flex-shrink:0;width:40px;text-align:center;}
    .step-title{font-weight:600;font-size:14px;color:#1a2e22;}
    .step-desc{font-size:13px;color:#64748b;margin-top:2px;line-height:1.5;}
    .note-box{background:linear-gradient(135deg,#ecfdf5,#f0fdf4);border:1.5px solid #a7f3d0;border-radius:14px;padding:14px 16px;font-size:13px;color:#065f46;display:flex;gap:10px;align-items:flex-start;margin-top:4px;}
    .ready-btn{width:100%;padding:16px;border-radius:16px;border:none;background:linear-gradient(135deg,#059669,#0d9488);color:#fff;font-size:16px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;box-shadow:0 4px 20px rgba(5,150,105,0.35);transition:transform 0.15s,box-shadow 0.15s;}
    .ready-btn:hover{transform:translateY(-1px);}
    .timer-display{display:flex;flex-direction:column;align-items:center;padding:32px 20px;}
    .timer-phase{font-size:13px;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;}
    .timer-ring{width:200px;height:200px;border-radius:50%;background:linear-gradient(135deg,#ecfdf5 0%,#f0f9ff 100%);border:4px solid #a7f3d0;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:28px;box-shadow:0 8px 40px rgba(5,150,105,0.15),inset 0 2px 8px rgba(0,0,0,0.04);}
    .timer-ring.running{border-color:#059669;animation:pulse-ring 2s ease-in-out infinite;}
    .timer-ring.countdown{border-color:#0d9488;}
    @keyframes pulse-ring{0%,100%{box-shadow:0 8px 40px rgba(5,150,105,0.15),0 0 0 0 rgba(5,150,105,0.3);}50%{box-shadow:0 8px 40px rgba(5,150,105,0.25),0 0 0 16px rgba(5,150,105,0);}}
    .timer-num{font-family:'Lora',serif;font-size:64px;font-weight:600;color:#1a2e22;line-height:1;}
    .timer-sec-label{font-size:13px;color:#64748b;margin-top:4px;}
    .timer-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
    .btn-start{padding:16px 40px;border-radius:50px;border:none;background:linear-gradient(135deg,#059669,#0d9488);color:#fff;font-size:17px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;letter-spacing:1px;box-shadow:0 6px 24px rgba(5,150,105,0.4);transition:transform 0.15s;}
    .btn-stop{padding:16px 40px;border-radius:50px;border:none;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:17px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;letter-spacing:1px;box-shadow:0 6px 24px rgba(239,68,68,0.4);animation:pulse-stop 1.5s ease-in-out infinite;}
    @keyframes pulse-stop{0%,100%{transform:scale(1);}50%{transform:scale(1.03);}}
    .btn-reset{padding:14px 24px;border-radius:50px;border:2px solid #e2e8f0;background:#fff;color:#64748b;font-size:14px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;}
    .btn-save{padding:14px 32px;border-radius:50px;border:none;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;font-size:15px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;box-shadow:0 4px 16px rgba(139,92,246,0.35);}
    .btn-save.saved{background:linear-gradient(135deg,#6b7280,#4b5563);box-shadow:none;}
    .result-box{border-radius:20px;padding:24px;text-align:center;margin:0 0 16px;border:2px solid;background:#fff;}
    .result-sec{font-family:'Lora',serif;font-size:56px;font-weight:600;line-height:1;}
    .result-label{font-size:22px;font-weight:700;margin-top:8px;}
    .result-desc{font-size:13px;color:#64748b;margin-top:6px;max-width:240px;margin-left:auto;margin-right:auto;line-height:1.5;}
    .scale-row{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;margin-bottom:8px;background:#f8fafc;border:1.5px solid transparent;}
    .scale-row.active{background:#f0fdf4;}
    .scale-dot{width:14px;height:14px;border-radius:50%;flex-shrink:0;}
    .scale-range{font-size:14px;font-weight:700;min-width:80px;}
    .scale-label{font-size:15px;font-weight:600;}
    .scale-desc{font-size:12px;color:#64748b;margin-top:2px;line-height:1.4;}
    .section-title{font-family:'Lora',serif;font-size:20px;font-weight:600;color:#1a2e22;margin-bottom:4px;}
    .section-sub{font-size:13px;color:#64748b;margin-bottom:16px;}
    .user-layout{display:flex;gap:12px;align-items:flex-start;}
    .user-sidebar{width:110px;flex-shrink:0;background:#fff;border-radius:16px;padding:12px 10px;box-shadow:0 2px 16px rgba(0,0,0,0.06);}
    .user-sidebar-title{font-size:10px;text-transform:uppercase;letter-spacing:0.6px;color:#94a3b8;margin-bottom:8px;font-weight:600;}
    .user-item{display:flex;align-items:center;gap:3px;padding:6px 6px;border-radius:10px;cursor:pointer;font-size:12px;font-weight:500;color:#475569;transition:all 0.15s;margin-bottom:4px;}
    .user-item.active{background:#ecfdf5;color:#059669;font-weight:600;}
    .user-item:hover:not(.active){background:#f8fafc;}
    .user-item-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;}
    .uab{width:16px;height:16px;border-radius:50%;border:none;font-size:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;line-height:1;transition:all 0.15s;}
    .uab-r{background:#dbeafe;color:#2563eb;}
    .uab-r:hover{background:#bfdbfe;}
    .uab-d{background:#fee2e2;color:#dc2626;}
    .uab-d:hover{background:#fecaca;}
    .user-rename-row{display:flex;align-items:center;gap:3px;padding:4px 0;margin-bottom:4px;}
    .user-rename-input{flex:1;padding:4px 5px;border-radius:7px;min-width:0;border:1.5px solid #059669;font-size:11px;font-family:'Outfit',sans-serif;background:#f0fdf4;color:#1a2e22;outline:none;}
    .urb-ok{width:18px;height:18px;border-radius:50%;border:none;background:#059669;color:#fff;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;}
    .urb-no{width:18px;height:18px;border-radius:50%;border:none;background:#fee2e2;color:#dc2626;font-size:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;}
    .user-add-row{display:flex;gap:4px;margin-top:6px;}
    .user-add-input{flex:1;padding:6px 8px;border-radius:8px;border:1.5px solid #e2e8f0;font-size:11px;font-family:'Outfit',sans-serif;background:#f8fafc;color:#1a2e22;outline:none;min-width:0;}
    .user-add-input:focus{border-color:#059669;}
    .user-add-btn{padding:6px 8px;border-radius:8px;border:none;background:#059669;color:#fff;font-size:14px;cursor:pointer;flex-shrink:0;line-height:1;}
    .user-main{flex:1;min-width:0;}
    .no-user-msg{text-align:center;padding:32px 16px;color:#94a3b8;font-size:13px;line-height:1.7;}
    .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
    .stat-card{background:#f8fafc;border-radius:16px;padding:14px;text-align:center;border:1.5px solid #e2e8f0;}
    .stat-val{font-family:'Lora',serif;font-size:28px;font-weight:600;color:#059669;}
    .stat-key{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;}
    .range-btns{display:flex;gap:6px;margin-bottom:12px;}
    .range-btn{padding:6px 14px;border-radius:20px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:500;cursor:pointer;font-family:'Outfit',sans-serif;color:#64748b;transition:all 0.2s;}
    .range-btn.active{background:#059669;color:#fff;border-color:#059669;}
    .zone-legend{display:flex;flex-wrap:wrap;gap:4px 8px;margin-top:10px;justify-content:center;}
    .zone-swatch{display:flex;align-items:center;gap:4px;font-size:10px;color:#64748b;}
    .zone-dot{width:10px;height:10px;border-radius:2px;flex-shrink:0;opacity:0.7;}
    .add-result-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;border:1.5px solid #a7f3d0;background:#f0fdf4;color:#059669;font-size:12px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;margin-bottom:10px;transition:all 0.15s;}
    .add-result-btn:hover{background:#dcfce7;border-color:#059669;}
    .add-result-bar{display:flex;gap:6px;align-items:center;background:#f0fdf4;border:1.5px solid #a7f3d0;border-radius:14px;padding:10px 12px;margin-bottom:10px;flex-wrap:wrap;}
    .add-result-label{font-size:11px;color:#065f46;flex:1;min-width:110px;line-height:1.4;}
    .add-result-input{width:58px;padding:7px 8px;border-radius:10px;border:1.5px solid #059669;font-size:15px;font-weight:700;font-family:'Outfit',sans-serif;color:#1a2e22;background:#fff;outline:none;text-align:center;}
    .add-result-input::-webkit-inner-spin-button,.add-result-input::-webkit-outer-spin-button{-webkit-appearance:none;}
    .add-result-ok{padding:7px 12px;border-radius:10px;border:none;background:#059669;color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;white-space:nowrap;}
    .add-result-x{padding:7px 8px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;color:#94a3b8;font-size:12px;cursor:pointer;font-family:'Outfit',sans-serif;}
    .results-table{width:100%;border-collapse:collapse;font-size:12px;}
    .results-table th{text-align:left;padding:6px 8px;font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1.5px solid #f0faf4;}
    .results-table td{padding:8px 8px;border-bottom:1px solid #f8fafc;vertical-align:middle;}
    .results-table tr:last-child td{border-bottom:none;}
    .results-table tr:hover td{background:#f8fafc;}
    .row-date{font-size:12px;color:#475569;white-space:nowrap;}
    .row-time{font-size:11px;color:#94a3b8;white-space:nowrap;}
    .row-del{width:24px;height:24px;border-radius:8px;border:none;background:#fff5f5;color:#dc2626;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.15s;padding:0;margin-left:auto;}
    .row-del:hover{background:#fee2e2;}
    .clear-btn{width:100%;padding:12px;border-radius:14px;border:1.5px solid #fecaca;background:#fff5f5;color:#dc2626;font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;margin-top:8px;transition:all 0.2s;}
    .clear-btn:hover{background:#fee2e2;}
    .edu-section{margin-bottom:16px;}
    .edu-icon-title{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
    .edu-icon{font-size:24px;}
    .edu-title{font-size:16px;font-weight:700;color:#1a2e22;}
    .edu-text{font-size:14px;color:#475569;line-height:1.7;}
    .consult-btn{width:100%;padding:18px;border-radius:18px;border:none;background:linear-gradient(135deg,#0d9488 0%,#059669 100%);color:#fff;font-size:16px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;box-shadow:0 6px 28px rgba(5,150,105,0.4);transition:all 0.2s;margin-bottom:12px;}
    .consult-btn:hover{transform:translateY(-2px);}
    .confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
    .confirm-box{background:#fff;border-radius:20px;padding:24px 20px;max-width:300px;width:100%;box-shadow:0 16px 48px rgba(0,0,0,0.18);text-align:center;}
    .confirm-icon{font-size:32px;margin-bottom:10px;}
    .confirm-title{font-family:'Lora',serif;font-size:17px;font-weight:600;color:#1a2e22;margin-bottom:8px;}
    .confirm-msg{font-size:13px;color:#64748b;line-height:1.6;margin-bottom:20px;}
    .confirm-btns{display:flex;gap:10px;}
    .confirm-cancel{flex:1;padding:12px;border-radius:12px;border:1.5px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:14px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;}
    .confirm-ok{flex:1;padding:12px;border-radius:12px;border:none;background:#dc2626;color:#fff;font-size:14px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;}
    .confirm-ok:hover{background:#b91c1c;}
    .divider{height:1px;background:#f0faf4;margin:16px 0;}
    @media(max-width:440px){.content{padding:16px 12px 100px;}.timer-num{font-size:56px;}.timer-ring{width:180px;height:180px;}}
  `;

  return (
    <>
      <style>{css}</style>
      <div className="app" dir={isRTL ? "rtl" : "ltr"}>

        <div className="header">
          <div className="header-top">
            <div>
              <div className="app-title">{t.appName}</div>
              <div className="app-subtitle">{t.appTagline}</div>
            </div>
            <div className="lang-sel">
              {["he", "ru", "en"].map(function(l) {
                return (
                  <button key={l} className={"lang-btn" + (lang === l ? " active" : "")}
                    onClick={function() { setLang(l); save("cp_lang", l); }}>
                    {l === "he" ? "עב" : l === "ru" ? "Ру" : "En"}
                  </button>
                );
              })}
            </div>
          </div>
          {lastLevel && (
            <div className="status-badge">
              <div className="status-dot" style={{ background: lastLevel.color }} />
              {lastLevel.label} — {lastSec}s{userName ? " · " + userName : ""}
            </div>
          )}
          <div className="tabs">
            {t.tabs.map(function(name, i) {
              return (
                <button key={i} className={"tab-btn" + (tab === i ? " active" : "")}
                  onClick={function() { setTab(i); }}>{name}</button>
              );
            })}
          </div>
        </div>

        <div className="content">

          {tab === 0 && (
            <>
              <div className="section-title">{t.guide.title}</div>
              <div className="section-sub">{t.guide.subtitle}</div>
              <div className="card">
                {t.guide.steps.map(function(s, i) {
                  return (
                    <div className="step" key={i}>
                      <div className="step-icon">{s.icon}</div>
                      <div>
                        <div className="step-title">{s.title}</div>
                        <div className="step-desc">{s.desc}</div>
                      </div>
                    </div>
                  );
                })}
                <div className="note-box"><span>💡</span><span>{t.guide.note}</span></div>
              </div>
              <button className="ready-btn" onClick={function() { setTab(1); }}>{t.guide.ready} →</button>
            </>
          )}

          {tab === 1 && (
            <>
              {phase === "done" && lastLevel && (
                <div className="result-box" style={{ borderColor: lastLevel.color }}>
                  <div className="result-sec" style={{ color: lastLevel.color }}>{elapsed}</div>
                  <div className="timer-sec-label" style={{ color: "#64748b" }}>{t.timer.seconds}</div>
                  <div className="result-label" style={{ color: lastLevel.color }}>{lastLevel.label}</div>
                  <div className="result-desc">{lastLevel.desc}</div>
                </div>
              )}
              <div className="card">
                <div className="timer-display">
                  <div className="timer-phase">
                    {phase === "idle" && t.timer.ready}
                    {phase === "countdown" && t.timer.exhaleNow}
                    {phase === "running" && t.timer.holdBreath}
                    {phase === "done" && t.timer.result}
                  </div>
                  <div className={"timer-ring" + (phase === "running" ? " running" : phase === "countdown" ? " countdown" : "")}>
                    <div className="timer-num">
                      {phase === "countdown" && countdown}
                      {phase === "idle" && "–"}
                      {(phase === "running" || phase === "done") && elapsed}
                    </div>
                    {(phase === "running" || phase === "done") && (
                      <div className="timer-sec-label">{t.timer.seconds}</div>
                    )}
                  </div>
                  <div className="timer-btns">
                    {phase === "idle" && <button className="btn-start" onClick={handleStart}>{t.timer.start}</button>}
                    {phase === "running" && <button className="btn-stop" onClick={handleStop}>{t.timer.stop}</button>}
                    {phase === "countdown" && <button className="btn-reset" onClick={handleReset}>{t.timer.reset}</button>}
                    {phase === "done" && (
                      <>
                        <button className={"btn-save" + (saved ? " saved" : "")} onClick={handleSave} disabled={saved}>
                          {saved ? t.timer.saved : t.timer.save}
                        </button>
                        <button className="btn-reset" onClick={handleReset}>{t.timer.reset}</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 2 && (
            <>
              <div className="section-title">{t.scale.title}</div>
              <div className="section-sub">{t.scale.subtitle}</div>
              {t.scale.levels.map(function(lvl, i) {
                var isActive = lastSec !== null && getLevel(lastSec, t).label === lvl.label;
                return (
                  <div key={i} className={"scale-row" + (isActive ? " active" : "")}
                    style={isActive ? { borderColor: lvl.color } : {}}>
                    <div className="scale-dot" style={{ background: lvl.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="scale-range" style={{ color: lvl.color }}>{lvl.range}</div>
                        <div className="scale-label" style={{ color: isActive ? lvl.color : "#1a2e22" }}>{lvl.label}</div>
                        {isActive && <div style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: lvl.color }}>← You</div>}
                      </div>
                      <div className="scale-desc">{lvl.desc}</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {tab === 3 && (
            <>
              <div className="section-title">{t.progress.title}</div>
              <div style={{ marginBottom: 16 }} />
              <div className="user-layout">

                <div className="user-sidebar">
                  <div className="user-sidebar-title">Users</div>
                  {users.map(function(u) {
                    return (
                      <div key={u.id}>
                        {renameUserId === u.id ? (
                          <div className="user-rename-row">
                            <input className="user-rename-input" value={renameValue} autoFocus
                              onChange={function(e) { setRenameValue(e.target.value); }}
                              onKeyDown={function(e) {
                                if (e.key === "Enter") handleRenameUser(u.id, renameValue);
                                if (e.key === "Escape") { setRenameUserId(null); setRenameValue(""); }
                              }} />
                            <button className="urb-ok" title="Save" onClick={function() { handleRenameUser(u.id, renameValue); }}>✓</button>
                            <button className="urb-no" title="Cancel" onClick={function() { setRenameUserId(null); setRenameValue(""); }}>✕</button>
                          </div>
                        ) : (
                          <div className={"user-item" + (activeUserId === u.id ? " active" : "")}
                            onClick={function() { setActiveUserId(u.id); }}>
                            <span className="user-item-name">{u.name}</span>
                            <button className="uab uab-r" title="Rename"
                              onClick={function(e) { e.stopPropagation(); setRenameUserId(u.id); setRenameValue(u.name); }}>✎</button>
                            <button className="uab uab-d" title="Delete this user"
                              onClick={function(e) { e.stopPropagation(); setConfirmDeleteUserId(u.id); }}>✕</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="user-add-row">
                    <input className="user-add-input" placeholder="Name…" value={newUserName}
                      onChange={function(e) { setNewUserName(e.target.value); }}
                      onKeyDown={function(e) { if (e.key === "Enter") handleCreateUser(); }} />
                    <button className="user-add-btn" onClick={handleCreateUser} title="Add user">+</button>
                  </div>
                </div>

                <div className="user-main">
                  {!activeUserId ? (
                    <div className="no-user-msg">👤<br /><br />Create a user to start tracking progress.</div>
                  ) : (
                    <>
                      {results.length > 0 && (
                        <>
                          <div className="stat-grid">
                            <div className="stat-card">
                              <div className="stat-val">{lastSec}</div>
                              <div className="stat-key">{t.progress.lastResult}</div>
                            </div>
                            <div className="stat-card">
                              <div className="stat-val">{bestSec}</div>
                              <div className="stat-key">{t.progress.bestResult}</div>
                            </div>
                            <div className="stat-card">
                              <div className="stat-val">{dailyData.length}</div>
                              <div className="stat-key">{t.progress.sessions}</div>
                            </div>
                            <div className="stat-card">
                              <div className="stat-val">
                                {dailyData.length ? Math.round(dailyData.reduce(function(a, b) { return a + b.avg; }, 0) / dailyData.length) : "–"}
                              </div>
                              <div className="stat-key">{t.progress.dailyAvg}</div>
                            </div>
                          </div>
                          <div className="card">
                            <div className="range-btns">
                              {[["7", t.progress.chart7], ["30", t.progress.chart30], ["all", t.progress.chartAll]].map(function(item) {
                                return (
                                  <button key={item[0]} className={"range-btn" + (chartRange === item[0] ? " active" : "")}
                                    onClick={function() { setChartRange(item[0]); }}>{item[1]}</button>
                                );
                              })}
                            </div>
                            <HealthChart data={dailyData} range={chartRange} />
                            <div className="zone-legend">
                              {zoneLegend.map(function(z) {
                                return (
                                  <div key={z.label} className="zone-swatch">
                                    <div className="zone-dot" style={{ background: z.color }} />
                                    {z.label}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}

                      {showAddResult ? (
                        <div className="add-result-bar">
                          <div className="add-result-label">{t.progress.addPrompt}</div>
                          <input className="add-result-input" type="number" min="1" max="999"
                            placeholder="sec" value={manualSec} autoFocus
                            onChange={function(e) { setManualSec(e.target.value.replace(/[^0-9]/g, "")); }}
                            onKeyDown={function(e) {
                              if (e.key === "Enter") handleAddManualResult();
                              if (e.key === "Escape") { setShowAddResult(false); setManualSec(""); }
                            }} />
                          <button className="add-result-ok" onClick={handleAddManualResult}>Save</button>
                          <button className="add-result-x" onClick={function() { setShowAddResult(false); setManualSec(""); }}>✕</button>
                        </div>
                      ) : (
                        <button className="add-result-btn" onClick={function() { setShowAddResult(true); }}>
                          {t.progress.addResult}
                        </button>
                      )}

                      <div className="card" style={{ padding: "14px 12px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: "#1a2e22" }}>
                          {t.progress.history}
                        </div>
                        {results.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "16px 0", color: "#94a3b8", fontSize: 13 }}>
                            🌬️ {t.progress.noData}
                          </div>
                        ) : (
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>{t.progress.day}</th>
                                <th>{t.progress.time}</th>
                                <th>{t.progress.duration}</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {[].concat(results).reverse().map(function(r, ri) {
                                var origIdx = results.length - 1 - ri;
                                var lvl = getLevel(r.sec, t);
                                var d = new Date(r.ts);
                                return (
                                  <tr key={String(r.ts) + "-" + origIdx}>
                                    <td><div className="row-date">{d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</div></td>
                                    <td><div className="row-time">{d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</div></td>
                                    <td>
                                      <span style={{ fontWeight: 700, fontSize: 14, color: lvl.color }}>{r.sec}s</span>
                                      {" "}
                                      <span style={{ fontSize: 10, color: lvl.color, background: lvl.color + "18", padding: "1px 6px", borderRadius: 8, fontWeight: 600 }}>{lvl.label}</span>
                                    </td>
                                    <td style={{ width: 32 }}>
                                      <button className="row-del" title="Delete this result"
                                        onClick={function() { handleDeleteResult(origIdx); }}>🗑</button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>

                      {results.length > 0 && (
                        <button className="clear-btn" onClick={function() { setConfirmClearData(true); }}>
                          {t.progress.clearData}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === 4 && (
            <>
              <div className="section-title">{t.learn.title}</div>
              <div style={{ marginBottom: 16 }} />
              {t.learn.sections.map(function(s, i) {
                return (
                  <div className="card edu-section" key={i}>
                    <div className="edu-icon-title">
                      <div className="edu-icon">{s.icon}</div>
                      <div className="edu-title">{s.title}</div>
                    </div>
                    <div className="edu-text">{s.content}</div>
                  </div>
                );
              })}
              <div className="divider" />
              <button className="consult-btn"
                onClick={function() { window.open(consultUrl, "_blank", "noopener,noreferrer"); }}>
                🌿 {t.consult.button}
              </button>
            </>
          )}

        </div>
      </div>

      {confirmDeleteUserId && (function() {
        var u = users.find(function(x) { return x.id === confirmDeleteUserId; });
        return (
          <div className="confirm-overlay" onClick={function() { setConfirmDeleteUserId(null); }}>
            <div className="confirm-box" onClick={function(e) { e.stopPropagation(); }}>
              <div className="confirm-icon">👤</div>
              <div className="confirm-title">Delete user?</div>
              <div className="confirm-msg">Delete <strong>{u ? u.name : ""}</strong> and all their data? This cannot be undone.</div>
              <div className="confirm-btns">
                <button className="confirm-cancel" onClick={function() { setConfirmDeleteUserId(null); }}>Cancel</button>
                <button className="confirm-ok" onClick={function() { handleDeleteUser(confirmDeleteUserId); setConfirmDeleteUserId(null); }}>Delete</button>
              </div>
            </div>
          </div>
        );
      })()}

      {confirmClearData && (
        <div className="confirm-overlay" onClick={function() { setConfirmClearData(false); }}>
          <div className="confirm-box" onClick={function(e) { e.stopPropagation(); }}>
            <div className="confirm-icon">🗑️</div>
            <div className="confirm-title">Delete all data?</div>
            <div className="confirm-msg">{t.progress.confirmClear}</div>
            <div className="confirm-btns">
              <button className="confirm-cancel" onClick={function() { setConfirmClearData(false); }}>Cancel</button>
              <button className="confirm-ok" onClick={function() {
                var updated = Object.assign({}, allResults, { [activeUserId]: [] });
                setAllResults(updated);
                save("cp_all_results", updated);
                setConfirmClearData(false);
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
