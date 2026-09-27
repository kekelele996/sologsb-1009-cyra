import "@shoelace-style/shoelace/dist/shoelace.js";

type BlockType = "heading" | "paragraph" | "image" | "link";
type ReviewStatus = "pending" | "approved" | "needs-work";
type Severity = "error" | "warning" | "info";

interface CommentReply {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

interface CommentItem {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  resolved: boolean;
  replies: CommentReply[];
}

interface ContentBlock {
  id: string;
  type: BlockType;
  text: string;
  accessibleText: string;
  headingLevel?: number;
  imageSrc?: string;
  imageAlt?: string;
  linkHref?: string;
  changeReason: string;
  reviewStatus: ReviewStatus;
  comments: CommentItem[];
}

interface GlossaryTerm {
  id: string;
  source: string;
  preferred: string;
  note: string;
}

interface VersionSnapshot {
  id: string;
  label: string;
  createdAt: string;
  blocks: ContentBlock[];
  glossary: GlossaryTerm[];
}

interface ChapterProject {
  id: string;
  title: string;
  subject: string;
  grade: string;
  blocks: ContentBlock[];
  glossary: GlossaryTerm[];
  versions: VersionSnapshot[];
  issueAcceptance: Record<string, IssueAcceptance>;
  updatedAt: string;
}

interface AccessibilityIssue {
  id: string;
  blockId: string;
  termId?: string;
  type: "heading" | "link" | "image" | "glossary" | "sentence";
  severity: Severity;
  title: string;
  detail: string;
  suggestion: string;
}

type IssueStatus = "open" | "resolved" | "waived";

interface IssueAcceptance {
  assignee: string;
  status: IssueStatus;
  note: string;
  waiveReason: string;
  resolvedAt: string;
  resolvedBy: string;
  resolvedSignature: string;
  reopenedAt: string;
  /** 问题在最近一次检查中暂时检测不到（如逐字编辑的中间态），保留记录以便恢复。 */
  gone?: boolean;
}

const STORAGE_KEY = "sologsb-1009-accessible-textbook-v1";
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function createSeedProject(): ChapterProject {
  const blocks: ContentBlock[] = [
    {
      id: "block-h1",
      type: "heading",
      headingLevel: 1,
      text: "第三章 水循环与城市",
      accessibleText: "第三章 水循环与城市",
      changeReason: "",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-p1",
      type: "paragraph",
      text: "城市中的水并非取之不尽，由于其会通过蒸发、降水以及地表径流等若干复杂过程在自然界中持续循环，因此理解这些过程对于建设具有韧性的城市具有十分重要的意义。",
      accessibleText: "城市里的水会不断循环。它经过蒸发、降水并沿地面流动。了解这些过程，可以帮助我们建设更能适应变化的城市。",
      changeReason: "拆分长句，把抽象表述改为更直接的说明。",
      reviewStatus: "pending",
      comments: [],
    },
    {
      id: "block-h2",
      type: "heading",
      headingLevel: 2,
      text: "一、水从哪里来",
      accessibleText: "一、水从哪里来",
      changeReason: "保留原章节结构。",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-img",
      type: "image",
      text: "图 3-1 城市水循环示意",
      imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='420'%3E%3Crect width='800' height='420' fill='%23dcecf3'/%3E%3Ccircle cx='650' cy='85' r='45' fill='%23f4c95d'/%3E%3Cpath d='M0 300 Q180 240 340 300 T800 280 V420 H0Z' fill='%2389b7d0'/%3E%3Cpath d='M130 285 Q220 170 330 285' fill='none' stroke='%233a7c9e' stroke-width='12'/%3E%3C/svg%3E",
      imageAlt: "",
      accessibleText: "",
      changeReason: "",
      reviewStatus: "needs-work",
      comments: [],
    },
    {
      id: "block-p2",
      type: "paragraph",
      text: "当太阳照射到水面时，水会受热变成水蒸气升到空中。水蒸气冷却后形成云，再以雨或雪的形式落回地面。",
      accessibleText: "太阳照在水面上，水会变成水蒸气升到空中。水蒸气冷却后变成云，最后以雨或雪落回地面。",
      changeReason: "使用较短句子，并明确每个步骤的先后顺序。",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-link",
      type: "link",
      text: "点击这里",
      linkHref: "/resources/water-cycle",
      accessibleText: "打开水循环互动实验",
      changeReason: "改为说明链接目标的独立文案。",
      reviewStatus: "pending",
      comments: [],
    },
    {
      id: "block-h3",
      type: "heading",
      headingLevel: 3,
      text: "雨水花园怎样工作",
      accessibleText: "雨水花园怎样工作",
      changeReason: "",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-p3",
      type: "paragraph",
      text: "雨水花园利用土壤和植物的共同作用暂时储存雨水，同时通过下渗补给地下水，并在降雨较集中时减轻城市排水管道所承受的压力。",
      accessibleText: "雨水花园用土壤和植物暂时存住雨水。雨水还会慢慢渗入地下，补充地下水。雨很大时，它可以减轻排水管的压力。",
      changeReason: "把并列成分拆成短句，减少专业术语密度。",
      reviewStatus: "pending",
      comments: [],
    },
  ];

  return {
    id: "accessible-textbook-1009",
    title: "科学（五年级下册）·无障碍改写稿",
    subject: "科学",
    grade: "五年级",
    blocks,
    glossary: [
      { id: "term-1", source: "水循环", preferred: "水循环", note: "全书统一使用" },
      { id: "term-2", source: "地表径流", preferred: "沿地面流动的水", note: "首次出现时使用通俗解释" },
      { id: "term-3", source: "下渗", preferred: "渗入地下", note: "避免单独使用专业词" },
    ],
    versions: [],
    issueAcceptance: {},
    updatedAt: new Date().toISOString(),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseImportedChapter(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push(blankBlock("heading", heading[2], { headingLevel: heading[1].length }));
      continue;
    }
    const image = /^!\[([^\]]*)\]\(([^)]+)\)(?:\s+(.+))?$/.exec(line);
    if (image) {
      blocks.push(blankBlock("image", image[3] || "未命名图片", { imageSrc: image[2], imageAlt: image[1] }));
      continue;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(line);
    if (link) {
      blocks.push(blankBlock("link", link[1], { linkHref: link[2] }));
      continue;
    }
    blocks.push(blankBlock("paragraph", line));
  }
  return blocks.length ? blocks : [blankBlock("paragraph", input.trim() || "请输入章节内容")];
}

function blankBlock(type: BlockType, text: string, extra: Partial<ContentBlock> = {}): ContentBlock {
  return {
    id: uid("block"),
    type,
    text,
    accessibleText: type === "image" ? extra.imageAlt ?? "" : text,
    changeReason: "",
    reviewStatus: "pending",
    comments: [],
    ...extra,
  };
}

function sentenceLength(text: string) {
  const normalized = text.replace(/\s+/g, "");
  return /[A-Za-z]/.test(text) ? text.trim().split(/\s+/).length : normalized.length;
}

function analyze(project: ChapterProject): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  let lastHeading = 0;
  for (const block of project.blocks) {
    if (block.type === "heading") {
      const level = block.headingLevel ?? 2;
      if (lastHeading && level > lastHeading + 1) {
        issues.push({
          id: `heading-${block.id}`,
          blockId: block.id,
          type: "heading",
          severity: "error",
          title: "标题层级跳跃",
          detail: `从 H${lastHeading} 直接到 H${level}，读屏用户会失去清晰的章节结构。`,
          suggestion: `改为 H${lastHeading + 1}，或补上中间的上级标题。`,
        });
      }
      lastHeading = level;
    }
    if (block.type === "image" && !(block.imageAlt ?? block.accessibleText).trim()) {
      issues.push({
        id: `image-${block.id}`,
        blockId: block.id,
        type: "image",
        severity: "error",
        title: "图片缺少替代文本",
        detail: "视觉用户能看到的图表信息，读屏用户目前无法获得。",
        suggestion: "说明图中主体、变化和结论；纯装饰图片应标记为空替代文本。",
      });
    }
    if (block.type === "link") {
      const label = block.accessibleText || block.text;
      if (/^(点击这里|这里|链接|更多|here|click here|read more)$/i.test(label.trim())) {
        issues.push({
          id: `link-${block.id}`,
          blockId: block.id,
          type: "link",
          severity: "error",
          title: "链接文案缺少目的",
          detail: `“${label}”单独朗读时无法说明会前往哪里。`,
          suggestion: "改成“打开水循环互动实验”等可独立理解的文案。",
        });
      }
    }
    const text = block.type === "image" ? block.text : block.text;
    const sentences = text.split(/(?<=[。！？!?])\s*/).filter(Boolean);
    for (const [index, sentence] of sentences.entries()) {
      if (sentenceLength(sentence) > (/[A-Za-z]/.test(sentence) ? 28 : 42)) {
        issues.push({
          id: `sentence-${block.id}-${index}`,
          blockId: block.id,
          type: "sentence",
          severity: "warning",
          title: "句子过长",
          detail: `该句约 ${sentenceLength(sentence)} ${/[A-Za-z]/.test(sentence) ? "个词" : "个字"}，一次理解的信息较多。`,
          suggestion: "按动作或因果关系拆成 2—3 个短句。",
        });
      }
    }
    const source = `${block.text} ${block.accessibleText}`;
    for (const term of project.glossary) {
      if (source.includes(term.source) && block.accessibleText && !block.accessibleText.includes(term.preferred)) {
        issues.push({
          id: `term-${block.id}-${term.id}`,
          blockId: block.id,
          termId: term.id,
          type: "glossary",
          severity: "info",
          title: `术语“${term.source}”尚未统一`,
          detail: `全书建议表述为“${term.preferred}”。${term.note}`,
          suggestion: `将无障碍文本调整为“${term.preferred}”。`,
        });
      }
    }
  }
  return issues;
}

/**
 * 计算问题所依赖的内容指纹。正文、标题、术语等相关内容一旦改变，指纹就不同，
 * 已经解决/放行的旧结论会因此失效，问题重新回到待处理状态。
 */
function issueSignature(issue: AccessibilityIssue, project: ChapterProject): string {
  const block = project.blocks.find((item) => item.id === issue.blockId);
  if (!block) return `missing:${issue.id}`;
  const sentenceIndex = issue.type === "sentence"
    ? Number(issue.id.slice(issue.id.lastIndexOf("-") + 1))
    : -1;
  switch (issue.type) {
    case "heading":
      return `heading:l${block.headingLevel ?? 2}:${block.text}`;
    case "image":
      return `image:${block.imageAlt ?? ""}|${block.accessibleText}`;
    case "link":
      return `link:${block.accessibleText}|${block.text}`;
    case "glossary": {
      const term = project.glossary.find((item) => item.id === issue.termId);
      return `glossary:${block.text}|${block.accessibleText}|${term ? `${term.source}>${term.preferred}` : "term-removed"}`;
    }
    case "sentence": {
      const sentences = block.text.split(/(?<=[。！？!?])\s*/).filter(Boolean);
      return `sentence:${sentences[sentenceIndex] ?? block.text}`;
    }
  }
}

/**
 * 按当前检查结果对账验收记录：
 * - 问题仍存在但其依赖内容已改变：把已解决/已放行结论打回待处理（保留处理人）；
 * - 问题暂时检测不到但内容块仍在：多为逐字编辑的中间态，先标记 gone 保留结论；
 *   再次出现时按指纹决定恢复还是打回；
 * - 内容块被删除（问题永久消失）：清理记录；
 * - 待处理记录保持不变。
 */
function reconcileAcceptance(draft: ChapterProject) {
  if (!draft.issueAcceptance) draft.issueAcceptance = {};
  const current = analyze(draft);
  const live = new Map(current.map((issue) => [issue.id, issue]));
  for (const [issueId, acceptance] of Object.entries(draft.issueAcceptance)) {
    const issue = live.get(issueId);
    if (!issue) {
      // 内容块被真正删除时清理记录；否则可能只是逐字编辑的中间态，先保留为 gone。
      const blockStillExists = draft.blocks.some((block) => block.id === blockIdOfIssue(issueId));
      if (!blockStillExists) {
        delete draft.issueAcceptance[issueId];
      } else if (!acceptance.gone) {
        draft.issueAcceptance[issueId] = { ...acceptance, gone: true };
      }
      continue;
    }
    if (acceptance.gone) {
      // 问题在中间态消失后又出现：内容已变则结论失效；内容相同则恢复原结论。
      if (acceptance.status !== "open" && acceptance.resolvedSignature !== issueSignature(issue, draft)) {
        draft.issueAcceptance[issueId] = reopenAcceptance(acceptance);
      } else {
        draft.issueAcceptance[issueId] = { ...acceptance, gone: false };
      }
      continue;
    }
    if (acceptance.status !== "open" && acceptance.resolvedSignature !== issueSignature(issue, draft)) {
      draft.issueAcceptance[issueId] = reopenAcceptance(acceptance);
    }
  }
}

function blockIdOfIssue(issueId: string): string {
  // analyze() 生成的 id：image-<block>、link-<block>、heading-<block>、sentence-<block>-<index>、term-<block>-<termId>
  const body = issueId.replace(/^(image|link|heading|sentence|term)-/, "");
  if (issueId.startsWith("sentence-")) return body.replace(/-\d+$/, "");
  if (issueId.startsWith("term-")) return body.slice(0, body.lastIndexOf("-"));
  return body;
}

function reopenAcceptance(acceptance: IssueAcceptance): IssueAcceptance {
  return {
    assignee: acceptance.assignee,
    status: "open",
    note: "",
    waiveReason: "",
    resolvedAt: "",
    resolvedBy: "",
    resolvedSignature: "",
    reopenedAt: new Date().toISOString(),
    gone: false,
  };
}

function ensureAcceptance(project: ChapterProject, issueId: string): IssueAcceptance {
  return project.issueAcceptance[issueId] ?? {
    assignee: "",
    status: "open",
    note: "",
    waiveReason: "",
    resolvedAt: "",
    resolvedBy: "",
    resolvedSignature: "",
    reopenedAt: "",
    gone: false,
  };
}

function collectAssignees(project: ChapterProject): string[] {
  const names = new Set<string>();
  for (const acceptance of Object.values(project.issueAcceptance)) {
    if (acceptance.assignee.trim()) names.add(acceptance.assignee.trim());
  }
  return [...names];
}

/** 从 DOM 读取某个问题当前正在编辑的处理人与说明（同一问题在编辑区和验收区各有一份输入）。 */
function syncIssueDraft(issueId: string) {
  let changed = false;
  let acceptance = project.issueAcceptance[issueId] ?? ensureAcceptance(project, issueId);
  app.querySelectorAll<HTMLElement>(`[data-issue-assignee="${CSS.escape(issueId)}"]`).forEach((element) => {
    const value = (element as HTMLElement & { value: string }).value;
    if (value !== acceptance.assignee) { acceptance = { ...acceptance, assignee: value }; changed = true; }
  });
  app.querySelectorAll<HTMLElement>(`[data-issue-note="${CSS.escape(issueId)}"]`).forEach((element) => {
    const value = (element as HTMLElement & { value: string }).value;
    if (value !== acceptance.note) { acceptance = { ...acceptance, note: value }; changed = true; }
  });
  if (changed) {
    project.issueAcceptance[issueId] = acceptance;
    saveSoon();
  }
}

function simplifyText(input: string, glossary: GlossaryTerm[]) {
  let result = input
    .replaceAll("由于其", "因为")
    .replaceAll("因此", "所以")
    .replaceAll("具有十分重要的意义", "很重要")
    .replaceAll("利用", "使用")
    .replaceAll("共同作用", "一起作用")
    .replaceAll("暂时储存", "暂时存住")
    .replaceAll("所承受的压力", "受到的压力")
    .replace(/([^。！？]{38,}?)[，、]([^。！？]{12,}?[。！？])/g, "$1。$2");
  for (const term of glossary) {
    if (result.includes(term.source)) result = result.replaceAll(term.source, term.preferred);
  }
  result = result
    .split(/(?<=[。！？!?])\s*/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .join("\n");
  return result;
}

function blockRole(block: ContentBlock) {
  if (block.type === "heading") return `H${block.headingLevel ?? 2} 标题`;
  if (block.type === "image") return "图片 / 替代文本";
  if (block.type === "link") return "链接";
  return "正文段落";
}

function statusLabel(status: ReviewStatus) {
  if (status === "approved") return "已通过";
  if (status === "needs-work") return "需修改";
  return "待审核";
}

function severityLabel(severity: Severity) {
  if (severity === "error") return "必须修复";
  if (severity === "warning") return "建议优化";
  return "一致性提醒";
}

function exportHtml(project: ChapterProject) {
  const body = project.blocks.map((block) => {
    if (block.type === "heading") {
      const level = Math.min(6, Math.max(1, block.headingLevel ?? 2));
      return `<h${level}>${escapeHtml(block.accessibleText || block.text)}</h${level}>`;
    }
    if (block.type === "image") {
      return `<figure><img src="${escapeHtml(block.imageSrc ?? "")}" alt="${escapeHtml(block.imageAlt || block.accessibleText)}"><figcaption>${escapeHtml(block.text)}</figcaption></figure>`;
    }
    if (block.type === "link") {
      return `<p><a href="${escapeHtml(block.linkHref ?? "#")}">${escapeHtml(block.accessibleText || block.text)}</a></p>`;
    }
    return `<p>${escapeHtml(block.accessibleText || block.text)}</p>`;
  }).join("\n      ");
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(project.title)} · 无障碍版本</title>
  <style>
    :root { font-family: "Noto Sans SC", sans-serif; font-size: 20px; line-height: 1.85; color: #17231f; background: #fffdf7; }
    body { max-width: 760px; margin: 0 auto; padding: 32px 24px 80px; }
    a { color: #075c9d; text-decoration-thickness: 2px; text-underline-offset: 3px; }
    a:focus-visible, [tabindex]:focus-visible { outline: 4px solid #d08a00; outline-offset: 3px; }
    h1, h2, h3, h4, h5, h6 { line-height: 1.4; margin-top: 1.8em; }
    figure { margin: 2em 0; } img { max-width: 100%; height: auto; } figcaption { font-size: .86em; color: #46554f; }
    .skip { position: absolute; left: -9999px; } .skip:focus { position: static; display: inline-block; padding: .5em; background: #fff; }
  </style>
</head>
<body>
  <a class="skip" href="#main">跳到正文</a>
  <main id="main" tabindex="-1">
      ${body}
  </main>
</body>
</html>`;
}

function download(filename: string, content: string, type = "text/html;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function loadProject(): ChapterProject {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "") as { schema: number; project: ChapterProject };
    if (stored.schema === 1 && stored.project?.blocks?.length) {
      if (!stored.project.issueAcceptance) stored.project.issueAcceptance = {};
      // gone 只是逐字编辑中间态，跨会话无意义，加载时先丢弃再按当前内容对账。
      for (const [id, acceptance] of Object.entries(stored.project.issueAcceptance)) {
        if (acceptance.gone) delete stored.project.issueAcceptance[id];
      }
      reconcileAcceptance(stored.project);
      return stored.project;
    }
  } catch {
    // Fall back to the bundled sample.
  }
  return createSeedProject();
}

const rootElement = document.querySelector<HTMLDivElement>("#app");
if (!rootElement) throw new Error("Application root was not found");
const app: HTMLDivElement = rootElement;

let project = loadProject();
let activeBlockId = project.blocks[0]?.id ?? "";
let activeIssueId = "";
let previewMode: "normal" | "assisted" = "normal";
let selectedVersionId = "";
let showGlossary = false;
let issueFilter: "open" | "all" = "open";
let showExportBlocker = false;
let undoStack: ChapterProject[] = [];
let redoStack: ChapterProject[] = [];
let saveTimer = 0;

const activeBlock = () => project.blocks.find((block) => block.id === activeBlockId) ?? project.blocks[0];
const issues = () => analyze(project);

function saveSoon() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, project }));
  }, 320);
}

function commit(label: string, update: (draft: ChapterProject) => void, renderAfter = true) {
  undoStack = [...undoStack.slice(-49), structuredClone(project)];
  redoStack = [];
  const draft = structuredClone(project);
  update(draft);
  reconcileAcceptance(draft);
  draft.updatedAt = new Date().toISOString();
  project = draft;
  document.documentElement.dataset.lastAction = label;
  saveSoon();
  if (renderAfter) render();
}

function undo() {
  const previous = undoStack.pop();
  if (!previous) return;
  redoStack = [structuredClone(project), ...redoStack].slice(0, 50);
  project = previous;
  if (!project.blocks.some((block) => block.id === activeBlockId)) activeBlockId = project.blocks[0]?.id ?? "";
  reconcileAcceptance(project);
  saveSoon();
  render();
}

function redo() {
  const next = redoStack.shift();
  if (!next) return;
  undoStack = [...undoStack.slice(-49), structuredClone(project)];
  project = next;
  reconcileAcceptance(project);
  saveSoon();
  render();
}

function updateActiveBlock(update: (block: ContentBlock, draft: ChapterProject) => void, label = "修改无障碍文本", renderAfter = true) {
  commit(label, (draft) => {
    const block = draft.blocks.find((item) => item.id === activeBlockId);
    if (block) update(block, draft);
  }, renderAfter);
}

function closeIssue(issue: AccessibilityIssue, waive: boolean) {
  // 先同步用户尚未失焦的输入，避免填完直接点按钮时丢失处理人或说明。
  syncIssueDraft(issue.id);
  const current = ensureAcceptance(project, issue.id);
  const note = current.note.trim();
  if (!note) {
    document.documentElement.dataset.lastAction = waive ? "放行失败：必须写明理由" : "解决失败：请先填写处理说明";
    render();
    requestAnimationFrame(() => {
      const field = app.querySelector<HTMLElement>(`[data-issue-note="${CSS.escape(issue.id)}"]`);
      field?.setAttribute("data-invalid", "true");
      (field as unknown as { focus?: () => void })?.focus?.();
    });
    return;
  }
  if (waive && issue.severity === "error") return;
  commit(waive ? "带理由放行问题" : "标记问题已解决", (draft) => {
    const acceptance = ensureAcceptance(draft, issue.id);
    const now = new Date().toISOString();
    draft.issueAcceptance[issue.id] = {
      assignee: acceptance.assignee,
      status: waive ? "waived" : "resolved",
      note,
      waiveReason: waive ? note : "",
      resolvedAt: now,
      resolvedBy: acceptance.assignee || "当前编辑",
      resolvedSignature: issueSignature(issue, draft),
      reopenedAt: "",
      gone: false,
    };
  });
}

function render() {
  const list = issues();
  const active = activeBlock();
  const activeIssues = list.filter((issue) => issue.blockId === active.id);
  const approved = project.blocks.filter((block) => block.reviewStatus === "approved").length;
  const version = project.versions.find((item) => item.id === selectedVersionId) ?? project.versions[0];
  const openIssues = list.filter((issue) => ensureAcceptance(project, issue.id).status === "open");
  const resolvedCount = list.filter((issue) => ensureAcceptance(project, issue.id).status === "resolved").length;
  const waivedCount = list.filter((issue) => ensureAcceptance(project, issue.id).status === "waived").length;
  const panelIssues = issueFilter === "open" ? openIssues : list;
  const assigneeOptions = collectAssignees(project);

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand"><span>无障碍</span><b>1009</b></div>
        <div class="title-block">
          <input id="project-title" aria-label="教材名称" value="${escapeHtml(project.title)}" />
          <div class="meta"><span>${escapeHtml(project.subject)}</span><span>${escapeHtml(project.grade)}</span><span class="save-dot">本地自动保存</span></div>
        </div>
        <div class="top-actions">
          <span class="online-pill">${navigator.onLine ? "在线" : "离线可编辑"}</span>
          <sl-button size="small" variant="default" ${undoStack.length ? "" : "disabled"} data-action="undo">撤销</sl-button>
          <sl-button size="small" variant="default" ${redoStack.length ? "" : "disabled"} data-action="redo">重做</sl-button>
          <sl-button size="small" variant="default" data-action="glossary">术语表</sl-button>
          <sl-button size="small" variant="primary" data-action="save-version">保存版本</sl-button>
          <sl-button size="small" variant="success" data-action="export">导出无障碍 HTML</sl-button>
        </div>
      </header>

      <div class="progress-strip">
        <div class="progress-copy"><b>${approved}/${project.blocks.length}</b><span>内容块已审核通过</span></div>
        <div class="progress-bar"><i style="width:${Math.round((approved / Math.max(1, project.blocks.length)) * 100)}%"></i></div>
        <div class="issue-counts">
          <span class="error">${openIssues.filter((issue) => issue.severity === "error").length} 必须修复未处理</span>
          <span class="warning">${openIssues.filter((issue) => issue.severity === "warning").length} 建议项未处理</span>
          <span class="info">${openIssues.filter((issue) => issue.severity === "info").length} 提醒未处理</span>
          <span class="done-count">${resolvedCount} 已解决 · ${waivedCount} 已放行</span>
        </div>
      </div>

      <div class="workspace">
        <aside class="outline-panel">
          <div class="panel-title"><span>章节结构</span><sl-badge>${project.blocks.length} 块</sl-badge></div>
          <div class="block-list">
            ${project.blocks.map((block, index) => {
              const blockIssues = list.filter((issue) => issue.blockId === block.id && ensureAcceptance(project, issue.id).status === "open");
              return `<button class="block-item ${block.id === active.id ? "active" : ""}" data-action="select-block" data-block-id="${block.id}">
                <span class="block-order">${index + 1}</span>
                <span class="block-copy"><b>${block.type === "heading" ? `H${block.headingLevel}` : blockRole(block)}</b><span>${escapeHtml(block.accessibleText || block.text || "（空）")}</span></span>
                <i class="status-${block.reviewStatus}" title="${statusLabel(block.reviewStatus)}"></i>
                ${blockIssues.length ? `<em>${blockIssues.length}</em>` : ""}
              </button>`;
            }).join("")}
          </div>
          <input id="chapter-file" type="file" accept=".txt,.md,.markdown" hidden />
          <sl-button class="import-button" variant="default" data-action="import">导入章节文本</sl-button>
          <div class="keyboard-note"><b>键盘</b><span><kbd>J</kbd><kbd>K</kbd> 跳转问题</span><span><kbd>E</kbd> 自动改写</span><span><kbd>⌘ Z</kbd> 撤销</span><span><kbd>1</kbd><kbd>2</kbd> 预览模式</span></div>
        </aside>

        <main class="editor-panel">
          <div class="editor-head">
            <div><span class="eyebrow">当前内容块</span><h1>${blockRole(active)}</h1></div>
            <div class="review-actions">
              <sl-button size="small" variant="${active.reviewStatus === "approved" ? "success" : "default"}" data-action="approve">${active.reviewStatus === "approved" ? "✓ 已通过" : "审核通过"}</sl-button>
              <sl-button size="small" variant="${active.reviewStatus === "needs-work" ? "danger" : "default"}" data-action="needs-work">需修改</sl-button>
            </div>
          </div>

          ${activeIssues.length ? `<div class="active-issues">${activeIssues.map((issue) => `
            <div class="issue-card ${issue.severity}">
              <div><sl-badge variant="${issue.severity === "error" ? "danger" : issue.severity === "warning" ? "warning" : "primary"}">${severityLabel(issue.severity)}</sl-badge><strong>${escapeHtml(issue.title)}</strong>${renderIssueStatusBadge(issue)}</div>
              <p>${escapeHtml(issue.detail)}</p><small>${escapeHtml(issue.suggestion)}</small>
              ${renderIssueAcceptance(issue, assigneeOptions, "editor")}
            </div>`).join("")}</div>` : `<div class="issue-clear">✓ 当前内容块没有新的无障碍问题</div>`}

          <section class="edit-card source-card">
            <div class="section-heading"><div><span class="eyebrow">原教材</span><h2>${active.type === "image" ? "图片信息" : active.type === "link" ? "链接信息" : "原文"}</h2></div><sl-badge variant="neutral">${active.type}</sl-badge></div>
            ${renderSourceEditor(active)}
          </section>

          <section class="edit-card rewrite-card">
            <div class="section-heading">
              <div><span class="eyebrow">Accessible rewrite</span><h2>无障碍表达</h2></div>
              <sl-button size="small" variant="primary" outline data-action="generate">生成易读版本</sl-button>
            </div>
            ${renderAccessibleEditor(active)}
            <label class="field-label" for="reason-${active.id}">改写原因（每处改写必须记录）</label>
            <sl-textarea id="reason-${active.id}" data-field="reason" rows="2" value="${escapeHtml(active.changeReason)}" placeholder="例如：拆分长句、替换专业表达、补充链接目的"></sl-textarea>
          </section>

          <section class="edit-card">
            <div class="section-heading"><div><span class="eyebrow">Review discussion</span><h2>批注与回复</h2></div><sl-badge variant="warning">${active.comments.length} 条</sl-badge></div>
            <div class="comment-compose"><sl-textarea id="new-comment" rows="2" placeholder="记录改写依据、审核意见或术语讨论…"></sl-textarea><sl-button size="small" variant="primary" data-action="add-comment">添加批注</sl-button></div>
            <div class="comment-list">
              ${active.comments.length ? active.comments.map((comment) => `
                <article class="comment ${comment.resolved ? "resolved" : ""}">
                  <header><b>${escapeHtml(comment.author)}</b><time>${new Date(comment.createdAt).toLocaleString()}</time></header>
                  <p>${escapeHtml(comment.body)}</p>
                  ${comment.replies.map((reply) => `<div class="reply"><b>${escapeHtml(reply.author)}</b><span>${escapeHtml(reply.body)}</span></div>`).join("")}
                  <div class="reply-row"><sl-input size="small" id="reply-${comment.id}" placeholder="回复…"></sl-input><sl-button size="small" data-action="reply" data-comment-id="${comment.id}">回复</sl-button><sl-button size="small" variant="text" data-action="resolve-comment" data-comment-id="${comment.id}">${comment.resolved ? "重新打开" : "解决"}</sl-button></div>
                </article>`).join("") : `<div class="empty-note">当前内容块还没有批注。</div>`}
            </div>
          </section>
        </main>

        <aside class="review-panel">
          <section class="preview-card">
            <div class="section-heading"><div><span class="eyebrow">Reader preview</span><h2>阅读预览</h2></div><div class="mode-switch"><button class="${previewMode === "normal" ? "active" : ""}" data-action="preview-normal">普通</button><button class="${previewMode === "assisted" ? "active" : ""}" data-action="preview-assisted">辅助</button></div></div>
            <div class="reader-preview mode-${previewMode}">${renderPreview()}</div>
          </section>

          <section class="order-card">
            <div class="section-heading"><div><span class="eyebrow">Screen reader order</span><h2>读屏阅读顺序</h2></div><sl-badge>从上到下</sl-badge></div>
            <ol class="reading-order">
              ${project.blocks.map((block, index) => `<li class="${block.id === active.id ? "active" : ""}"><b>${index + 1}</b><div><strong>${blockRole(block)}</strong><span>${escapeHtml(block.accessibleText || block.text || "（无内容）")}</span></div></li>`).join("")}
            </ol>
          </section>

          <section class="issues-panel acceptance-panel">
            <div class="section-heading"><div><span class="eyebrow">Release acceptance</span><h2>发布前验收</h2></div><sl-badge variant="${openIssues.length ? "danger" : "success"}">${openIssues.length} 待处理</sl-badge></div>
            <div class="acceptance-summary">
              <span class="error">必须修复 ${list.filter((i) => i.severity === "error").length}（未处理 ${list.filter((i) => i.severity === "error" && ensureAcceptance(project, i.id).status === "open").length}）</span>
              <span class="warning">建议 ${list.filter((i) => i.severity === "warning").length}（未处理 ${list.filter((i) => i.severity === "warning" && ensureAcceptance(project, i.id).status === "open").length}）</span>
              <span class="info">提醒 ${list.filter((i) => i.severity === "info").length}（未处理 ${list.filter((i) => i.severity === "info" && ensureAcceptance(project, i.id).status === "open").length}）</span>
            </div>
            <div class="mode-switch issue-filter">
              <button class="${issueFilter === "open" ? "active" : ""}" data-action="filter-issues" data-filter="open">只看未处理 (${openIssues.length})</button>
              <button class="${issueFilter === "all" ? "active" : ""}" data-action="filter-issues" data-filter="all">全部 (${list.length})</button>
            </div>
            <datalist id="assignee-options">${assigneeOptions.map((name) => `<option value="${escapeHtml(name)}"></option>`).join("")}</datalist>
            <div class="issue-list acceptance-list">
              ${panelIssues.length ? panelIssues.map((issue) => renderIssueItem(issue, assigneeOptions)).join("") : `<div class="issue-clear">${issueFilter === "open" ? "✓ 所有问题都已处理，可以导出" : "✓ 全章检查通过"}</div>`}
            </div>
          </section>

          <section class="version-card">
            <div class="section-heading"><div><span class="eyebrow">Version compare</span><h2>版本比较</h2></div><sl-badge>${project.versions.length} 版</sl-badge></div>
            ${project.versions.length ? `
              <sl-select id="version-select" size="small" value="${version?.id ?? ""}">${project.versions.map((item) => `<sl-option value="${item.id}">${escapeHtml(item.label)} · ${new Date(item.createdAt).toLocaleTimeString()}</sl-option>`).join("")}</sl-select>
              <div class="version-diff">${version ? renderVersionDiff(version, active) : ""}</div>
            ` : `<div class="empty-note">保存版本后，可比较改写前后的无障碍文本。</div>`}
          </section>
        </aside>
      </div>

      <footer class="statusbar"><span>最近操作：${escapeHtml(document.documentElement.dataset.lastAction || "示例章节已载入")}</span><span>${project.blocks.length} 个内容块 · ${openIssues.length} 个未处理问题（共 ${list.length}）</span></footer>
    </div>

    <sl-dialog label="导出被拦截：发布前验收未完成" ${showExportBlocker ? "open" : ""} data-dialog="export-blocker">
      ${renderExportBlocker(openIssues)}
      <sl-button slot="footer" variant="primary" data-action="close-export-blocker">返回处理</sl-button>
    </sl-dialog>

    <sl-dialog label="全书术语表" ${showGlossary ? "open" : ""} data-dialog="glossary">
      <div class="glossary-editor">
        ${project.glossary.map((term) => `<div class="term-row"><div><b>${escapeHtml(term.source)}</b><sl-input size="small" value="${escapeHtml(term.preferred)}" data-term-id="${term.id}"></sl-input><small>${escapeHtml(term.note)}</small></div><sl-button size="small" variant="danger" outline data-action="remove-term" data-term-id="${term.id}">删除</sl-button></div>`).join("")}
      </div>
      <div class="term-add"><sl-input id="new-term-source" placeholder="原文术语"></sl-input><sl-input id="new-term-preferred" placeholder="统一表达"></sl-input><sl-button variant="primary" data-action="add-term">添加术语</sl-button></div>
      <sl-button slot="footer" variant="primary" data-action="close-glossary">完成</sl-button>
    </sl-dialog>`;

  wireLiveFields();
}

function renderIssueStatusBadge(issue: AccessibilityIssue) {
  const acceptance = ensureAcceptance(project, issue.id);
  if (acceptance.status === "resolved") return `<sl-badge variant="success" class="accept-badge">✓ 已解决</sl-badge>`;
  if (acceptance.status === "waived") return `<sl-badge variant="neutral" class="accept-badge">已带理由放行</sl-badge>`;
  return `<sl-badge variant="warning" class="accept-badge">待处理</sl-badge>`;
}

function renderIssueAcceptance(issue: AccessibilityIssue, assigneeOptions: string[], scope: string) {
  const acceptance = ensureAcceptance(project, issue.id);
  if (acceptance.status !== "open") {
    const closed = acceptance.status === "resolved";
    const reasonText = closed ? acceptance.note : acceptance.waiveReason;
    return `
      <div class="acceptance-box ${acceptance.status}">
        <div class="acceptance-meta">
          <b>${closed ? "✓ 已标记解决" : "已带理由放行"}</b>
          <span>处理人：${escapeHtml(acceptance.assignee || "未指派")}</span>
          <span>${new Date(acceptance.resolvedAt).toLocaleString()}</span>
        </div>
        <p class="acceptance-note">${closed ? "处理说明" : "放行理由"}：${escapeHtml(reasonText)}</p>
        <sl-button size="small" variant="default" outline data-action="reopen-issue" data-issue-id="${issue.id}">重新打开</sl-button>
      </div>`;
  }
  const errorBlocked = issue.severity === "error";
  const errorText = acceptance.reopenedAt ? "内容在上次处理后有改动，请复核后重新处理。" : "";
  return `
    <div class="acceptance-box open">
      ${errorText ? `<p class="reopen-hint">⟳ ${escapeHtml(errorText)}</p>` : ""}
      <div class="acceptance-assignee">
        <label for="${scope}-assignee-${issue.id}">指派给</label>
        <sl-input id="${scope}-assignee-${issue.id}" size="small" list="assignee-options" placeholder="输入处理人姓名" value="${escapeHtml(acceptance.assignee)}" data-issue-assignee="${issue.id}"></sl-input>
      </div>
      <sl-textarea size="small" rows="2" placeholder="${errorBlocked ? "处理说明：修复后填写做了什么" : "放行需写明理由；已修复可写处理说明"}" value="${escapeHtml(acceptance.note)}" data-issue-note="${issue.id}"></sl-textarea>
      <div class="acceptance-actions">
        <sl-button size="small" variant="success" data-action="resolve-issue" data-issue-id="${issue.id}">标记解决</sl-button>
        <sl-button size="small" variant="${errorBlocked ? "default" : "warning"}" outline ${errorBlocked ? "disabled" : ""} data-action="waive-issue" data-issue-id="${issue.id}">带理由放行</sl-button>
        ${errorBlocked ? `<small class="blocked-hint">必须修复项不允许放行</small>` : `<small class="blocked-hint">建议/提醒项可放行，但必须写明理由</small>`}
      </div>
    </div>`;
}

function renderIssueItem(issue: AccessibilityIssue, assigneeOptions: string[]) {
  const acceptance = ensureAcceptance(project, issue.id);
  const blockIndex = project.blocks.findIndex((block) => block.id === issue.blockId) + 1;
  return `<div class="issue-entry ${issue.severity} ${acceptance.status} ${issue.id === activeIssueId ? "active" : ""}">
    <button class="issue-head" data-action="jump-issue" data-issue-id="${issue.id}" data-block-id="${issue.blockId}">
      <span>${severityLabel(issue.severity)}</span>
      <b>${escapeHtml(issue.title)}</b>
      <small>段 ${blockIndex} · ${escapeHtml(issue.suggestion)}</small>
      ${renderIssueStatusBadge(issue)}
    </button>
    <div class="issue-entry-body">${renderIssueAcceptance(issue, assigneeOptions, "list")}</div>
  </div>`;
}

function renderExportBlocker(openIssues: AccessibilityIssue[]) {
  const openErrors = openIssues.filter((issue) => issue.severity === "error");
  const openOthers = openIssues.filter((issue) => issue.severity !== "error");
  const unassigned = openIssues.filter((issue) => !ensureAcceptance(project, issue.id).assignee.trim());
  return `<div class="export-blocker">
    <p>还有 <b>${openIssues.length}</b> 个问题没有处理完，不能导出无障碍 HTML：</p>
    <ul>
      <li class="error"><b>${openErrors.length}</b> 个必须修复项未标记解决（必须修复项不允许放行）。</li>
      <li class="warning"><b>${openOthers.length}</b> 个建议/提醒项尚未解决或带理由放行。</li>
      ${unassigned.length ? `<li class="info"><b>${unassigned.length}</b> 个问题还没有指派处理人。</li>` : ""}
    </ul>
    ${openErrors.length ? `<div class="blocker-list"><b>必须修复：</b>${openErrors.slice(0, 5).map((issue) => `<button class="blocker-jump" data-action="jump-blocker-issue" data-issue-id="${issue.id}" data-block-id="${issue.blockId}">${escapeHtml(issue.title)}<small>段 ${project.blocks.findIndex((block) => block.id === issue.blockId) + 1}</small></button>`).join("")}</div>` : ""}
    ${!openErrors.length && openOthers.length ? `<p class="blocker-ok">必须修复项已全部解决；建议项请修复后标记解决，或在“带理由放行”中写明理由。</p>` : ""}
  </div>`;
}

function renderSourceEditor(block: ContentBlock) {
  if (block.type === "image") {
    return `<div class="image-source"><img src="${escapeHtml(block.imageSrc ?? "")}" alt="" /><div><b>图注</b><p>${escapeHtml(block.text)}</p><b>现有替代文本</b><p>${escapeHtml(block.imageAlt || "（空）")}</p></div></div>
      <sl-input id="source-${block.id}" data-field="source" label="图注" value="${escapeHtml(block.text)}"></sl-input>
      <sl-input id="image-alt-${block.id}" data-field="image-alt" label="替代文本" value="${escapeHtml(block.imageAlt ?? "")}" help-text="描述图片传达的信息，不写“图片”二字。"></sl-input>`;
  }
  if (block.type === "link") {
    return `<sl-input id="source-${block.id}" data-field="source" label="原链接文案" value="${escapeHtml(block.text)}"></sl-input><sl-input id="link-href-${block.id}" data-field="link-href" label="链接地址" value="${escapeHtml(block.linkHref ?? "")}"></sl-input>`;
  }
  if (block.type === "heading") {
    return `<div class="heading-edit"><sl-select id="heading-level-${block.id}" data-field="heading-level" label="标题层级" value="${String(block.headingLevel ?? 2)}"><sl-option value="1">H1</sl-option><sl-option value="2">H2</sl-option><sl-option value="3">H3</sl-option><sl-option value="4">H4</sl-option></sl-select><sl-input id="source-${block.id}" data-field="source" label="标题文本" value="${escapeHtml(block.text)}"></sl-input></div>`;
  }
  return `<sl-textarea id="source-${block.id}" data-field="source" rows="4" value="${escapeHtml(block.text)}"></sl-textarea>`;
}

function renderAccessibleEditor(block: ContentBlock) {
  if (block.type === "image") {
    return `<sl-textarea id="accessible-${block.id}" data-field="accessible" rows="3" label="图片替代文本" value="${escapeHtml(block.imageAlt || block.accessibleText)}" help-text="读屏软件会朗读这里的内容。"></sl-textarea>`;
  }
  return `<sl-textarea id="accessible-${block.id}" data-field="accessible" rows="6" value="${escapeHtml(block.accessibleText)}"></sl-textarea>`;
}

function renderPreview() {
  return project.blocks.map((block, index) => {
    const content = escapeHtml(block.accessibleText || block.text);
    if (block.type === "heading") {
      const tag = `h${Math.min(6, Math.max(1, block.headingLevel ?? 2))}`;
      return `<${tag} class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span>${content}</${tag}>`;
    }
    if (block.type === "image") {
      return `<figure class="${block.id === activeBlockId ? "active-block" : ""}"><img src="${escapeHtml(block.imageSrc ?? "")}" alt="${escapeHtml(block.imageAlt || block.accessibleText)}"><figcaption><span class="order-marker">${index + 1}</span>${escapeHtml(block.text)}</figcaption></figure>`;
    }
    if (block.type === "link") {
      return `<p class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span><a href="${escapeHtml(block.linkHref ?? "#")}" onclick="return false">${content}</a><span class="link-role">链接</span></p>`;
    }
    return `<p class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span>${content}</p>`;
  }).join("");
}

function renderVersionDiff(version: VersionSnapshot, current: ContentBlock) {
  const oldBlock = version.blocks.find((block) => block.id === current.id);
  if (!oldBlock) return `<div class="empty-note">当前内容块不在该版本中。</div>`;
  return `<div class="diff-column"><span>旧版</span><p>${escapeHtml(oldBlock.accessibleText || oldBlock.text)}</p></div><div class="diff-column current"><span>当前</span><p>${escapeHtml(current.accessibleText || current.text)}</p></div>`;
}

function wireLiveFields() {
  app.querySelectorAll<HTMLElement>("sl-input[data-field], sl-textarea[data-field], sl-select[data-field]").forEach((element) => {
    element.addEventListener("sl-input", () => {
      const value = (element as HTMLElement & { value: string }).value;
      updateActiveBlock((block) => {
        const field = element.dataset.field;
        if (field === "source") block.text = value;
        if (field === "accessible") {
          block.accessibleText = value;
          if (block.type === "image") block.imageAlt = value;
        }
        if (field === "image-alt") {
          block.imageAlt = value;
          block.accessibleText = value;
        }
        if (field === "link-href") block.linkHref = value;
        if (field === "reason") block.changeReason = value;
        block.reviewStatus = "pending";
      }, "编辑无障碍文本", false);
    });
    element.addEventListener("sl-change", () => render());
  });
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "undo") undo();
  if (action === "redo") redo();
  if (action === "select-block") {
    activeBlockId = target.dataset.blockId ?? activeBlockId;
    activeIssueId = "";
    render();
  }
  if (action === "jump-issue") {
    activeIssueId = target.dataset.issueId ?? "";
    activeBlockId = target.dataset.blockId ?? activeBlockId;
    render();
    requestAnimationFrame(() => app.querySelector<HTMLElement>(".editor-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  if (action === "filter-issues") {
    issueFilter = target.dataset.filter === "all" ? "all" : "open";
    render();
  }
  if (action === "resolve-issue" || action === "waive-issue") {
    const issueId = target.dataset.issueId ?? "";
    const issue = issues().find((item) => item.id === issueId);
    if (issue) closeIssue(issue, action === "waive-issue");
  }
  if (action === "reopen-issue") {
    const issueId = target.dataset.issueId ?? "";
    commit("重新打开问题", (draft) => {
      const acceptance = draft.issueAcceptance[issueId];
      if (acceptance) draft.issueAcceptance[issueId] = reopenAcceptance(acceptance);
    });
  }
  if (action === "close-export-blocker") { showExportBlocker = false; render(); }
  if (action === "jump-blocker-issue") {
    activeIssueId = target.dataset.issueId ?? "";
    activeBlockId = target.dataset.blockId ?? activeBlockId;
    issueFilter = "open";
    showExportBlocker = false;
    render();
    requestAnimationFrame(() => app.querySelector<HTMLElement>(".acceptance-panel")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }
  if (action === "generate") {
    const block = activeBlock();
    const suggestion = block.type === "link"
      ? "打开水循环互动实验"
      : simplifyText(block.type === "image" ? block.imageAlt || block.text : block.text, project.glossary);
    updateActiveBlock((current) => {
      if (current.type === "image") current.imageAlt = suggestion;
      current.accessibleText = suggestion;
      current.changeReason ||= "拆分长句并替换复杂表达，保留原有知识信息。";
      current.reviewStatus = "pending";
    }, "生成易读版本");
  }
  if (action === "approve") updateActiveBlock((block) => { block.reviewStatus = "approved"; }, "审核通过");
  if (action === "needs-work") updateActiveBlock((block) => { block.reviewStatus = "needs-work"; }, "标记需修改");
  if (action === "add-comment") {
    const input = app.querySelector<HTMLElement & { value: string }>("#new-comment");
    const body = input?.value.trim();
    if (body) updateActiveBlock((block) => {
      block.comments.unshift({ id: uid("comment"), author: "当前编辑", body, createdAt: new Date().toISOString(), resolved: false, replies: [] });
    }, "添加批注");
  }
  if (action === "reply") {
    const commentId = target.dataset.commentId ?? "";
    const input = app.querySelector<HTMLElement & { value: string }>(`#reply-${CSS.escape(commentId)}`);
    const body = input?.value.trim();
    if (body) updateActiveBlock((block) => {
      block.comments.find((comment) => comment.id === commentId)?.replies.push({ id: uid("reply"), author: "当前编辑", body, createdAt: new Date().toISOString() });
    }, "回复批注");
  }
  if (action === "resolve-comment") {
    const commentId = target.dataset.commentId ?? "";
    updateActiveBlock((block) => {
      const comment = block.comments.find((item) => item.id === commentId);
      if (comment) comment.resolved = !comment.resolved;
    }, "更新批注状态");
  }
  if (action === "preview-normal") { previewMode = "normal"; render(); }
  if (action === "preview-assisted") { previewMode = "assisted"; render(); }
  if (action === "glossary") { showGlossary = true; render(); }
  if (action === "close-glossary") { showGlossary = false; render(); }
  if (action === "add-term") {
    const source = app.querySelector<HTMLElement & { value: string }>("#new-term-source");
    const preferred = app.querySelector<HTMLElement & { value: string }>("#new-term-preferred");
    if (source?.value.trim() && preferred?.value.trim()) {
      commit("添加术语", (draft) => { draft.glossary.push({ id: uid("term"), source: source.value.trim(), preferred: preferred.value.trim(), note: "编辑新增术语" }); });
    }
  }
  if (action === "remove-term") {
    const termId = target.dataset.termId;
    commit("删除术语", (draft) => { draft.glossary = draft.glossary.filter((term) => term.id !== termId); });
  }
  if (action === "save-version") {
    const versionId = uid("version");
    commit("保存版本快照", (draft) => {
      draft.versions.unshift({ id: versionId, label: `版本 ${draft.versions.length + 1}`, createdAt: new Date().toISOString(), blocks: structuredClone(draft.blocks), glossary: structuredClone(draft.glossary) });
      draft.versions = draft.versions.slice(0, 10);
    });
    selectedVersionId = versionId;
    render();
  }
  if (action === "export") {
    const open = issues().filter((issue) => ensureAcceptance(project, issue.id).status === "open");
    if (open.length) {
      showExportBlocker = true;
      issueFilter = "open";
      document.documentElement.dataset.lastAction = "导出被拦截：仍有未处理问题";
      render();
      return;
    }
    download(`${project.title}-无障碍版.html`, exportHtml(project));
    document.documentElement.dataset.lastAction = "已导出无障碍 HTML";
    render();
  }
  if (action === "import") app.querySelector<HTMLInputElement>("#chapter-file")?.click();
});

app.addEventListener("sl-change", (event) => {
  const element = event.target as HTMLElement;
  if (element.id === "chapter-file") return;
  if (element.hasAttribute("data-issue-assignee")) {
    const issueId = element.getAttribute("data-issue-assignee") ?? "";
    syncIssueDraft(issueId);
    return;
  }
  if (element.id.startsWith("heading-level-")) {
    const level = Number((element as HTMLElement & { value: string }).value);
    updateActiveBlock((block) => { block.headingLevel = level; block.reviewStatus = "pending"; }, "修改标题层级");
  }
  if (element.id === "version-select") {
    selectedVersionId = (element as HTMLElement & { value: string }).value;
    render();
  }
  if (element.matches("[data-term-id]")) {
    const termId = element.dataset.termId;
    const value = (element as HTMLElement & { value: string }).value;
    commit("修改术语表", (draft) => { const term = draft.glossary.find((item) => item.id === termId); if (term) term.preferred = value; });
  }
});

app.addEventListener("change", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id !== "chapter-file" || !input.files?.[0]) return;
  void input.files[0].text().then((text) => {
    commit("导入章节文本", (draft) => {
      draft.blocks = parseImportedChapter(text);
      activeBlockId = draft.blocks[0]?.id ?? "";
      activeIssueId = "";
    });
  });
});

app.addEventListener("input", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id === "project-title") {
    project.title = input.value;
    saveSoon();
  }
});

app.addEventListener("sl-input", (event) => {
  const element = event.target as HTMLElement;
  if (element.hasAttribute("data-issue-note")) {
    const issueId = element.getAttribute("data-issue-note") ?? "";
    syncIssueDraft(issueId);
    element.removeAttribute("data-invalid");
  }
});

window.addEventListener("online", render);
window.addEventListener("offline", render);
window.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement;
  if (target.matches("input, textarea, sl-input, sl-textarea, [contenteditable='true']")) return;
  const command = event.metaKey || event.ctrlKey;
  if (command && event.key.toLowerCase() === "z") {
    event.preventDefault();
    event.shiftKey ? redo() : undo();
    return;
  }
  if (command && event.key.toLowerCase() === "s") {
    event.preventDefault();
    const versionId = uid("version");
    commit("键盘保存版本", (draft) => { draft.versions.unshift({ id: versionId, label: `版本 ${draft.versions.length + 1}`, createdAt: new Date().toISOString(), blocks: structuredClone(draft.blocks), glossary: structuredClone(draft.glossary) }); });
    selectedVersionId = versionId;
    return;
  }
  if (event.key.toLowerCase() === "j" || event.key.toLowerCase() === "k") {
    const all = issues();
    const navigable = all.filter((issue) => ensureAcceptance(project, issue.id).status === "open");
    const list = navigable.length ? navigable : all;
    if (!list.length) return;
    const current = Math.max(0, list.findIndex((issue) => issue.id === activeIssueId));
    const next = (current + (event.key.toLowerCase() === "j" ? 1 : -1) + list.length) % list.length;
    activeIssueId = list[next].id;
    activeBlockId = list[next].blockId;
    render();
  }
  if (event.key.toLowerCase() === "e") {
    const button = app.querySelector<HTMLElement>('[data-action="generate"]');
    button?.click();
  }
  if (event.key === "1") { previewMode = "normal"; render(); }
  if (event.key === "2") { previewMode = "assisted"; render(); }
});

render();
