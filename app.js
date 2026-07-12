/* Herbário · Soul Youniversity
   App estático trilíngue. Lê ervas.json; categorias e blends abaixo.
   Sem dependências, sem build, sem chave de API. */

// ---------- idioma ----------
const LANGS = ["pt", "de", "en"];
let LANG = (() => { try { return localStorage.getItem("herb_lang") || "pt"; } catch { return "pt"; } })();
function setLang(l){ LANG = l; try{ localStorage.setItem("herb_lang", l);}catch{} document.documentElement.lang = l; render(); syncChrome(); }
const tr = o => (o && (o[LANG] ?? o.pt)) || "";

// ---------- textos da interface ----------
const UI = {
  tabs:      { ervas:{pt:"Ervas",de:"Kräuter",en:"Herbs"}, categorias:{pt:"Categorias",de:"Kategorien",en:"Categories"}, sobre:{pt:"Sobre",de:"Info",en:"About"} },
  heroKick:  {pt:"Farmácia de chás",de:"Tee-Apotheke",en:"Tea apothecary"},
  heroTitle: {pt:"O que você tem em casa,\ne para que serve",de:"Was du zu Hause hast,\nund wofür",en:"What you have at home,\nand what it's for"},
  heroSub:   {pt:"Toque numa erva para ver funções, potência, preparo e avisos. A nota 0–10 é avaliação comparativa qualitativa — não medida clínica.",
              de:"Tippe auf ein Kraut für Wirkung, Stärke, Zubereitung und Hinweise. Die Note 0–10 ist eine qualitative Einschätzung — kein klinischer Messwert.",
              en:"Tap a herb for functions, potency, preparation and cautions. The 0–10 score is a qualitative comparative rating — not a clinical measure."},
  search:    {pt:"Buscar erva (nome PT / DE / EN, ou científico)…",de:"Kraut suchen (Name PT / DE / EN oder wissenschaftlich)…",en:"Search herb (name PT / DE / EN, or scientific)…"},
  all:       {pt:"Todas",de:"Alle",en:"All"},
  noResults: {pt:"Nenhuma erva encontrada.",de:"Kein Kraut gefunden.",en:"No herb found."},
  noResultsSub:{pt:"Tente outro termo ou limpe o filtro.",de:"Anderes Wort versuchen oder Filter löschen.",en:"Try another term or clear the filter."},
  fnLabel:   {pt:"Principais funções",de:"Hauptwirkungen",en:"Main functions"},
  descLabel: {pt:"Descrição",de:"Beschreibung",en:"Description"},
  prep:      {pt:"Preparo",de:"Zubereitung",en:"Preparation"},
  warn:      {pt:"Avisos",de:"Hinweise",en:"Cautions"},
  metodoLbl: {pt:"Método",de:"Methode",en:"Method"},
  tempLbl:   {pt:"Temperatura",de:"Temperatur",en:"Temperature"},
  blendHow:  {pt:"Como preparar o blend",de:"Mischung zubereiten",en:"How to prepare the blend"},
  blendLbl:  {pt:"Blend recomendado",de:"Empfohlene Mischung",en:"Recommended blend"},
  membersLbl:{pt:"Todas as ervas desta categoria",de:"Alle Kräuter dieser Kategorie",en:"All herbs in this category"},
  conf:      {alta:{pt:"confiança alta",de:"hohe Sicherheit",en:"high confidence"},media:{pt:"confiança média",de:"mittlere Sicherheit",en:"medium confidence"},baixa:{pt:"confiança baixa",de:"geringe Sicherheit",en:"low confidence"}},
  topFns:    {pt:"Forte em",de:"Stark bei",en:"Strong in"},
  errTitle:  {pt:"Não consegui carregar ervas.json",de:"ervas.json konnte nicht geladen werden",en:"Could not load ervas.json"},
  errBody:   {pt:"O app precisa ser servido por HTTP (não aberto direto do arquivo). No GitHub Pages funciona automaticamente. Para testar local, rode nesta pasta:",
              de:"Die App muss über HTTP ausgeliefert werden (nicht direkt aus der Datei). Auf GitHub Pages läuft es automatisch. Lokal in diesem Ordner ausführen:",
              en:"The app must be served over HTTP (not opened straight from the file). On GitHub Pages it works automatically. To test locally, run in this folder:"},
  footnote:  {pt:"Informação de fitoterapia tradicional, não prescrição médica. Notas 0–10 = avaliação comparativa qualitativa (uso tradicional + evidência disponível). Sem vesícula ou em uso de medicação contínua, confirme interações antes de blends regulares.",
              de:"Traditionelle Pflanzenheilkunde, keine ärztliche Verordnung. Noten 0–10 = qualitative Vergleichseinschätzung (traditioneller Gebrauch + verfügbare Evidenz). Ohne Gallenblase oder bei Dauermedikation Wechselwirkungen prüfen.",
              en:"Traditional herbal information, not medical prescription. Scores 0–10 = qualitative comparative rating (traditional use + available evidence). Without a gallbladder or on continuous medication, check interactions before regular blends."},
};

// ---------- metadados de categoria + blends ----------
// nome trilíngue, ícone (path SVG), se é domínio energético, blend (ids), racional e nota
const CAT = {
  digestao:{ nome:{pt:"Digestão",de:"Verdauung",en:"Digestion"}, ic:"M4 12c4-5 12-5 16 0M4 12c4 5 12 5 16 0", 
    intent:{pt:"Gases, peso, náusea e cólica depois de comer.",de:"Blähungen, Völle, Übelkeit und Krämpfe nach dem Essen.",en:"Gas, heaviness, nausea and cramps after eating."},
    blend:["funcho","hortela-pimenta","camomila","gengibre"],
    why:{pt:"Carminativos + relaxante da mucosa. Sementes amassadas, infusão tampada; gengibre fervido.",de:"Karminativa + Schleimhaut-Entspanner. Samen zerstoßen, zugedeckt ziehen; Ingwer kochen.",en:"Carminatives + mucosa relaxant. Crush seeds, covered infusion; boil the ginger."}},
  limpeza:{ nome:{pt:"Limpeza do corpo",de:"Entgiftung",en:"Cleanse"}, ic:"M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z",
    intent:{pt:"Apoiar fígado e rins — os órgãos que de fato limpam.",de:"Leber und Nieren unterstützen — die Organe, die wirklich reinigen.",en:"Support liver and kidneys — the organs that actually clean."},
    blend:["dente-leao-raiz","cavalinha","urtiga","carqueja"],
    why:{pt:"Raízes em decocção 10 min. Ciclos curtos de 1–2 semanas, não contínuo.",de:"Wurzeln 10 Min. kochen. Kurze Zyklen von 1–2 Wochen, nicht dauerhaft.",en:"Root decoction 10 min. Short cycles of 1–2 weeks, not continuous."},
    note:{pt:"“Detox” é marketing; o efeito real é apoiar fígado e rins.",de:"„Detox“ ist Marketing; der reale Effekt ist Leber- und Nierenunterstützung.",en:"“Detox” is marketing; the real effect is supporting liver and kidneys."}},
  menstruacao:{ nome:{pt:"Menstruação",de:"Menstruation",en:"Menstruation"}, ic:"M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM12 15v6M9 19h6",
    intent:{pt:"Regular o ciclo, aliviar cólica e conter fluxo.",de:"Zyklus regulieren, Krämpfe lindern, Blutung bremsen.",en:"Regulate the cycle, ease cramps and curb flow."},
    blend:["alquemila","camomila","gengibre"],
    why:{pt:"Alquemila ao longo do mês; camomila e gengibre nos dias de dor.",de:"Frauenmantel über den Monat; Kamille und Ingwer an Schmerztagen.",en:"Lady's mantle through the month; chamomile and ginger on pain days."},
    note:{pt:"Emenagogos (artemísia) só fora da gravidez.",de:"Emmenagoga (Beifuß) nur außerhalb der Schwangerschaft.",en:"Emmenagogues (mugwort) only outside pregnancy."}},
  enxaqueca:{ nome:{pt:"Enxaqueca",de:"Migräne",en:"Migraine"}, ic:"M13 2 4 14h7l-2 8 9-12h-7z",
    intent:{pt:"Reduzir frequência (prevenção) e aliviar a crise.",de:"Häufigkeit senken (Vorbeugung) und den Anfall lindern.",en:"Reduce frequency (prevention) and ease the attack."},
    blend:["tanaceto","gengibre"],
    why:{pt:"Tanaceto é prevenção contínua; gengibre é para a crise. Papéis diferentes.",de:"Mutterkraut zur dauerhaften Vorbeugung; Ingwer für den Anfall. Verschiedene Rollen.",en:"Feverfew is continuous prevention; ginger is for the attack. Different roles."}},
  imunidade:{ nome:{pt:"Imunidade",de:"Immunsystem",en:"Immunity"}, ic:"M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z",
    intent:{pt:"Suporte antioxidante, antimicrobiano e antiviral.",de:"Antioxidative, antimikrobielle und antivirale Unterstützung.",en:"Antioxidant, antimicrobial and antiviral support."},
    blend:["gengibre","curcuma","cravo","sabugueiro"],
    why:{pt:"Cúrcuma com pimenta-preta + gordura. Sabugueiro entra na virose. Rotacionar.",de:"Kurkuma mit Pfeffer + Fett. Holunder bei Virusinfekt. Rotieren.",en:"Turmeric with pepper + fat. Elder for viral infection. Rotate."},
    note:{pt:"Apoio, não escudo — não substitui sono, comida e vacina.",de:"Unterstützung, kein Schutzschild — ersetzt nicht Schlaf, Ernährung, Impfung.",en:"Support, not a shield — no substitute for sleep, food and vaccines."}},
  dores:{ nome:{pt:"Dores e costas",de:"Schmerzen & Rücken",en:"Pain & back"}, ic:"M9 3v7l-3 2 3 2v7M15 3v7l3 2-3 2v7",
    intent:{pt:"Dor muscular, lombar e articular; inflamação.",de:"Muskel-, Rücken- und Gelenkschmerz; Entzündung.",en:"Muscle, lower-back and joint pain; inflammation."},
    blend:["garra-diabo","curcuma","gengibre"],
    why:{pt:"Efeito de fundo — aparece com uso regular por dias/semanas, não na hora.",de:"Grundwirkung — zeigt sich mit regelmäßigem Gebrauch über Tage/Wochen.",en:"Baseline effect — shows with regular use over days/weeks, not instantly."},
    note:{pt:"Garra-do-diabo: evitar com gastrite e anticoagulantes.",de:"Teufelskralle: bei Gastritis und Blutverdünnern meiden.",en:"Devil's claw: avoid with gastritis and blood thinners."}},
  sono:{ nome:{pt:"Sono",de:"Schlaf",en:"Sleep"}, ic:"M20 13a8 8 0 1 1-9-9 7 7 0 0 0 9 9z",
    intent:{pt:"Desacelerar mente e corpo antes de dormir.",de:"Geist und Körper vor dem Schlafen herunterfahren.",en:"Slow mind and body before sleep."},
    blend:["lavanda","camomila","passiflora"],
    why:{pt:"30–40 min antes de deitar, morno, luz baixa. Passiflora é a peça mais sedativa.",de:"30–40 Min. vor dem Zubettgehen, warm, gedämpftes Licht. Passionsblume ist am sedierendsten.",en:"30–40 min before bed, warm, low light. Passionflower is the most sedative piece."}},
  nervoso:{ nome:{pt:"Sistema nervoso e humor",de:"Nervensystem & Stimmung",en:"Nervous system & mood"}, ic:"M12 3a3 3 0 0 0-3 3 3 3 0 0 0-3 3 3 3 0 0 0 1 5 3 3 0 0 0 5 2 3 3 0 0 0 5-2 3 3 0 0 0 1-5 3 3 0 0 0-3-3 3 3 0 0 0-3-3z",
    intent:{pt:"Ansiedade, humor e digestão nervosa no dia a dia.",de:"Angst, Stimmung und nervöse Verdauung im Alltag.",en:"Anxiety, mood and nervous digestion day to day."},
    blend:["melissa","lavanda","passiflora"],
    why:{pt:"Melissa levanta o humor; lavanda acalma; passiflora sedativa. Bom de dia (melissa/lavanda) e à noite.",de:"Melisse hebt die Stimmung; Lavendel beruhigt; Passionsblume sediert. Tagsüber und abends.",en:"Lemon balm lifts mood; lavender calms; passionflower sedates. Good by day and night."}},
  respiratorio:{ nome:{pt:"Respiratório",de:"Atemwege",en:"Respiratory"}, ic:"M12 3v7M12 10c-1 2-4 2-5 4s0 5 2 5 3-3 3-5M12 10c1 2 4 2 5 4s0 5-2 5-3-3-3-5",
    intent:{pt:"Congestão, tosse e garganta.",de:"Verstopfung, Husten und Hals.",en:"Congestion, cough and throat."},
    blend:["eucalipto","tomilho","altea"],
    why:{pt:"Eucalipto abre; tomilho trata a tosse produtiva; altéia acalma a garganta. Serve como inalação.",de:"Eukalyptus öffnet; Thymian bei produktivem Husten; Eibisch beruhigt den Hals. Auch als Inhalation.",en:"Eucalyptus opens; thyme for productive cough; marshmallow soothes the throat. Works as inhalation too."}},
  cardiovascular:{ nome:{pt:"Cardiovascular",de:"Herz-Kreislauf",en:"Cardiovascular"}, ic:"M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c-2 4.5-9 9-9 9z",
    intent:{pt:"Pressão arterial e antioxidação.",de:"Blutdruck und Antioxidation.",en:"Blood pressure and antioxidation."},
    blend:["hibisco","alecrim"],
    why:{pt:"Hibisco baixa a sistólica modestamente com uso regular; alecrim apoia a circulação.",de:"Hibiskus senkt den systolischen Druck moderat bei regelmäßigem Gebrauch; Rosmarin unterstützt den Kreislauf.",en:"Hibiscus modestly lowers systolic pressure with regular use; rosemary supports circulation."},
    note:{pt:"Hibisco baixa a pressão — cautela se hipotenso ou usa anti-hipertensivo.",de:"Hibiskus senkt den Druck — Vorsicht bei niedrigem Druck/Blutdruckmitteln.",en:"Hibiscus lowers pressure — caution if hypotensive or on medication."}},
  terceiro_olho:{ nome:{pt:"Terceiro olho",de:"Drittes Auge",en:"Third eye"}, energetic:true, ic:"M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    intent:{pt:"Preparar corpo e mente para a prática — ritual + calma real.",de:"Körper und Geist auf die Praxis vorbereiten — Ritual + echte Ruhe.",en:"Prepare body and mind for practice — ritual + real calm."},
    blend:["artemisia-vulgaris","lavanda","alecrim"],
    why:{pt:"Uma xícara morna antes de sentar. Menos é mais; o aroma pesa tanto quanto a bebida.",de:"Eine warme Tasse vor dem Sitzen. Weniger ist mehr; der Duft zählt so viel wie das Getränk.",en:"A warm cup before sitting. Less is more; the aroma matters as much as the drink."},
    note:{pt:"Domínio simbólico: só a lavanda tem efeito comprovado (calmante). O resto é tradição — sem base científica para “ativar a pineal”.",de:"Symbolischer Bereich: nur Lavendel hat nachgewiesene (beruhigende) Wirkung. Der Rest ist Tradition — keine wissenschaftliche Grundlage, die Zirbeldrüse zu „aktivieren“.",en:"Symbolic domain: only lavender has a proven (calming) effect. The rest is tradition — no scientific basis for “activating the pineal.”"}},
};
const CAT_ORDER = ["digestao","limpeza","menstruacao","enxaqueca","imunidade","dores","sono","nervoso","respiratorio","cardiovascular","terceiro_olho"];

// método de preparo -> rótulo trilíngue
const METODO = {
  infusao:      {pt:"Infusão",de:"Aufguss",en:"Infusion"},
  decoccao:     {pt:"Decocção",de:"Absud",en:"Decoction"},
  macerado_frio:{pt:"Macerado a frio",de:"Kaltauszug",en:"Cold macerate"},
  mate:         {pt:"Infusão morna",de:"Warmer Aufguss",en:"Warm infusion"},
  aromatico:    {pt:"Uso aromático",de:"Aromatisch",en:"Aromatic use"},
  alimento:     {pt:"Alimento",de:"Lebensmittel",en:"Food"},
};

// preparo específico de cada combinação (método em frase + temperatura)
const BLEND_PREP = {
  digestao:{temp:"90–100", how:{
    pt:"Ferva o gengibre e as sementes ~5 min; desligue e abafe hortelã e camomila por 5 min.",
    de:"Ingwer und Samen ~5 Min. kochen; vom Herd nehmen, Minze und Kamille 5 Min. zugedeckt ziehen.",
    en:"Boil ginger and seeds ~5 min; off the heat, steep mint and chamomile 5 min, covered."}},
  limpeza:{temp:"100", how:{
    pt:"Decocção das raízes (dente-de-leão, cavalinha) 10–15 min; junte a urtiga só ao desligar.",
    de:"Wurzeln (Löwenzahn, Schachtelhalm) 10–15 Min. abkochen; Brennnessel erst am Ende zugeben.",
    en:"Decoct the roots (dandelion, horsetail) 10–15 min; add nettle only when you turn off the heat."}},
  menstruacao:{temp:"90–100", how:{
    pt:"Ferva o gengibre ~5 min; desligue e abafe alquemila e camomila por 8 min.",
    de:"Ingwer ~5 Min. kochen; dann Frauenmantel und Kamille 8 Min. zugedeckt ziehen.",
    en:"Boil ginger ~5 min; then steep lady's mantle and chamomile 8 min, covered."}},
  enxaqueca:{temp:"85–90", how:{
    pt:"Tanaceto em infusão abafada — não ferver, o princípio ativo é sensível ao calor. O gengibre é decocção à parte, para a crise.",
    de:"Mutterkraut als zugedeckter Aufguss — nicht kochen, hitzeempfindlich. Ingwer separat abkochen, für den Anfall.",
    en:"Feverfew as a covered infusion — don't boil, the active is heat-sensitive. Ginger is decocted separately, for the attack."}},
  imunidade:{temp:"100", how:{
    pt:"Decocção de gengibre, cúrcuma e cravo 8–10 min (cúrcuma com pimenta e um fio de gordura); junte a flor de sabugueiro ao desligar.",
    de:"Ingwer, Kurkuma und Nelken 8–10 Min. abkochen (Kurkuma mit Pfeffer und etwas Fett); Holunderblüte am Ende zugeben.",
    en:"Decoct ginger, turmeric and clove 8–10 min (turmeric with pepper and a little fat); add elderflower at the end."}},
  dores:{temp:"100", how:{
    pt:"Decocção das raízes (garra-do-diabo, cúrcuma, gengibre) 10 min em fervura branda.",
    de:"Wurzeln (Teufelskralle, Kurkuma, Ingwer) 10 Min. sanft köcheln.",
    en:"Decoct the roots (devil's claw, turmeric, ginger) 10 min at a gentle boil."}},
  sono:{temp:"90", how:{
    pt:"Infusão abafada 8 min; nunca ferver as flores.",
    de:"Zugedeckter Aufguss 8 Min.; Blüten nie kochen.",
    en:"Covered infusion 8 min; never boil the flowers."}},
  nervoso:{temp:"85–90", how:{
    pt:"Infusão abafada 6–8 min, temperatura mais baixa — a melissa perde o aroma se fervida.",
    de:"Zugedeckter Aufguss 6–8 Min., niedrigere Temperatur — Melisse verliert das Aroma beim Kochen.",
    en:"Covered infusion 6–8 min at a lower temperature — lemon balm loses its aroma if boiled."}},
  respiratorio:{temp:"90", how:{
    pt:"Infusão abafada de eucalipto e tomilho 8 min. Para preservar a mucilagem, macere a altéia a frio 1–2 h à parte e junte no fim.",
    de:"Eukalyptus und Thymian 8 Min. zugedeckt aufgießen. Für die Schleimstoffe Eibisch 1–2 h kalt ansetzen und am Ende zugeben.",
    en:"Covered infusion of eucalyptus and thyme 8 min. To keep the mucilage, cold-macerate marshmallow 1–2 h separately and add at the end."}},
  cardiovascular:{temp:"90–95", how:{
    pt:"Infusão abafada 8–10 min; sirva quente ou gelado.",
    de:"Zugedeckter Aufguss 8–10 Min.; heiß oder kalt servieren.",
    en:"Covered infusion 8–10 min; serve hot or iced."}},
  terceiro_olho:{temp:"90", how:{
    pt:"Infusão abafada breve, 5 min. Uma xícara morna antes de sentar.",
    de:"Kurzer zugedeckter Aufguss, 5 Min. Eine warme Tasse vor dem Sitzen.",
    en:"Brief covered infusion, 5 min. A warm cup before sitting."}},
};

// ---------- estado ----------
let DB = [];               // ervas
let byId = {};
let view = "ervas";
let filterCat = null;
let query = "";

// ---------- boot ----------
const appEl = document.getElementById("app");
init();
async function init(){
  wireChrome();
  try{
    const res = await fetch("ervas.json", {cache:"no-store"});
    if(!res.ok) throw new Error(res.status);
    const data = await res.json();
    DB = data.ervas || [];
    byId = Object.fromEntries(DB.map(e=>[e.id,e]));
  }catch(err){ renderError(); return; }
  render();
}

function wireChrome(){
  document.querySelectorAll(".lang-btn").forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{view=b.dataset.view; window.scrollTo({top:0}); render(); syncChrome();});
  document.getElementById("modal").addEventListener("click",e=>{ if(e.target.dataset.close!==undefined || e.target.classList.contains("modal-scrim")) closeModal(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeModal(); });
  document.documentElement.lang = LANG;
  syncChrome();
}
function syncChrome(){
  document.querySelectorAll(".lang-btn").forEach(b=>b.setAttribute("aria-current", b.dataset.lang===LANG ? "true":"false"));
  document.querySelectorAll(".tab").forEach(b=>{ b.textContent = tr(UI.tabs[b.dataset.view]); b.setAttribute("aria-current", b.dataset.view===view ? "true":"false"); });
}

// ---------- helpers ----------
const esc = s => (s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function icon(path, cls){ return `<svg class="${cls||""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`; }
function gauge(nota){ return `<div class="gauge"><i style="width:${nota*10}%"></i></div>`; }
function topFns(e,n=2){ return [...e.funcoes].sort((a,b)=>b.nota-a.nota).slice(0,n).map(f=>tr(f)).join(" · "); }

// ---------- render principal ----------
function render(){
  if(view==="ervas") return renderErvas();
  if(view==="categorias") return renderCategorias();
  return renderSobre();
}

function renderErvas(){
  const cats = CAT_ORDER.filter(c=>DB.some(e=>e.categorias.includes(c)));
  const chips = `<button class="chip" data-cat="" aria-pressed="${!filterCat}">${esc(tr(UI.all))}</button>` +
    cats.map(c=>`<button class="chip" data-cat="${c}" aria-pressed="${filterCat===c}"><span class="dot" ${CAT[c].energetic?'style="background:var(--indigo1)"':''}></span>${esc(tr(CAT[c].nome))}</button>`).join("");

  const q = query.trim().toLowerCase();
  let list = DB.filter(e=>{
    if(filterCat && !e.categorias.includes(filterCat)) return false;
    if(!q) return true;
    return [e.nome,e.nome_de,e.nome_en,e.nome_cientifico].some(x=>(x||"").toLowerCase().includes(q));
  });
  list.sort((a,b)=> tr({pt:a.nome,de:a.nome_de,en:a.nome_en}).localeCompare(tr({pt:b.nome,de:b.nome_de,en:b.nome_en})));

  const cards = list.map(e=>{
    const nm = LANG==="pt"?e.nome:(LANG==="de"?e.nome_de:e.nome_en);
    const altParts = [e.nome_de,e.nome].filter(x=>x&&x!==nm);
    const alt = LANG==="pt" ? e.nome_de : (LANG==="en"? e.nome : e.nome_de);
    return `<button class="specimen" data-open="${e.id}">
      <div class="sci">${esc(e.nome_cientifico)}</div>
      <div><div class="nm">${esc(nm)}</div><div class="alt">${esc(alt||"")}</div></div>
      <div class="tagrow">${e.categorias.slice(0,3).map(c=>`<span class="tag ${CAT[c]?.energetic?'gold':''}">${esc(tr(CAT[c]?.nome||{pt:c}))}</span>`).join("")}</div>
      <div class="toppair">${esc(tr(UI.topFns))}: ${esc(topFns(e))}</div>
    </button>`;
  }).join("");

  appEl.innerHTML = `
    <section class="hero">
      <div class="eyebrow">${esc(tr(UI.heroKick))}</div>
      <h1>${esc(tr(UI.heroTitle)).replace("\n","<br>")}</h1>
      <p>${esc(tr(UI.heroSub))}</p>
    </section>
    <div class="controls">
      <label class="search">
        ${icon("M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3","")}
        <input id="q" type="search" placeholder="${esc(tr(UI.search))}" value="${esc(query)}" />
      </label>
      <div class="chips">${chips}</div>
    </div>
    ${list.length? `<div class="grid">${cards}</div>` :
      `<div class="empty"><div class="big">${esc(tr(UI.noResults))}</div>${esc(tr(UI.noResultsSub))}</div>`}
    <div class="footnote">${esc(tr(UI.footnote))}</div>`;

  const qi = document.getElementById("q");
  qi.oninput = ()=>{ query = qi.value; const pos=qi.selectionStart; renderErvas(); const nq=document.getElementById("q"); nq.focus(); try{nq.setSelectionRange(pos,pos);}catch{} };
  appEl.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{ filterCat = c.dataset.cat||null; renderErvas(); });
  appEl.querySelectorAll(".specimen").forEach(s=>s.onclick=()=>openModal(s.dataset.open));
}

function renderCategorias(){
  const cats = CAT_ORDER.filter(c=>DB.some(e=>e.categorias.includes(c)));
  appEl.innerHTML = `<section class="hero"><div class="eyebrow">${esc(tr(UI.heroKick))}</div>
      <h1>${LANG==="pt"?"Combinações por objetivo":LANG==="de"?"Mischungen nach Ziel":"Blends by goal"}</h1>
      <p>${LANG==="pt"?"No máximo 3–4 ervas por função, para o melhor efeito. Toque numa erva para o perfil completo.":LANG==="de"?"Höchstens 3–4 Kräuter pro Wirkung, für den besten Effekt. Tippe auf ein Kraut für das volle Profil.":"At most 3–4 herbs per function, for the best effect. Tap a herb for the full profile."}</p></section>`
    + `<div style="padding-bottom:60px">` + cats.map(cid=>{
      const c = CAT[cid];
      const members = DB.filter(e=>e.categorias.includes(cid));
      const blendHerbs = (c.blend||[]).filter(id=>byId[id]);
      const blendChips = blendHerbs.map(id=>{
        const e=byId[id]; const nm=LANG==="pt"?e.nome:LANG==="de"?e.nome_de:e.nome_en;
        return `<button class="blend-herb" data-open="${id}"><b>${esc(nm)}</b></button>`;
      }).join("");
      const memberChips = members.map(e=>{
        const nm=LANG==="pt"?e.nome:LANG==="de"?e.nome_de:e.nome_en;
        const best=Math.max(...e.funcoes.map(f=>f.nota),0);
        return `<button class="member" data-open="${e.id}">${esc(nm)} <span class="s">${best}</span></button>`;
      }).join("");
      return `<section class="cat ${c.energetic?'energetic':''}">
        <div class="cat-head">${icon(c.ic,"cat-ic")}<h2>${esc(tr(c.nome))}</h2>${c.energetic?`<span class="badge">${LANG==="pt"?"domínio energético":LANG==="de"?"energetischer Bereich":"energetic domain"}</span>`:""}</div>
        <p class="intent">${esc(tr(c.intent))}</p>
        <div class="blend">
          <div class="lbl">${esc(tr(UI.blendLbl))}</div>
          <div class="herbs">${blendChips}</div>
          <p class="why">${esc(tr(c.why))}</p>
          ${BLEND_PREP[cid] ? `<div class="blend-how"><b>${esc(tr(UI.blendHow))}${BLEND_PREP[cid].temp?` · ${esc(BLEND_PREP[cid].temp)} °C`:""}</b>${esc(tr(BLEND_PREP[cid].how))}</div>` : ""}
        </div>
        ${c.note?`<div class="note">${esc(tr(c.note))}</div>`:""}
        <div style="margin-top:16px" class="lbl-mem"><span class="tag">${esc(tr(UI.membersLbl))}</span></div>
        <div class="members">${memberChips}</div>
      </section>`;
    }).join("") + `<div class="footnote">${esc(tr(UI.footnote))}</div></div>`;

  appEl.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openModal(b.dataset.open));
}

function renderSobre(){
  const pt = LANG==="pt", de = LANG==="de";
  const body = pt ? `
    <h1>Como este herbário funciona</h1>
    <p>Todas as ervas ficam num único arquivo, <code>ervas.json</code>. O app lê esse arquivo ao abrir e monta sozinho as fichas, a busca e as categorias. Não há inteligência artificial, servidor nem chave — é um site estático que roda no GitHub Pages de graça.</p>
    <h2>Adicionar uma erva nova</h2>
    <p>Peça o perfil da erva ao Claude no chat, cole o bloco no <code>ervas.json</code> (dentro da lista <code>"ervas"</code>) e dê commit. No próximo carregamento ela aparece — inclusive em qualquer categoria que você listar no campo <code>categorias</code>. Formato de cada erva:</p>
    <pre>{
  "id": "gengibre",
  "nome": "Gengibre",
  "nome_de": "Ingwer",
  "nome_en": "Ginger",
  "nome_cientifico": "Zingiber officinale",
  "categorias": ["digestao","imunidade"],
  "funcoes": [
    { "pt":"Digestão","de":"Verdauung","en":"Digestion","nota":9 }
  ],
  "descricao": { "pt":"…","de":"…","en":"…" },
  "preparo":   { "pt":"…","de":"…","en":"…" },
  "avisos":    { "pt":"…","de":"…","en":"…" },
  "confianca": "alta"
}</pre>
    <p class="callout">Categorias válidas: ${CAT_ORDER.join(", ")}. Se você inventar uma nova, ela aparece automaticamente na aba Categorias — só sem blend recomendado até você definir um.</p>
    <h2>Sobre as notas</h2>
    <p>A barra 0–10 é uma avaliação comparativa qualitativa, baseada em uso tradicional e na evidência disponível — não é medida clínica. O campo <code>confianca</code> (alta / média / baixa) sinaliza o quanto essa nota é sólida. Isto é informação de fitoterapia, não prescrição médica.</p>
  ` : de ? `
    <h1>Wie dieses Herbarium funktioniert</h1>
    <p>Alle Kräuter stehen in einer einzigen Datei, <code>ervas.json</code>. Die App liest sie beim Öffnen und baust Karten, Suche und Kategorien selbst auf. Keine KI, kein Server, kein Schlüssel — eine statische Seite, die kostenlos auf GitHub Pages läuft.</p>
    <h2>Ein neues Kraut hinzufügen</h2>
    <p>Bitte Claude im Chat um das Kraut-Profil, füge den Block in <code>ervas.json</code> ein (in die Liste <code>"ervas"</code>) und committe. Beim nächsten Laden erscheint es — auch in jeder Kategorie im Feld <code>categorias</code>. Format je Kraut:</p>
    <pre>{
  "id": "ingwer",
  "nome": "Gengibre",
  "nome_de": "Ingwer",
  "nome_en": "Ginger",
  "nome_cientifico": "Zingiber officinale",
  "categorias": ["digestao","imunidade"],
  "funcoes": [ { "pt":"…","de":"Verdauung","en":"…","nota":9 } ],
  "descricao": { "pt":"…","de":"…","en":"…" },
  "preparo":   { "pt":"…","de":"…","en":"…" },
  "avisos":    { "pt":"…","de":"…","en":"…" },
  "confianca": "alta"
}</pre>
    <p class="callout">Gültige Kategorien: ${CAT_ORDER.join(", ")}.</p>
    <h2>Zu den Noten</h2>
    <p>Die Skala 0–10 ist eine qualitative Vergleichseinschätzung (traditioneller Gebrauch + Evidenz), kein klinischer Messwert. Das Feld <code>confianca</code> zeigt, wie belastbar sie ist. Pflanzenheilkunde, keine ärztliche Verordnung.</p>
  ` : `
    <h1>How this herbarium works</h1>
    <p>All herbs live in one file, <code>ervas.json</code>. The app reads it on load and builds the cards, search and categories by itself. No AI, no server, no key — a static site that runs on GitHub Pages for free.</p>
    <h2>Adding a new herb</h2>
    <p>Ask Claude in chat for the herb profile, paste the block into <code>ervas.json</code> (inside the <code>"ervas"</code> list) and commit. On the next load it appears — including in any category you list in the <code>categorias</code> field. Format per herb:</p>
    <pre>{
  "id": "ginger",
  "nome": "Gengibre",
  "nome_de": "Ingwer",
  "nome_en": "Ginger",
  "nome_cientifico": "Zingiber officinale",
  "categorias": ["digestao","imunidade"],
  "funcoes": [ { "pt":"…","de":"…","en":"Digestion","nota":9 } ],
  "descricao": { "pt":"…","de":"…","en":"…" },
  "preparo":   { "pt":"…","de":"…","en":"…" },
  "avisos":    { "pt":"…","de":"…","en":"…" },
  "confianca": "alta"
}</pre>
    <p class="callout">Valid categories: ${CAT_ORDER.join(", ")}.</p>
    <h2>About the scores</h2>
    <p>The 0–10 bar is a qualitative comparative rating (traditional use + available evidence), not a clinical measure. The <code>confianca</code> field flags how solid it is. Herbal information, not medical prescription.</p>`;
  appEl.innerHTML = `<div class="prose">${body}</div>`;
}

function renderError(){
  const cmd = "python3 -m http.server";
  appEl.innerHTML = `<div class="errbox">
    <h3>${esc(tr(UI.errTitle))}</h3>
    <p>${esc(tr(UI.errBody))}</p>
    <pre style="margin-top:10px"><code>${cmd}</code></pre>
    <p style="margin-top:10px;color:var(--muted)">${LANG==="pt"?"Depois abra":LANG==="de"?"Dann öffne":"Then open"} <code>http://localhost:8000</code></p>
  </div>`;
  syncChrome();
}

// ---------- modal ----------
function openModal(id){
  const e = byId[id]; if(!e) return;
  const energetic = e.categorias.length===1 && CAT[e.categorias[0]]?.energetic;
  const nm = LANG==="pt"?e.nome:LANG==="de"?e.nome_de:e.nome_en;
  const others = [["PT",e.nome],["DE",e.nome_de],["EN",e.nome_en]].filter(([k,v])=>v && v!==nm).map(([k,v])=>`${v}`).join(" · ");
  const fns = [...e.funcoes].sort((a,b)=>b.nota-a.nota).map(f=>`
    <div class="fn"><div class="fn-top"><span class="fn-name">${esc(tr(f))}</span><span class="fn-score">${f.nota}/10</span></div>${gauge(f.nota)}</div>`).join("");
  const conf = e.confianca||"media";
  const card = document.querySelector(".modal-card");
  card.className = "modal-card"+(energetic?" energetic":"");
  card.innerHTML = `
    <button class="md-close" data-close aria-label="Fechar">×</button>
    <div class="md-sci">${esc(e.nome_cientifico)}</div>
    <h2 class="md-name" id="modal-name">${esc(nm)}</h2>
    ${others?`<div class="md-alt">${esc(others)}</div>`:""}
    <div class="md-tags">
      ${e.categorias.map(c=>`<span class="tag ${CAT[c]?.energetic?'gold':''}">${esc(tr(CAT[c]?.nome||{pt:c}))}</span>`).join("")}
      <span class="conf ${conf}"><span class="pip"></span>${esc(tr(UI.conf[conf]))}</span>
    </div>
    <div class="md-section-lbl">${esc(tr(UI.fnLabel))}</div>
    <div class="md-fns">${fns}</div>
    <div class="md-section-lbl">${esc(tr(UI.descLabel))}</div>
    <p class="md-desc">${esc(tr(e.descricao))}</p>
    <div class="md-section-lbl">${esc(tr(UI.prep))}</div>
    <div class="prep-facts">
      <span class="fact"><em>${esc(tr(UI.metodoLbl))}</em>${esc(tr(METODO[e.metodo]||{pt:e.metodo||"—"}))}</span>
      ${e.temp_c ? `<span class="fact"><em>${esc(tr(UI.tempLbl))}</em>${esc(e.temp_c)} °C</span>` : ""}
    </div>
    <p class="md-preptext">${esc(tr(e.preparo))}</p>
    <div class="md-box warn"><div class="k">${esc(tr(UI.warn))}</div><p>${esc(tr(e.avisos))}</p></div>`;
  const m = document.getElementById("modal");
  m.hidden = false; document.body.style.overflow="hidden";
  card.focus();
}
function closeModal(){ const m=document.getElementById("modal"); if(m.hidden) return; m.hidden=true; document.body.style.overflow=""; }
