import { useState } from "react";

// ── THEME ─────────────────────────────────────────────────────────────────────
const T = {
  bg: "#0f1923",
  surface: "#162030",
  card: "#1c2a3a",
  border: "#263a4e",
  text: "#e8eef5",
  muted: "#7a93aa",
  fluids: "#0ea5e9",
  elec: "#f59e0b",
  acid: "#10b981",
  danger: "#ef4444",
  warn: "#f97316",
};

// ── DATA ──────────────────────────────────────────────────────────────────────

const MODULES = [
  { id: "fluids", label: "Fluids", emoji: "💧", color: T.fluids },
  { id: "electrolytes", label: "Electrolytes", emoji: "⚡", color: T.elec },
  { id: "acidbase", label: "Acid-Base", emoji: "🧪", color: T.acid },
  { id: "abg", label: "ABG Interpreter", emoji: "🔬", color: "#a78bfa" },
];

// ── FLUIDS DATA ───────────────────────────────────────────────────────────────
const fluidCompartments = [
  { name: "Intracellular (ICF)", pct: 67, color: T.fluids, desc: "Inside cells — ~2/3 of total body water. High in K⁺, Mg²⁺, phosphate." },
  { name: "Interstitial (ECF)", pct: 22, color: "#38bdf8", desc: "Fluid between cells. Part of ECF. High in Na⁺, Cl⁻." },
  { name: "Intravascular (ECF)", pct: 8, color: "#7dd3fc", desc: "Blood plasma. Part of ECF. Monitored via serum labs & CBC." },
  { name: "Transcellular (ECF)", pct: 3, color: "#bae6fd", desc: "CSF, pleural, pericardial, synovial fluids. Part of ECF." },
];

const movementMechanisms = [
  {
    name: "Active Transport",
    icon: "⚙️",
    energy: "Requires ATP",
    direction: "Against gradient",
    example: "Na⁺/K⁺ pump: pushes 3 Na⁺ OUT of cell, 2 K⁺ INTO cell → keeps ICF high in K⁺, low in Na⁺",
    tip: "Think of it as a bouncer: costs energy to check IDs and selectively let ions in/out.",
  },
  {
    name: "Diffusion",
    icon: "〰️",
    energy: "No energy needed",
    direction: "High → Low concentration",
    example: "Electrolytes diffuse within compartments continuously. Needs protein channel to cross membranes.",
    tip: "Like a crowd spreading out in a room — people naturally move from crowded to less crowded areas.",
  },
  {
    name: "Osmosis",
    icon: "🔵",
    energy: "No energy needed",
    direction: "Low → High concentration (water moves)",
    example: "WATER moves across cell membranes from dilute → concentrated solution. Governs ICF ↔ ECF balance.",
    tip: "Water chases the particles. More solutes = more water attracted = higher osmotic pull.",
  },
  {
    name: "Filtration",
    icon: "🫀",
    energy: "No energy needed",
    direction: "High → Low pressure",
    example: "Governs fluid between blood vessels ↔ interstitial space. Monitor serum albumin & CBC.",
    tip: "Like squeezing a sponge — pressure pushes fluid out of capillaries into interstitial space.",
  },
];

const ivSolutions = [
  {
    type: "Isotonic", osmol: "~285 mOsm/L", color: "#0ea5e9",
    examples: ["0.9% NaCl (Normal Saline)", "Lactated Ringer's (LR)", "D5W (starts isotonic — dextrose metabolized rapidly)"],
    effect: "Expands fluid volume WITHOUT causing fluid shift between compartments",
    use: "Volume replacement, dehydration, pre/post-op hydration",
    caution: "Risk of fluid overload if excessive",
  },
  {
    type: "Hypotonic", osmol: "< 275 mOsm/L", color: "#34d399",
    examples: ["0.45% NaCl (½ NS)", "0.33% NaCl (⅓ NS)", "0.225% NaCl (¼ NS)"],
    effect: "Water drawn from vessels → INTO CELLS (cells swell). ECF → ICF shift.",
    use: "Cellular dehydration, hypernatremia, diabetic ketoacidosis",
    caution: "⚠️ Can cause cerebral edema if given too fast — cells swell including brain cells",
  },
  {
    type: "Hypertonic", osmol: "> 295 mOsm/L", color: "#f59e0b",
    examples: ["D10W", "D5NS", "D5 ½ NS"],
    effect: "Water drawn FROM CELLS → into vascular system (cells shrink). ICF → ECF/intravascular shift.",
    use: "Severe hyponatremia, cellular edema",
    caution: "⚠️ Can cause vascular overload, cell dehydration — must infuse slowly with close monitoring",
  },
];

const ivComplications = [
  { name: "Infiltration", icon: "💧", signs: "Skin taut, pale/blanched, cool; edema; infusion slows/stops", action: "Stop infusion, DC IV (unless vesicant), elevate extremity, warm or cold compress" },
  { name: "Extravasation", icon: "⚠️", signs: "All infiltration signs PLUS pain", action: "Do NOT DC IV if vesicant drug — call provider immediately" },
  { name: "Phlebitis", icon: "🔴", signs: "Redness, tenderness, pain, warmth, red streak along vein", action: "Stop infusion, DC IV ASAP, apply warm moist compress" },
  { name: "Local Infection", icon: "🦠", signs: "Redness, heat, swelling, purulent drainage", action: "Clean skin, culture drainage, save catheter tip for culture, wound care" },
];

// ── ELECTROLYTES DATA ─────────────────────────────────────────────────────────
const electrolytes = [
  {
    name: "Sodium (Na⁺)", normal: "135–145 mEq/L", location: "Major ECF cation", color: "#0ea5e9",
    role: "Maintains water balance & regulates blood volume. Inversely related to K⁺.",
    hypo: { name: "Hyponatremia", cut: "< 135", causes: ["Vomiting/diarrhea", "Diuretics", "Heart failure", "Excess IV fluids", "Water intoxication"], sx: ["N/V, anorexia", "Lethargy, confusion", "Dilute urine (SG < 1.010)"], tx: ["Monitor I/O & Na⁺", "Increase oral Na⁺ intake", "Check urine specific gravity", "Monitor GI & CNS symptoms"] },
    hyper: { name: "Hypernatremia", cut: "> 145", causes: ["Fever, respiratory infection", "Profuse sweating / heat stroke", "High sodium diet", "Water deprivation"], sx: ["Intense thirst", "Oliguria", "Decreased LOC", "Concentrated urine (SG > 1.030)"], tx: ["Monitor I/O & Na⁺", "Increase fluid intake", "Water between tube feedings", "Restrict Na⁺ in diet"] },
    tip: "💡 Na⁺ = Water magnet. High Na → water follows → hypernatremia = dehydration. Low Na → water leaves vessels → hyponatremia = water overload.",
  },
  {
    name: "Potassium (K⁺)", normal: "3.5–5.0 mEq/L", location: "Major ICF cation", color: "#f59e0b",
    role: "Regulates cellular water content. Vital for cardiac, skeletal, and nerve electrical impulses. Inversely related to Na⁺.",
    hypo: { name: "Hypokalemia", cut: "< 3.5", causes: ["K⁺-wasting diuretics (Lasix/furosemide)", "GI losses (vomiting, diarrhea, suctioning)", "Excessive sweating", "Steroids", "Decreased K⁺ intake"], sx: ["Anorexia, N/V", "Life-threatening cardiac dysrhythmias", "Abdominal distention", "Muscle weakness, fatigue"], tx: ["Monitor K⁺ level", "Increase K⁺ in diet", "K⁺ supplements (⚠️ check urine output FIRST)", "Monitor cardiac rhythm"] },
    hyper: { name: "Hyperkalemia", cut: "> 5.0", causes: ["Renal failure (most common)", "Severe burns", "K⁺-sparing diuretics (spironolactone)", "High K⁺ intake", "Acidosis (shifts K⁺ from ICF → ECF)"], sx: ["Oliguria", "Life-threatening dysrhythmias (Tall T waves on ECG)", "Muscle weakness", "Paresthesia", "Diarrhea"], tx: ["Monitor K⁺ & ECG", "Limit K⁺ foods", "Increase fluids for excretion", "Kayexelate", "Glucose + Insulin (pulls K⁺ into cells)", "Dialysis if severe"] },
    tip: "💡 K⁺ is the #1 cardiac electrolyte. BOTH hypo and hyperkalemia → life-threatening dysrhythmias. Always check urine output before giving K⁺ supplements (kidneys must be working).",
  },
  {
    name: "Calcium (Ca²⁺)", normal: "8.4–10.5 mg/dL (total)", location: "Major cation in bones", color: "#a78bfa",
    role: "Regulates muscle contractions, cardiac automaticity, and blood clotting. Ca²⁺ and phosphate (PO₄³⁻) are inversely related.",
    hypo: { name: "Hypocalcemia", cut: "< 8.4 mg/dL", causes: ["Hypoparathyroidism (or post-thyroidectomy damage)", "Chronic diarrhea", "Malabsorption", "Pancreatitis", "Vitamin D deficiency"], sx: ["Paresthesia", "Muscle cramps", "Tetany (Chvostek's/Trousseau's signs)"], tx: ["Monitor Ca²⁺", "Increase Ca²⁺ in diet", "Ca²⁺ supplements"] },
    hyper: { name: "Hypercalcemia", cut: "> 10.5 mg/dL", causes: ["Hyperparathyroidism", "Malignant bone disease (lung/breast CA with bone metastasis)", "Prolonged immobilization", "Excess Ca²⁺ supplements"], sx: ["Muscle weakness", "Constipation", "N/V, anorexia", "Kidney stones", "Diminished reflexes", "Decreased LOC"], tx: ["Monitor Ca²⁺", "Encourage fluids & fiber", "Limit Ca²⁺ in diet", "Avoid Ca²⁺ antacids"] },
    tip: "💡 Ca²⁺ = Bones, nerves, heart, clotting. Low Ca²⁺ → muscles overfire (tetany, cramps). High Ca²⁺ → muscles underfire (weakness, constipation). 'Bones, stones, groans, moans' = hypercalcemia symptoms.",
  },
  {
    name: "Magnesium (Mg²⁺)", normal: "1.5–2.5 mEq/L", location: "Mostly ICF", color: "#10b981",
    role: "Key role in metabolism, neuromuscular and cardiac function.",
    hypo: { name: "Hypomagnesemia", cut: "< 1.5", causes: ["Chronic alcoholism", "Malabsorption", "Malnutrition", "Diarrhea"], sx: ["Hyperactive reflexes", "Seizures", "Tachyarrhythmias", "Insomnia", "Twitching/tremors", "Hypertension"], tx: ["Monitor I/O", "Increase Mg²⁺ in diet", "Avoid alcohol", "Seizure precautions"] },
    hyper: { name: "Hypermagnesemia", cut: "> 2.5", causes: ["Renal failure", "Mg²⁺-containing laxatives/antacids"], sx: ["Flushing & sweating", "Hypotension", "Decreased respirations", "Dysrhythmias", "Decreased deep tendon reflexes"], tx: ["Monitor I/O, BP, respirations", "Monitor reflexes", "Limit Mg²⁺ in diet", "Avoid Mg²⁺-based antacids/laxatives"] },
    tip: "💡 Mg²⁺ = the 'forgotten electrolyte.' Low Mg²⁺ → everything overexcites (seizures, twitching). High Mg²⁺ → everything slows down (low BP, slow breathing, lost reflexes).",
  },
];

// ── ACID-BASE DATA ────────────────────────────────────────────────────────────
const abgNormals = { pH: [7.35, 7.45], paCO2: [35, 45], hco3: [21, 28] };

const disorders = [
  {
    name: "Respiratory Acidosis", color: "#ef4444", icon: "🔴",
    cause: "Alveolar HYPOVENTILATION → lungs can't excrete enough CO₂ → excess carbonic acid → ↓ pH",
    abg: { pH: "< 7.35", paCO2: "> 45 ↑", hco3: "Normal (uncomp.) / > 28 (partial comp.)" },
    sx: ["Dyspnea, respiratory distress", "Shallow respirations", "Headache, restlessness", "Confusion, decreased LOC", "Tachycardia, dysrhythmias (↑K⁺)"],
    causes: ["Head injury (depressed CNS)", "Narcotics, sedatives", "SCI (decreased neuromuscular function)", "Pneumonia, PE, obstruction", "Pain / hypoventilation"],
    compensate: "Kidneys retain HCO₃⁻ to buffer — takes 24 hrs to start, 3–5 days to stabilize",
    tip: "🧠 CO₂ = Acid. More CO₂ retained → more acid → ↓ pH. Think: can't blow off acid → acidosis.",
  },
  {
    name: "Respiratory Alkalosis", color: "#3b82f6", icon: "🔵",
    cause: "Alveolar HYPERVENTILATION → lungs excrete too much CO₂ → deficit of carbonic acid → ↑ pH",
    abg: { pH: "> 7.45", paCO2: "< 35 ↓", hco3: "Normal (uncomp.) / < 21 (partial comp.)" },
    sx: ["Light-headedness, numbness/tingling", "Confusion, blurred vision", "Decreased concentration", "Palpitations, diaphoresis", "Dry mouth", "Tetanic spasms of arms/legs"],
    causes: ["Anxiety, fear", "Pain", "Fever, sepsis (increased metabolic demand)", "Respiratory stimulant medications"],
    compensate: "Kidneys excrete HCO₃⁻ to lower pH — takes 24 hrs to start",
    tip: "🧠 Blowing off too much CO₂ → blowing off acid → ↑ pH. Classic: anxious patient hyperventilating → tingling fingers.",
  },
  {
    name: "Metabolic Acidosis", color: "#f97316", icon: "🟠",
    cause: "↑ metabolic acids OR ↓ HCO₃⁻. Kidneys can't excrete enough metabolic acids, or HCO₃⁻ lost (e.g., diarrhea).",
    abg: { pH: "< 7.35", paCO2: "Normal (uncomp.) / < 35 (partial comp.)", hco3: "< 21 ↓" },
    sx: ["Headache, confusion, restlessness", "Lethargy → stupor → coma", "Dysrhythmias", "Warm, flushed skin", "Kussmaul respirations (deep rapid breathing = compensating)", "Diarrhea"],
    causes: ["Renal failure", "Diabetic ketoacidosis (DKA)", "Starvation", "Salicylate intoxication", "Severe diarrhea (HCO₃⁻ loss)"],
    compensate: "Lungs hyperventilate (Kussmaul) to blow off CO₂ = blowing off acid → raises pH. FAST — within minutes!",
    tip: "🧠 DKA patient breathing very deeply (Kussmaul) = their lungs compensating for metabolic acidosis. HCO₃⁻ ↓ = less base = more acidic.",
  },
  {
    name: "Metabolic Alkalosis", color: "#8b5cf6", icon: "🟣",
    cause: "↓ metabolic acid (vomiting, hypokalemia) OR ↑ HCO₃⁻. Usually IATROGENIC (caused by treatment).",
    abg: { pH: "> 7.45", paCO2: "Normal (uncomp.) / > 45 (partial comp.)", hco3: "> 28 ↑" },
    sx: ["Respiratory depression (compensation)", "Dizziness, lethargy, disorientation", "Seizures, coma", "Weakness, muscle twitching/cramps", "Tetany", "N/V"],
    causes: ["Protracted vomiting / gastric suction (lose HCl acid)", "Antacid ingestion / excess NaHCO₃", "Excessive diuretics", "Hypokalemia", "Lactate in dialysis"],
    compensate: "Lungs hypoventilate to retain CO₂ (retain acid) → lowers pH. Also fast.",
    tip: "🧠 Vomiting = losing stomach acid (HCl) = losing acid = becoming alkalotic. Low K⁺ also shifts H⁺ into cells → blood becomes more alkaline.",
  },
];

// ── ABG INTERPRETER ───────────────────────────────────────────────────────────
function interpretABG(pH, paCO2, hco3) {
  const pHAcid = pH < 7.35, pHAlk = pH > 7.45;
  const co2High = paCO2 > 45, co2Low = paCO2 < 35;
  const hco3Low = hco3 < 21, hco3High = hco3 > 28;
  let disorder = "", compensation = "Uncompensated", explanation = [];

  if (!pHAcid && !pHAlk) {
    if (co2High && hco3High) { disorder = "Fully Compensated Respiratory Acidosis OR Metabolic Alkalosis"; compensation = "Fully Compensated"; }
    else if (co2Low && hco3Low) { disorder = "Fully Compensated Respiratory Alkalosis OR Metabolic Acidosis"; compensation = "Fully Compensated"; }
    else { disorder = "Normal ABG"; explanation = ["All values within normal limits."]; return { disorder, compensation, explanation, color: "#10b981" }; }
  } else if (pHAcid) {
    if (co2High && !hco3High) { disorder = "Respiratory Acidosis"; explanation = ["pH ↓ + PaCO₂ ↑ = lungs retaining CO₂ (hypoventilation)", "HCO₃⁻ normal → uncompensated"]; }
    else if (co2High && hco3High) { disorder = "Respiratory Acidosis"; compensation = "Partially Compensated"; explanation = ["pH ↓ + PaCO₂ ↑ + HCO₃⁻ ↑ = kidneys retaining bicarb to raise pH", "Still acidotic → partially compensated"]; }
    else if (hco3Low && !co2Low) { disorder = "Metabolic Acidosis"; explanation = ["pH ↓ + HCO₃⁻ ↓ = kidneys can't excrete metabolic acids or HCO₃⁻ loss", "PaCO₂ normal → uncompensated"]; }
    else if (hco3Low && co2Low) { disorder = "Metabolic Acidosis"; compensation = "Partially Compensated"; explanation = ["pH ↓ + HCO₃⁻ ↓ + PaCO₂ ↓ = lungs hyperventilating (Kussmaul) to blow off CO₂", "Still acidotic → partially compensated"]; }
    else { disorder = "Mixed Disorder"; explanation = ["Values suggest a mixed acid-base disorder — clinical context needed."]; }
  } else {
    if (co2Low && !hco3Low) { disorder = "Respiratory Alkalosis"; explanation = ["pH ↑ + PaCO₂ ↓ = lungs blowing off too much CO₂ (hyperventilation)", "HCO₃⁻ normal → uncompensated"]; }
    else if (co2Low && hco3Low) { disorder = "Respiratory Alkalosis"; compensation = "Partially Compensated"; explanation = ["pH ↑ + PaCO₂ ↓ + HCO₃⁻ ↓ = kidneys excreting bicarb to lower pH", "Still alkalotic → partially compensated"]; }
    else if (hco3High && !co2High) { disorder = "Metabolic Alkalosis"; explanation = ["pH ↑ + HCO₃⁻ ↑ = excess base (bicarb) or loss of metabolic acid", "PaCO₂ normal → uncompensated"]; }
    else if (hco3High && co2High) { disorder = "Metabolic Alkalosis"; compensation = "Partially Compensated"; explanation = ["pH ↑ + HCO₃⁻ ↑ + PaCO₂ ↑ = lungs hypoventilating to retain CO₂ (retain acid)", "Still alkalotic → partially compensated"]; }
    else { disorder = "Mixed Disorder"; explanation = ["Values suggest a mixed acid-base disorder — clinical context needed."]; }
  }

  const color = disorder.includes("Acidosis") ? "#ef4444" : disorder.includes("Alkalosis") ? "#3b82f6" : disorder === "Normal ABG" ? "#10b981" : "#f97316";
  return { disorder, compensation, explanation, color };
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function StudyGuide() {
  const [module, setModule] = useState("fluids");
  const [expanded, setExpanded] = useState(null);
  const [elecTab, setElecTab] = useState(0);
  const [imbalanceView, setImbalanceView] = useState("hypo");
  const [disorderIdx, setDisorderIdx] = useState(0);
  const [abgVals, setAbgVals] = useState({ pH: "7.32", paCO2: "48", hco3: "25" });
  const [abgResult, setAbgResult] = useState(null);
  const [ivTab, setIvTab] = useState(0);

  const cur = electrolytes[elecTab];

  const btn = (active, color, label, onClick) => (
    <button onClick={onClick} style={{
      padding: "0.45rem 1rem", borderRadius: "2rem", border: `2px solid ${active ? color : T.border}`,
      background: active ? color : "transparent", color: active ? "#0f1923" : T.muted,
      fontFamily: "inherit", fontSize: "0.8rem", cursor: "pointer", fontWeight: 700, transition: "all 0.15s",
    }}>{label}</button>
  );

  const card = (children, style = {}) => (
    <div style={{ background: T.card, borderRadius: "0.75rem", border: `1px solid ${T.border}`, padding: "1.25rem", ...style }}>
      {children}
    </div>
  );

  const tag = (text, color) => (
    <span style={{ background: `${color}22`, color, border: `1px solid ${color}55`, borderRadius: "0.4rem", padding: "0.15rem 0.5rem", fontSize: "0.75rem", fontWeight: 700 }}>{text}</span>
  );

  return (
    <div style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", background: T.bg, minHeight: "100vh", color: T.text }}>

      {/* ── HEADER ── */}
      <div style={{ background: `linear-gradient(135deg, #0a1520 0%, #0f1f35 60%, #0a1a2e 100%)`, padding: "2rem 1.5rem 1.5rem", textAlign: "center", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: T.muted, marginBottom: "0.4rem" }}>Chapter 42 · Nursing Fundamentals</div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.5rem,4vw,2.4rem)", fontWeight: 400, letterSpacing: "0.02em", color: "#f0f6ff" }}>
          Fluids, Electrolytes & Acid-Base Balance
        </h1>
        <p style={{ color: T.muted, margin: "0.5rem 0 1.25rem", fontSize: "0.9rem" }}>Interactive Instructor Study Guide</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setModule(m.id)} style={{
              padding: "0.5rem 1.25rem", borderRadius: "0.5rem",
              border: `2px solid ${module === m.id ? m.color : T.border}`,
              background: module === m.id ? `${m.color}22` : "transparent",
              color: module === m.id ? m.color : T.muted,
              fontFamily: "inherit", fontSize: "0.85rem", cursor: "pointer", fontWeight: 700,
              transition: "all 0.15s",
            }}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>

        {/* ══════════════════════════════════════════
            MODULE: FLUIDS
        ══════════════════════════════════════════ */}
        {module === "fluids" && (
          <div>
            <SectionTitle color={T.fluids}>💧 Body Fluid Compartments</SectionTitle>

            {/* Compartment visual bars */}
            {card(
              <div>
                <p style={{ color: T.muted, fontSize: "0.85rem", marginTop: 0, marginBottom: "1rem" }}>
                  Total body water is distributed across compartments. ICF = ~⅔, ECF = ~⅓ (interstitial + intravascular + transcellular).
                </p>
                {fluidCompartments.map(c => (
                  <div key={c.name} style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontWeight: 600, color: c.color, fontSize: "0.9rem" }}>{c.name}</span>
                      <span style={{ color: T.muted, fontSize: "0.85rem" }}>{c.pct}%</span>
                    </div>
                    <div style={{ background: T.border, borderRadius: "1rem", height: 10, overflow: "hidden" }}>
                      <div style={{ width: `${c.pct}%`, height: "100%", background: c.color, borderRadius: "1rem" }} />
                    </div>
                    <div style={{ color: T.muted, fontSize: "0.8rem", marginTop: "0.25rem" }}>{c.desc}</div>
                  </div>
                ))}
                <div style={{ marginTop: "1rem", background: `${T.fluids}11`, borderRadius: "0.5rem", padding: "0.75rem 1rem", borderLeft: `3px solid ${T.fluids}` }}>
                  <span style={{ color: T.fluids, fontWeight: 700, fontSize: "0.85rem" }}>Key Rule: </span>
                  <span style={{ color: T.muted, fontSize: "0.85rem" }}>Na⁺ follows water. ↑ urination → ↑ Na⁺ loss. Fluid distribution between ECF compartments uses <strong style={{ color: T.text }}>filtration</strong>; between ICF and ECF uses <strong style={{ color: T.text }}>osmosis</strong>.</span>
                </div>
              </div>
            )}

            <SectionTitle color={T.fluids} mt>〰️ Fluid Movement Mechanisms</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {movementMechanisms.map(m => (
                <div key={m.name} onClick={() => setExpanded(expanded === m.name ? null : m.name)}
                  style={{ background: T.card, border: `1px solid ${expanded === m.name ? T.fluids : T.border}`, borderRadius: "0.75rem", padding: "1rem", cursor: "pointer", transition: "border-color 0.15s" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{m.icon}</div>
                  <div style={{ fontWeight: 700, color: T.fluids, marginBottom: "0.3rem" }}>{m.name}</div>
                  <div style={{ fontSize: "0.8rem", color: T.muted }}>{m.energy} · {m.direction}</div>
                  {expanded === m.name && (
                    <div style={{ marginTop: "0.75rem", borderTop: `1px solid ${T.border}`, paddingTop: "0.75rem" }}>
                      <div style={{ fontSize: "0.85rem", color: T.text, marginBottom: "0.5rem" }}>{m.example}</div>
                      <div style={{ background: `${T.fluids}15`, borderRadius: "0.4rem", padding: "0.5rem 0.7rem", fontSize: "0.82rem", color: "#7dd3fc" }}>{m.tip}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p style={{ color: T.muted, fontSize: "0.78rem", textAlign: "center", marginTop: "0.5rem" }}>Tap a card to expand</p>

            <SectionTitle color={T.fluids} mt>🧪 IV Fluid Types</SectionTitle>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              {ivSolutions.map((s, i) => btn(ivTab === i, s.color, s.type, () => setIvTab(i)))}
            </div>
            {(() => {
              const s = ivSolutions[ivTab];
              return card(
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <span style={{ color: s.color, fontWeight: 800, fontSize: "1.1rem" }}>{s.type}</span>
                    {tag(s.osmol, s.color)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <div style={{ color: T.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Examples</div>
                      {s.examples.map(e => <div key={e} style={{ fontSize: "0.88rem", color: T.text, marginBottom: "0.2rem" }}>• {e}</div>)}
                    </div>
                    <div>
                      <div style={{ color: T.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Clinical Use</div>
                      <div style={{ fontSize: "0.88rem", color: T.text }}>{s.use}</div>
                    </div>
                  </div>
                  <div style={{ background: `${s.color}15`, borderRadius: "0.5rem", padding: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{ color: T.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Fluid Shift Effect</div>
                    <div style={{ color: s.color, fontWeight: 600, fontSize: "0.9rem" }}>{s.effect}</div>
                  </div>
                  <div style={{ background: "#ef444415", borderRadius: "0.5rem", padding: "0.6rem 0.75rem", borderLeft: "3px solid #ef4444" }}>
                    <span style={{ color: "#ef4444", fontWeight: 700, fontSize: "0.82rem" }}>⚠️ Caution: </span>
                    <span style={{ color: T.muted, fontSize: "0.82rem" }}>{s.caution}</span>
                  </div>
                </div>
              );
            })()}

            <SectionTitle color={T.warn} mt>⚠️ IV Complications</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {ivComplications.map(c => (
                <div key={c.name} onClick={() => setExpanded(expanded === c.name ? null : c.name)}
                  style={{ background: T.card, border: `1px solid ${expanded === c.name ? T.warn : T.border}`, borderRadius: "0.75rem", padding: "1rem", cursor: "pointer" }}>
                  <div style={{ fontSize: "1.25rem", marginBottom: "0.3rem" }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, color: T.warn, fontSize: "0.95rem" }}>{c.name}</div>
                  {expanded === c.name && (
                    <div style={{ marginTop: "0.75rem", borderTop: `1px solid ${T.border}`, paddingTop: "0.75rem" }}>
                      <div style={{ color: T.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>Signs</div>
                      <div style={{ fontSize: "0.83rem", color: T.text, marginBottom: "0.6rem" }}>{c.signs}</div>
                      <div style={{ color: T.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>Action</div>
                      <div style={{ fontSize: "0.83rem", color: "#fbbf24" }}>{c.action}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            MODULE: ELECTROLYTES
        ══════════════════════════════════════════ */}
        {module === "electrolytes" && (
          <div>
            {card(
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ color: T.muted, fontSize: "0.85rem", marginRight: "0.5rem" }}>Select electrolyte:</span>
                {electrolytes.map((e, i) => btn(elecTab === i, e.color, e.name.split(" ")[0], () => { setElecTab(i); setImbalanceView("hypo"); }))}
              </div>
            , { padding: "0.85rem 1.25rem", marginBottom: "1rem" })}

            {card(
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <div>
                    <h2 style={{ margin: 0, color: cur.color, fontSize: "1.3rem", fontWeight: 700 }}>{cur.name}</h2>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                      {tag(cur.normal, cur.color)}
                      {tag(cur.location, T.muted)}
                    </div>
                  </div>
                </div>
                <div style={{ background: `${cur.color}12`, borderRadius: "0.5rem", padding: "0.75rem 1rem", borderLeft: `3px solid ${cur.color}`, marginBottom: "1rem" }}>
                  <span style={{ color: cur.color, fontWeight: 600, fontSize: "0.88rem" }}>Role: </span>
                  <span style={{ color: T.muted, fontSize: "0.88rem" }}>{cur.role}</span>
                </div>
                <div style={{ background: "#fbbf2415", borderRadius: "0.5rem", padding: "0.65rem 0.9rem", fontSize: "0.85rem", color: "#fbbf24" }}>
                  {cur.tip}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
              {btn(imbalanceView === "hypo", "#3b82f6", `↓ ${cur.hypo.name} (${cur.hypo.cut})`, () => setImbalanceView("hypo"))}
              {btn(imbalanceView === "hyper", "#ef4444", `↑ ${cur.hyper.name} (${cur.hyper.cut})`, () => setImbalanceView("hyper"))}
            </div>

            {(() => {
              const d = imbalanceView === "hypo" ? cur.hypo : cur.hyper;
              const c = imbalanceView === "hypo" ? "#3b82f6" : "#ef4444";
              return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                  {[
                    { label: "Causes", items: d.causes, color: "#f97316" },
                    { label: "Signs & Symptoms", items: d.sx, color: c },
                    { label: "Nursing Interventions", items: d.tx, color: "#10b981" },
                  ].map(col => card(
                    <div key={col.label}>
                      <div style={{ color: col.color, fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>{col.label}</div>
                      {col.items.map(item => (
                        <div key={item} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "flex-start" }}>
                          <span style={{ color: col.color, marginTop: "0.1rem" }}>▸</span>
                          <span style={{ fontSize: "0.87rem", color: T.text, lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })()}

            <SectionTitle color={T.elec} mt>❤️ Critical Point: Cardiac Safety</SectionTitle>
            {card(
              <div>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", color: T.text, lineHeight: 1.6 }}>
                  The heart is a <strong style={{ color: T.elec }}>muscle that relies on electrical impulses</strong>. Stable K⁺, Ca²⁺, and Mg²⁺ are required to maintain normal sinus rhythm.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  {["K⁺ (Potassium)", "Ca²⁺ (Calcium)", "Mg²⁺ (Magnesium)"].map(e => (
                    <div key={e} style={{ background: "#ef444415", border: "1px solid #ef444455", borderRadius: "0.5rem", padding: "0.4rem 0.8rem", fontSize: "0.83rem", color: "#fca5a5", fontWeight: 600 }}>
                      ⚡ {e}
                    </div>
                  ))}
                </div>
                <p style={{ margin: "0.75rem 0 0", fontSize: "0.85rem", color: T.muted, lineHeight: 1.6 }}>
                  Both <strong style={{ color: "#ef4444" }}>hyper-</strong> and <strong style={{ color: "#3b82f6" }}>hypo-</strong> states of these electrolytes can lead to <strong style={{ color: "#ef4444" }}>life-threatening cardiac dysrhythmias</strong>. The lungs also depend on the diaphragm and intercostal muscles — which require stable electrolytes to function.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            MODULE: ACID-BASE
        ══════════════════════════════════════════ */}
        {module === "acidbase" && (
          <div>
            {card(
              <div>
                <div style={{ fontWeight: 700, color: T.acid, marginBottom: "0.75rem", fontSize: "1rem" }}>🧪 The Fundamental Equation</div>
                <div style={{ background: T.surface, borderRadius: "0.5rem", padding: "1rem", textAlign: "center", fontSize: "clamp(0.85rem,2vw,1rem)", color: T.text, fontFamily: "monospace", letterSpacing: "0.03em", lineHeight: 2 }}>
                  CO₂ + H₂O &nbsp;⇌&nbsp; H₂CO₃ &nbsp;⇌&nbsp; H⁺ + HCO₃⁻
                  <div style={{ fontSize: "0.78rem", color: T.muted, fontFamily: "inherit", lineHeight: 1.4, marginTop: "0.3rem" }}>
                    Carbon Dioxide + Water ⇌ Carbonic Acid ⇌ Hydrogen Ion + Bicarbonate
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
                  <div style={{ background: "#ef444415", borderRadius: "0.5rem", padding: "0.7rem", borderLeft: "3px solid #ef4444" }}>
                    <div style={{ color: "#ef4444", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.3rem" }}>LUNGS excrete</div>
                    <div style={{ color: T.muted, fontSize: "0.82rem" }}>Carbonic acid as CO₂ + H₂O when you exhale. Control respiratory acid-base.</div>
                  </div>
                  <div style={{ background: "#3b82f615", borderRadius: "0.5rem", padding: "0.7rem", borderLeft: "3px solid #3b82f6" }}>
                    <div style={{ color: "#3b82f6", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.3rem" }}>KIDNEYS excrete</div>
                    <div style={{ color: T.muted, fontSize: "0.82rem" }}>All metabolic acids in urine. Phosphate/ammonia buffers H⁺ so urine isn't too acidic.</div>
                  </div>
                </div>
              </div>
            )}

            <SectionTitle color={T.acid} mt>⏱️ Compensation Speed</SectionTitle>
            {card(
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: "0.4rem" }}>🫁 Lungs compensate for METABOLIC problems</div>
                  <div style={{ color: T.muted, fontSize: "0.85rem", lineHeight: 1.6 }}>Response is <strong style={{ color: T.text }}>FAST — within minutes</strong>. Changes breathing rate/depth to adjust CO₂ (and thus carbonic acid) levels.</div>
                </div>
                <div>
                  <div style={{ color: "#3b82f6", fontWeight: 700, marginBottom: "0.4rem" }}>🫘 Kidneys compensate for RESPIRATORY problems</div>
                  <div style={{ color: T.muted, fontSize: "0.85rem", lineHeight: 1.6 }}>Response is <strong style={{ color: T.text }}>SLOW — 24 hrs to start, 3–5 days to stabilize</strong>. Adjusts HCO₃⁻ retention or excretion.</div>
                </div>
              </div>
            , { marginBottom: "0" })}
            <div style={{ background: "#fbbf2415", borderRadius: "0 0 0.75rem 0.75rem", border: `1px solid ${T.border}`, borderTop: "none", padding: "0.65rem 1.25rem" }}>
              <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: "0.82rem" }}>⚠️ Remember: </span>
              <span style={{ color: T.muted, fontSize: "0.82rem" }}>Compensation does NOT fix the problem. It only helps the body adapt. Without correcting the underlying cause, the body will eventually fail.</span>
            </div>

            <SectionTitle color={T.acid} mt>📊 Normal ABG Values</SectionTitle>
            {card(
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
                {[
                  { label: "pH", val: "7.35 – 7.45", sub: "Acidic below 7.35 · Alkalotic above 7.45", color: T.acid },
                  { label: "PaCO₂", val: "35 – 45 mmHg", sub: "High = hypoventilation · Low = hyperventilation", color: "#ef4444" },
                  { label: "HCO₃⁻", val: "21 – 28 mEq/L", sub: "Low = too many metabolic acids · High = too few", color: "#3b82f6" },
                  { label: "PaO₂", val: "80 – 100 mmHg", sub: "How well gas exchange is occurring", color: "#f97316" },
                  { label: "SaO₂", val: "95 – 100%", sub: "% of hemoglobin carrying O₂", color: "#a78bfa" },
                ].map(v => (
                  <div key={v.label} style={{ background: T.surface, borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                    <div style={{ color: v.color, fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{v.label}</div>
                    <div style={{ color: T.text, fontWeight: 700, fontSize: "1rem", marginBottom: "0.3rem" }}>{v.val}</div>
                    <div style={{ color: T.muted, fontSize: "0.72rem", lineHeight: 1.4 }}>{v.sub}</div>
                  </div>
                ))}
              </div>
            )}

            <SectionTitle color={T.acid} mt>🗂️ The 4 Disorders</SectionTitle>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              {disorders.map((d, i) => btn(disorderIdx === i, d.color, d.icon + " " + d.name.replace("Respiratory ", "Resp. ").replace("Metabolic ", "Met. "), () => setDisorderIdx(i)))}
            </div>
            {(() => {
              const d = disorders[disorderIdx];
              return card(
                <div>
                  <h3 style={{ margin: "0 0 0.5rem", color: d.color, fontSize: "1.1rem" }}>{d.icon} {d.name}</h3>
                  <div style={{ background: `${d.color}15`, borderRadius: "0.5rem", padding: "0.7rem 1rem", marginBottom: "1rem", borderLeft: `3px solid ${d.color}` }}>
                    <div style={{ color: T.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Mechanism</div>
                    <div style={{ color: T.text, fontSize: "0.88rem", lineHeight: 1.55 }}>{d.cause}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
                    {[["pH", d.abg.pH], ["PaCO₂", d.abg.paCO2], ["HCO₃⁻", d.abg.hco3]].map(([k, v]) => (
                      <div key={k} style={{ background: T.surface, borderRadius: "0.5rem", padding: "0.5rem 0.75rem", textAlign: "center" }}>
                        <div style={{ color: T.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{k}</div>
                        <div style={{ color: d.color, fontWeight: 700, fontSize: "0.9rem", marginTop: "0.2rem" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <div style={{ color: T.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Signs & Symptoms</div>
                      {d.sx.map(s => <div key={s} style={{ fontSize: "0.83rem", color: T.text, marginBottom: "0.25rem" }}>▸ {s}</div>)}
                    </div>
                    <div>
                      <div style={{ color: T.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Common Causes</div>
                      {d.causes.map(c => <div key={c} style={{ fontSize: "0.83rem", color: T.text, marginBottom: "0.25rem" }}>▸ {c}</div>)}
                    </div>
                  </div>
                  <div style={{ background: "#3b82f615", borderRadius: "0.5rem", padding: "0.65rem 0.9rem", marginBottom: "0.75rem" }}>
                    <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: "0.82rem" }}>Compensation: </span>
                    <span style={{ color: T.muted, fontSize: "0.82rem" }}>{d.compensate}</span>
                  </div>
                  <div style={{ background: "#fbbf2415", borderRadius: "0.5rem", padding: "0.65rem 0.9rem" }}>
                    <span style={{ color: "#fbbf24", fontSize: "0.85rem" }}>{d.tip}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ══════════════════════════════════════════
            MODULE: ABG INTERPRETER
        ══════════════════════════════════════════ */}
        {module === "abg" && (
          <div>
            <SectionTitle color="#a78bfa">🔬 ABG Interpreter & Step-by-Step Guide</SectionTitle>

            {card(
              <div>
                <div style={{ fontWeight: 700, color: "#a78bfa", marginBottom: "1rem" }}>4-Step ABG Interpretation Method</div>
                {[
                  { n: "1", label: "Assess Oxygenation", detail: "PaO₂: 80–100 mmHg · SaO₂: 95–100%. Is the patient hypoxic?", color: "#f97316" },
                  { n: "2", label: "Determine pH", detail: "< 7.35 = Acidosis · > 7.45 = Alkalosis · 7.35–7.45 = Normal or fully compensated", color: T.acid },
                  { n: "3", label: "Examine Respiratory Component", detail: "PaCO₂ 35–45 mmHg. ↑CO₂ = acidic. ↓CO₂ = alkalotic. Lungs responsible.", color: "#ef4444" },
                  { n: "4", label: "Examine Metabolic Component", detail: "HCO₃⁻ 21–28 mEq/L. ↓HCO₃⁻ = acidic. ↑HCO₃⁻ = alkalotic. Kidneys responsible.", color: "#3b82f6" },
                ].map(s => (
                  <div key={s.n} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1923", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 }}>{s.n}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: s.color, fontSize: "0.9rem" }}>{s.label}</div>
                      <div style={{ color: T.muted, fontSize: "0.83rem", lineHeight: 1.5 }}>{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <SectionTitle color="#a78bfa" mt>🧮 Enter ABG Values</SectionTitle>
            {card(
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
                  {[
                    { key: "pH", label: "pH", range: "7.35–7.45", placeholder: "e.g. 7.32" },
                    { key: "paCO2", label: "PaCO₂ (mmHg)", range: "35–45", placeholder: "e.g. 48" },
                    { key: "hco3", label: "HCO₃⁻ (mEq/L)", range: "21–28", placeholder: "e.g. 25" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ color: T.muted, fontSize: "0.78rem", display: "block", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {f.label} <span style={{ color: T.border }}>({f.range})</span>
                      </label>
                      <input
                        type="number" step="0.01" placeholder={f.placeholder}
                        value={abgVals[f.key]}
                        onChange={e => setAbgVals(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{
                          width: "100%", background: T.surface, border: `1px solid ${T.border}`,
                          borderRadius: "0.5rem", padding: "0.6rem 0.75rem", color: T.text,
                          fontFamily: "inherit", fontSize: "1rem", boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const r = interpretABG(parseFloat(abgVals.pH), parseFloat(abgVals.paCO2), parseFloat(abgVals.hco3));
                    setAbgResult(r);
                  }}
                  style={{
                    background: "#a78bfa", color: "#0f1923", border: "none", borderRadius: "0.5rem",
                    padding: "0.7rem 2rem", fontFamily: "inherit", fontSize: "1rem", fontWeight: 800, cursor: "pointer", width: "100%",
                  }}>
                  Interpret ABG →
                </button>

                {abgResult && (
                  <div style={{ marginTop: "1.25rem", border: `2px solid ${abgResult.color}`, borderRadius: "0.75rem", overflow: "hidden" }}>
                    <div style={{ background: `${abgResult.color}22`, padding: "0.85rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                      <span style={{ color: abgResult.color, fontWeight: 800, fontSize: "1.05rem" }}>{abgResult.disorder}</span>
                      {tag(abgResult.compensation, abgResult.color)}
                    </div>
                    <div style={{ padding: "1rem 1.25rem" }}>
                      {abgResult.explanation.map((e, i) => (
                        <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem", alignItems: "flex-start" }}>
                          <span style={{ color: abgResult.color }}>▸</span>
                          <span style={{ color: T.text, fontSize: "0.88rem" }}>{e}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <SectionTitle color="#a78bfa" mt>🗂️ Quick Reference Cheat Sheet</SectionTitle>
            {card(
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead>
                    <tr>
                      {["Disorder", "pH", "PaCO₂", "HCO₃⁻", "Who's responsible", "Key S&S"].map(h => (
                        <th key={h} style={{ color: T.muted, textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: `1px solid ${T.border}`, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Resp. Acidosis", color: "#ef4444", pH: "↓ < 7.35", co2: "↑ > 45", hco3: "Normal / ↑ (comp.)", who: "Lungs (hypoventilation)", sx: "Confusion, shallow resp, tachycardia" },
                      { name: "Resp. Alkalosis", color: "#3b82f6", pH: "↑ > 7.45", co2: "↓ < 35", hco3: "Normal / ↓ (comp.)", who: "Lungs (hyperventilation)", sx: "Tingling, light-headedness, tetany" },
                      { name: "Met. Acidosis", color: "#f97316", pH: "↓ < 7.35", co2: "Normal / ↓ (comp.)", hco3: "↓ < 21", who: "Kidneys / HCO₃⁻ loss", sx: "Kussmaul breathing, confusion, flushed" },
                      { name: "Met. Alkalosis", color: "#8b5cf6", pH: "↑ > 7.45", co2: "Normal / ↑ (comp.)", hco3: "↑ > 28", who: "Kidneys / acid loss", sx: "Resp. depression, tetany, weakness" },
                    ].map((r, i) => (
                      <tr key={r.name} style={{ background: i % 2 === 0 ? T.surface : "transparent" }}>
                        <td style={{ padding: "0.6rem 0.75rem", color: r.color, fontWeight: 700 }}>{r.name}</td>
                        <td style={{ padding: "0.6rem 0.75rem", color: r.pH.includes("↓") ? "#ef4444" : "#3b82f6" }}>{r.pH}</td>
                        <td style={{ padding: "0.6rem 0.75rem", color: T.text }}>{r.co2}</td>
                        <td style={{ padding: "0.6rem 0.75rem", color: T.text }}>{r.hco3}</td>
                        <td style={{ padding: "0.6rem 0.75rem", color: T.muted }}>{r.who}</td>
                        <td style={{ padding: "0.6rem 0.75rem", color: T.muted }}>{r.sx}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: "1rem", background: "#fbbf2415", borderRadius: "0.5rem", padding: "0.65rem 0.9rem" }}>
                  <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: "0.82rem" }}>🧠 CO₂/pH Inverse Rule: </span>
                  <span style={{ color: T.muted, fontSize: "0.82rem" }}>In respiratory disorders, CO₂ and pH move in OPPOSITE directions (↑CO₂ = ↓pH). In metabolic disorders, HCO₃⁻ and pH move in the SAME direction (↓HCO₃⁻ = ↓pH).</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children, color, mt }) {
  return (
    <h2 style={{ margin: mt ? "1.75rem 0 0.75rem" : "0 0 0.75rem", fontSize: "1rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {children}
    </h2>
  );
}
