// Shared questionnaire definition: languages, copy, options and scoring.
// Used by the Book-a-demo page (client) and the submissions API (server).

export const LANGS = ['en', 'es', 'pt'] as const;
export type Lang = (typeof LANGS)[number];

type Tri = [string, string, string];
const li = (lang: Lang) => LANGS.indexOf(lang);
export const tr = (v: Tri | [string], lang: Lang) => v[li(lang)] ?? v[0];

export const T = {
  eyebrow: ['BOOK A DEMO', 'AGENDA UNA DEMO', 'AGENDE UMA DEMO'],
  introTitle: ['Bring us a process that gets stuck.', 'Tráenos un proceso que se atasca.', 'Traga-nos um processo que trava.'],
  introSub: [
    'Answer a few quick questions. See your AI maturity map. Book a demo built around your business.',
    'Responde unas preguntas rápidas. Ve tu mapa de madurez en IA. Agenda una demo hecha para tu negocio.',
    'Responda algumas perguntas rápidas. Veja seu mapa de maturidade em IA. Agende uma demo feita para o seu negócio.',
  ],
  get1: ['Your AI maturity level', 'Tu nivel de madurez en IA', 'Seu nível de maturidade em IA'],
  get2: ['Your top 3 opportunities', 'Tus 3 principales oportunidades', 'Suas 3 principais oportunidades'],
  get3: ['A demo built on your process', 'Una demo hecha sobre tu proceso', 'Uma demo feita sobre o seu processo'],
  start: ['Start', 'Empezar', 'Começar'],
  meta: [
    '3 minutes · No passwords or private documents',
    '3 minutos · Sin contraseñas ni documentos privados',
    '3 minutos · Sem senhas nem documentos privados',
  ],
  p1: ['Business', 'Negocio', 'Negócio'],
  p2: ['What’s stuck', 'Qué se atasca', 'O que trava'],
  p3: ['The cost', 'El costo', 'O custo'],
  p4: ['Your tools', 'Herramientas', 'Ferramentas'],
  p5: ['Team & goals', 'Equipo y metas', 'Equipe e metas'],
  p6: ['Your map', 'Tu mapa', 'Seu mapa'],
  p7: ['Book', 'Agenda', 'Agenda'],
  s1: ['Your business', 'Tu negocio', 'Seu negócio'],
  s2: ['What gets stuck?', '¿Qué se atasca?', 'O que trava?'],
  s4: ['Your tools', 'Tus herramientas', 'Suas ferramentas'],
  s5: ['Team & goals', 'Equipo y metas', 'Equipe e metas'],
  qCompany: ['Company name', 'Nombre de la empresa', 'Nome da empresa'],
  qIndustry: ['Industry', 'Industria', 'Setor'],
  qSize: ['People in the company', 'Personas en la empresa', 'Pessoas na empresa'],
  qProcs: ['Where does work get stuck? Pick up to 3.', '¿Dónde se atasca el trabajo? Elige hasta 3.', 'Onde o trabalho trava? Escolha até 3.'],
  costOf: ['Let’s size it:', 'Dimensionemos:', 'Vamos dimensionar:'],
  qFreq: ['How often does it happen?', '¿Con qué frecuencia ocurre?', 'Com que frequência acontece?'],
  qPeople: ['How many people touch it?', '¿Cuántas personas intervienen?', 'Quantas pessoas participam?'],
  qHours: ['Hours per week it takes the team', 'Horas por semana que le toma al equipo', 'Horas por semana que consome da equipe'],
  qApproval: ['Does it wait for approvals?', '¿Espera aprobaciones?', 'Fica esperando aprovações?'],
  qSystems: ['Where does your information live?', '¿Dónde vive tu información?', 'Onde vivem suas informações?'],
  qConnected: ['Do your systems talk to each other?', '¿Tus sistemas se comunican entre sí?', 'Seus sistemas conversam entre si?'],
  itLink: [
    'Technical details? Send our IT questionnaire to your team →',
    '¿Detalles técnicos? Envía nuestro cuestionario de TI a tu equipo →',
    'Detalhes técnicos? Envie nosso questionário de TI à sua equipe →',
  ],
  qTeams: ['Which teams are overloaded?', '¿Qué equipos están sobrecargados?', 'Quais equipes estão sobrecarregadas?'],
  qKnowledge: [
    'Does key knowledge depend on one or two people?',
    '¿El conocimiento clave depende de una o dos personas?',
    'O conhecimento-chave depende de uma ou duas pessoas?',
  ],
  qGoal: ['Main goal', 'Objetivo principal', 'Objetivo principal'],
  qTiming: ['When do you want results?', '¿Cuándo quieres resultados?', 'Quando você quer resultados?'],
  resultsTitle: ['Your AI maturity map', 'Tu mapa de madurez en IA', 'Seu mapa de maturidade em IA'],
  level: ['LEVEL', 'NIVEL', 'NÍVEL'],
  of: ['OF', 'DE', 'DE'],
  opps: ['TOP OPPORTUNITIES', 'PRINCIPALES OPORTUNIDADES', 'PRINCIPAIS OPORTUNIDADES'],
  estimate: ['TIME YOU COULD FREE UP', 'TIEMPO QUE PODRÍAS LIBERAR', 'TEMPO QUE VOCÊ PODERIA LIBERAR'],
  hrsmo: ['hours / month', 'horas / mes', 'horas / mês'],
  estNote: [
    'Estimate: hours per week × 4.3 × 60% automation potential. We validate it with you in the demo.',
    'Estimación: horas por semana × 4,3 × 60 % de potencial de automatización. La validamos contigo en la demo.',
    'Estimativa: horas por semana × 4,3 × 60% de potencial de automação. Validamos com você na demo.',
  ],
  toBook: ['Book my demo', 'Agendar mi demo', 'Agendar minha demo'],
  contactTitle: ['Where should we send your map?', '¿A dónde enviamos tu mapa?', 'Para onde enviamos seu mapa?'],
  fName: ['Your name', 'Tu nombre', 'Seu nome'],
  fEmail: ['Work email', 'Correo de trabajo', 'E-mail corporativo'],
  fPhone: ['Phone (optional)', 'Teléfono (opcional)', 'Telefone (opcional)'],
  fRole: ['Your role', 'Tu rol', 'Sua função'],
  consent: ['I agree to be contacted about my results.', 'Acepto que me contacten sobre mis resultados.', 'Concordo em ser contatado sobre meus resultados.'],
  chooseTime: ['Choose a time', 'Elegir horario', 'Escolher horário'],
  reportOnly: ['Just email me the report', 'Solo envíenme el informe', 'Só me enviem o relatório'],
  calTitle: ['Pick a time. We’ll bring your process.', 'Elige un horario. Nosotros llevamos tu proceso.', 'Escolha um horário. Nós levamos o seu processo.'],
  calMissing: [
    'Calendar not configured yet. We have your answers and will email you to set a time.',
    'El calendario aún no está configurado. Tenemos tus respuestas y te escribiremos para fijar un horario.',
    'A agenda ainda não está configurada. Temos suas respostas e enviaremos um e-mail para marcar um horário.',
  ],
  skipCal: ['I’ll book later', 'Agendaré después', 'Vou agendar depois'],
  doneTitle: ['You’re booked.', 'Listo, tu demo está agendada.', 'Pronto, sua demo está agendada.'],
  doneSub: [
    'In the demo we’ll show you {p}, connected to {s}. Your maturity map is on its way to {e}.',
    'En la demo te mostraremos {p}, conectado a {s}. Tu mapa de madurez va camino a {e}.',
    'Na demo vamos mostrar {p}, conectado a {s}. Seu mapa de maturidade está a caminho de {e}.',
  ],
  reportTitle: ['Your report is on its way.', 'Tu informe va en camino.', 'Seu relatório está a caminho.'],
  reportSub: [
    'Your maturity map is on its way to {e}. Book a demo whenever you’re ready.',
    'Tu mapa de madurez va camino a {e}. Agenda una demo cuando quieras.',
    'Seu mapa de maturidade está a caminho de {e}. Agende uma demo quando quiser.',
  ],
  backSite: ['Back to honto.ai', 'Volver a honto.ai', 'Voltar para honto.ai'],
  back: ['Back', 'Atrás', 'Voltar'],
  cont: ['Continue', 'Continuar', 'Continuar'],
  seeMap: ['See my map', 'Ver mi mapa', 'Ver meu mapa'],
  saving: ['Saving…', 'Guardando…', 'Salvando…'],
  error: ['Something went wrong. Please try again.', 'Algo salió mal. Inténtalo de nuevo.', 'Algo deu errado. Tente novamente.'],
  mapTitle: ['YOUR SYSTEMS MAP', 'TU MAPA DE SISTEMAS', 'SEU MAPA DE SISTEMAS'],
  mapEmpty: ['Your map builds as you answer.', 'Tu mapa se arma mientras respondes.', 'Seu mapa se monta enquanto você responde.'],
  mapBefore: [
    'Dashed lines = silos. Work that needs a person to carry it.',
    'Líneas punteadas = silos. Trabajo que alguien tiene que mover a mano.',
    'Linhas tracejadas = silos. Trabalho que alguém precisa levar à mão.',
  ],
  mapAfter: [
    'With Honto, every tool and team works on the same case.',
    'Con Honto, cada herramienta y equipo trabaja sobre el mismo caso.',
    'Com a Honto, cada ferramenta e equipe trabalha no mesmo caso.',
  ],
  badgeDraft: ['BUILDING', 'EN CONSTRUCCIÓN', 'EM CONSTRUÇÃO'],
  badgeSilos: ['SILOS TODAY', 'SILOS HOY', 'SILOS HOJE'],
  badgeOn: ['CONNECTED', 'CONECTADO', 'CONECTADO'],
  yourCompany: ['Your company', 'Tu empresa', 'Sua empresa'],
  legendTools: ['Tools', 'Herramientas', 'Ferramentas'],
  legendTeams: ['Teams', 'Equipos', 'Equipes'],
  and: ['and', 'y', 'e'],
} satisfies Record<string, Tri>;

export type TKey = keyof typeof T;
export const t = (key: TKey, lang: Lang) => tr(T[key] as Tri, lang);

// Option lists: [id, en, es?, pt?]
export type Opt = [string, string, string?, string?];
export const optLabel = (o: Opt, lang: Lang) => (o[li(lang) + 1] as string | undefined) ?? o[1];

export const O = {
  industry: [
    ['retail', 'Retail & e-commerce', 'Retail y e-commerce', 'Varejo e e-commerce'],
    ['distribution', 'Distribution & wholesale', 'Distribución y mayoreo', 'Distribuição e atacado'],
    ['manufacturing', 'Manufacturing', 'Manufactura', 'Indústria'],
    ['food', 'Food & beverage', 'Alimentos y bebidas', 'Alimentos e bebidas'],
    ['logistics', 'Logistics', 'Logística', 'Logística'],
    ['construction', 'Construction & real estate', 'Construcción e inmobiliaria', 'Construção e imobiliário'],
    ['finance', 'Financial services', 'Servicios financieros', 'Serviços financeiros'],
    ['health', 'Health', 'Salud', 'Saúde'],
    ['services', 'Professional services', 'Servicios profesionales', 'Serviços profissionais'],
    ['tech', 'Technology', 'Tecnología', 'Tecnologia'],
    ['public', 'Public sector', 'Sector público', 'Setor público'],
    ['other', 'Other', 'Otro', 'Outro'],
  ],
  size: [['1', '1–10'], ['2', '11–50'], ['3', '51–200'], ['4', '201–1,000'], ['5', '1,000+']],
  procs: [
    ['quotes', 'Quotes & proposals', 'Cotizaciones y propuestas', 'Cotações e propostas'],
    ['bids', 'Tenders & bids', 'Licitaciones', 'Licitações'],
    ['service', 'Customer service', 'Atención al cliente', 'Atendimento ao cliente'],
    ['invoices', 'Invoice processing', 'Procesamiento de facturas', 'Processamento de faturas'],
    ['collections', 'Collections', 'Cobranzas', 'Cobranças'],
    ['close', 'Daily close & reconciliation', 'Cierre diario y conciliación', 'Fechamento diário e conciliação'],
    ['purchasing', 'Purchase approvals', 'Aprobación de compras', 'Aprovação de compras'],
    ['inventory', 'Inventory & reorders', 'Inventario y reposición', 'Estoque e reposição'],
    ['reporting', 'Management reports', 'Reportes gerenciales', 'Relatórios gerenciais'],
    ['incidents', 'Incidents & maintenance', 'Incidencias y mantenimiento', 'Incidentes e manutenção'],
    ['hr', 'Hiring & onboarding', 'Selección y onboarding', 'Recrutamento e onboarding'],
    ['compliance', 'Compliance & audit', 'Cumplimiento y auditoría', 'Conformidade e auditoria'],
  ],
  freq: [
    ['daily', 'Every day', 'Todos los días', 'Todos os dias'],
    ['weekly', 'Every week', 'Cada semana', 'Toda semana'],
    ['monthly', 'Every month', 'Cada mes', 'Todo mês'],
  ],
  people: [['p1', '1–2'], ['p2', '3–5'], ['p3', '6–10'], ['p4', '10+']],
  hours: [['h1', 'Under 5', 'Menos de 5', 'Menos de 5'], ['h2', '5–10'], ['h3', '10–20'], ['h4', '20+']],
  approval: [
    ['none', 'No', 'No', 'Não'],
    ['some', 'Sometimes', 'A veces', 'Às vezes'],
    ['often', 'Often', 'Seguido', 'Frequentemente'],
    ['blocked', 'It blocks us', 'Nos bloquea', 'Nos trava'],
  ],
  systems: [
    ['excel', 'Excel / Sheets'],
    ['whatsapp', 'WhatsApp'],
    ['email', 'Email', 'Correo', 'E-mail'],
    ['paper', 'Paper', 'Papel', 'Papel'],
    ['erp', 'ERP (Odoo, SAP, Profit…)'],
    ['crm', 'CRM'],
    ['accounting', 'Accounting software', 'Software contable', 'Software contábil'],
    ['ecommerce', 'Online store', 'Tienda online', 'Loja online'],
    ['bi', 'BI / dashboards'],
    ['docs', 'Shared drives', 'Carpetas compartidas', 'Pastas compartilhadas'],
    ['tickets', 'Helpdesk'],
    ['custom', 'In-house apps', 'Apps propias', 'Apps próprios'],
  ],
  connected: [
    ['well', 'Well connected', 'Bien conectados', 'Bem conectados'],
    ['partly', 'Partly', 'En parte', 'Em parte'],
    ['isolated', 'Mostly isolated', 'Mayormente aislados', 'Em grande parte isolados'],
    ['unsure', 'Not sure', 'No sé', 'Não sei'],
  ],
  teams: [
    ['sales', 'Sales', 'Ventas', 'Vendas'],
    ['ops', 'Operations', 'Operaciones', 'Operações'],
    ['finance', 'Finance', 'Finanzas', 'Finanças'],
    ['purchasing', 'Purchasing', 'Compras', 'Compras'],
    ['service', 'Customer service', 'Atención al cliente', 'Atendimento'],
    ['hr', 'HR', 'RR. HH.', 'RH'],
    ['it', 'IT', 'TI', 'TI'],
    ['mgmt', 'Management', 'Gerencia', 'Diretoria'],
  ],
  knowledge: [['no', 'No', 'No', 'Não'], ['some', 'Partly', 'En parte', 'Em parte'], ['yes', 'Yes', 'Sí', 'Sim']],
  goal: [
    ['grow', 'Grow revenue', 'Crecer en ventas', 'Crescer em vendas'],
    ['cost', 'Cut costs', 'Reducir costos', 'Reduzir custos'],
    ['speed', 'Move faster', 'Ir más rápido', 'Ir mais rápido'],
    ['quality', 'Fewer errors', 'Menos errores', 'Menos erros'],
    ['visibility', 'Better visibility', 'Más visibilidad', 'Mais visibilidade'],
    ['scale', 'Grow without hiring', 'Crecer sin contratar', 'Crescer sem contratar'],
  ],
  timing: [
    ['now', 'As soon as possible', 'Lo antes posible', 'O quanto antes'],
    ['q', '1–3 months', '1–3 meses', '1–3 meses'],
    ['h', '3–6 months', '3–6 meses', '3–6 meses'],
    ['explore', 'Just exploring', 'Solo explorando', 'Só explorando'],
  ],
  role: [
    ['owner', 'Owner / CEO', 'Dueño / CEO', 'Dono / CEO'],
    ['ops', 'Operations', 'Operaciones', 'Operações'],
    ['finance', 'Finance', 'Finanzas', 'Finanças'],
    ['sales', 'Sales', 'Ventas', 'Vendas'],
    ['it', 'IT / Technology', 'TI / Tecnología', 'TI / Tecnologia'],
    ['other', 'Other', 'Otro', 'Outro'],
  ],
} satisfies Record<string, Opt[]>;

export type OptKey = keyof typeof O;
export const ids = (k: OptKey) => O[k].map((o) => o[0]) as [string, ...string[]];
export const labelOf = (k: OptKey, id: string | null | undefined, lang: Lang = 'en') => {
  const o = (O[k] as Opt[]).find((x) => x[0] === id);
  return o ? optLabel(o, lang) : '';
};

export const OPP: Record<string, Tri> = {
  quotes: ['Quotes out the same hour', 'Cotizaciones en la misma hora', 'Cotações na mesma hora'],
  bids: ['Tenders answered in days', 'Licitaciones respondidas en días', 'Licitações respondidas em dias'],
  service: ['The right answer, first time', 'La respuesta correcta a la primera', 'A resposta certa de primeira'],
  invoices: ['Invoices matched, not typed', 'Facturas conciliadas, no tipeadas', 'Faturas conciliadas, não digitadas'],
  collections: ['Get paid faster', 'Cobra más rápido', 'Receba mais rápido'],
  close: ['Daily close without the chase', 'Cierre diario sin perseguir a nadie', 'Fechamento diário sem correria'],
  purchasing: ['Approvals in hours, not days', 'Aprobaciones en horas, no en días', 'Aprovações em horas, não em dias'],
  inventory: ['Stock where it should be', 'El stock donde debe estar', 'Estoque onde deve estar'],
  reporting: ['Reports nobody has to build', 'Reportes que nadie tiene que armar', 'Relatórios que ninguém precisa montar'],
  incidents: ['Issues solved once, not every week', 'Problemas resueltos una sola vez', 'Problemas resolvidos uma vez só'],
  hr: ['Productive from day one', 'Productivos desde el primer día', 'Produtivos desde o primeiro dia'],
  compliance: ['Evidence ready before the audit', 'Evidencia lista antes de la auditoría', 'Evidências prontas antes da auditoria'],
};

export const LEVELS: { name: Tri; desc: Tri }[] = [
  { name: ['Manual', 'Manual', 'Manual'], desc: ['Work lives in people and spreadsheets.', 'El trabajo vive en personas y hojas de cálculo.', 'O trabalho vive em pessoas e planilhas.'] },
  { name: ['Emerging', 'Emergente', 'Emergente'], desc: ['Some tools, many manual bridges.', 'Algunas herramientas, muchos puentes manuales.', 'Algumas ferramentas, muitas pontes manuais.'] },
  { name: ['Connected', 'Conectado', 'Conectado'], desc: ['Systems connect; work still waits on people.', 'Los sistemas se conectan; el trabajo aún espera por personas.', 'Os sistemas se conectam; o trabalho ainda espera pessoas.'] },
  { name: ['Automated', 'Automatizado', 'Automatizado'], desc: ['Key processes run on their own.', 'Los procesos clave corren solos.', 'Os processos-chave rodam sozinhos.'] },
  { name: ['Orchestrated', 'Orquestado', 'Orquestrado'], desc: ['People and AI agents run the business together.', 'Personas y agentes de IA operan juntos el negocio.', 'Pessoas e agentes de IA operam juntos o negócio.'] },
];

export const HOURS: Record<string, number> = { h1: 2.5, h2: 7.5, h3: 15, h4: 30 };

export type Answers = {
  company: string;
  industry: string | null;
  size: string | null;
  procs: string[];
  freq: string | null;
  people: string | null;
  hours: string | null;
  approval: string | null;
  systems: string[];
  connected: string | null;
  teams: string[];
  knowledge: string | null;
  goal: string | null;
  timing: string | null;
  name: string;
  email: string;
  phone: string;
  role: string | null;
  consent: boolean;
};

export const emptyAnswers = (): Answers => ({
  company: '', industry: null, size: null, procs: [], freq: null, people: null, hours: null, approval: null,
  systems: [], connected: null, teams: [], knowledge: null, goal: null, timing: null,
  name: '', email: '', phone: '', role: null, consent: false,
});

/** AI maturity level 1–5 from the answers. Same formula on client and server. */
export function scoreLevel(a: Pick<Answers, 'connected' | 'approval' | 'knowledge' | 'hours' | 'systems'>): number {
  let p = 0;
  p += ({ well: 3, partly: 2, unsure: 1, isolated: 0 } as Record<string, number>)[a.connected ?? ''] ?? 0;
  p += ({ none: 2, some: 1 } as Record<string, number>)[a.approval ?? ''] ?? 0;
  p += ({ no: 2, some: 1 } as Record<string, number>)[a.knowledge ?? ''] ?? 0;
  p += ({ h1: 2, h2: 1 } as Record<string, number>)[a.hours ?? ''] ?? 0;
  if (a.systems.some((s) => s === 'erp' || s === 'crm' || s === 'bi')) p += 1;
  return Math.min(5, 1 + Math.floor((p / 10) * 4.99));
}

/** Hours per month that could be freed: hours/week × 4.3 × 60%. */
export const estimateHours = (hours: string | null) => (hours ? Math.round((HOURS[hours] ?? 0) * 4.3 * 0.6) : 0);
