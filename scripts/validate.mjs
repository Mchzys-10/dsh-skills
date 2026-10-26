#!/usr/bin/env node
// 校验 skills/*/SKILL.md 是否符合 Agent Skills 规范。
// 用法: node scripts/validate.mjs [--json]
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: null, body: text };
  const data = {};
  const lines = match[1].split(/\r?\n/);
  let current = null;
  for (const line of lines) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (/^\s/.test(line) && current) {
      if (data[current] !== undefined) data[current] = `${data[current]} ${line.trim()}`;
      continue;
    }
    const idx = line.indexOf(":");
    if (idx < 1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value === "|" || value === ">" || value === "|-" || value === ">-") value = "";
    value = value.replace(/^["']|["']$/g, "");
    data[key] = value;
    current = key;
  }
  return { data, body: text.slice(match[0].length) };
}

function listSkills() {
  let entries = [];
  try {
    entries = readdirSync(skillsDir);
  } catch {
    return [];
  }
  return entries
    .filter((name) => {
      try {
        return statSync(join(skillsDir, name)).isDirectory();
      } catch {
        return false;
      }
    })
    .sort();
}

const results = [];
for (const dir of listSkills()) {
  const file = join(skillsDir, dir, "SKILL.md");
  const errors = [];
  const warnings = [];
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    results.push({ dir, name: null, errors: ["缺少 SKILL.md"], warnings });
    continue;
  }
  const { data, body } = parseFrontmatter(text);
  if (!data) {
    results.push({ dir, name: null, errors: ["缺少 YAML frontmatter（文件必须以 --- 开头）"], warnings });
    continue;
  }
  const name = (data.name || "").trim();
  const description = (data.description || "").trim();

  if (!name) errors.push("frontmatter 缺少 name");
  else {
    if (!NAME_RE.test(name)) errors.push(`name "${name}" 不是 kebab-case（只允许小写字母/数字/连字符）`);
    if (name.length > 100) errors.push("name 超过 100 字符");
    if (RESERVED.test(name)) errors.push(`name "${name}" 是 Windows 保留名`);
    if (name !== dir) errors.push(`name "${name}" 与目录名 "${dir}" 不一致`);
  }
  if (!description) errors.push("frontmatter 缺少 description");
  else if (description.length < 10) errors.push("description 太短，写清「做什么 + 触发场景」");
  if (!body.trim()) errors.push("正文为空");
  else {
    if (!/^##\s+/m.test(body)) warnings.push("正文没有二级标题结构");
    if (!/检查清单/.test(body)) warnings.push("缺少「检查清单」小节");
  }

  results.push({ dir, name: name || null, errors, warnings });
}

const failed = results.filter((r) => r.errors.length > 0);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ ok: failed.length === 0, results }, null, 2));
} else {
  if (results.length === 0) {
    console.log("没有找到任何技能（skills/<name>/SKILL.md）");
  }
  for (const r of results) {
    const mark = r.errors.length ? "✗" : "✓";
    console.log(`${mark} ${r.dir}`);
    for (const e of r.errors) console.log(`   [error] ${e}`);
    for (const w of r.warnings) console.log(`   [warn ] ${w}`);
  }
  console.log("");
  console.log(`共 ${results.length} 个技能，${results.length - failed.length} 通过，${failed.length} 失败`);
}

process.exit(failed.length === 0 ? 0 : 1);
