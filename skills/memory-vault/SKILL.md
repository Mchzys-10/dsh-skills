---
name: memory-vault
description: 读写本地 Markdown 记忆库（Obsidian vault），把稳定事实、项目进展、决策和可复用结论沉淀成可检索的笔记。当用户说「记一下 / 记住这个 / 我的偏好是 / 上次怎么做的 / 记忆库 / 帮我记到笔记里」时使用。
---

# 记忆库读写

一个纯 Markdown 的本地 vault，同时给人（Obsidian）和 Agent 用。没有数据库、没有服务。

## 定位 vault

按优先级：

1. 用户本次明确给出的路径
2. 环境变量 `MEMORY_VAULT`
3. 当前工作区下的 `memory-vault/`
4. 都没有 → 先问用户，不要凭空创建

确认是 vault 的标志：根目录有 `HOME.md` 和 `99-Agent/AGENTS.md`。

## 会话开始：按需读，不通读

1. `HOME.md` —— 库里有什么
2. `10-Profile/用户画像.md`、`10-Profile/工作环境.md` —— 偏好与硬约束
3. `99-Agent/记忆索引.md` —— 按任务挑需要的笔记再打开

## 写在哪

| 触发 | 目标 | 规则 |
| --- | --- | --- |
| 稳定个人信息 / 偏好 | `10-Profile/` | 先提议再写，不确定标「待确认」 |
| 项目进展 | `20-Projects/<项目>.md` | 改「现状」「待办」，不追加时间流水 |
| 做过的取舍 | `30-Decisions/YYYY-MM-DD-标题.md` | 写背景 / 决定 / 代价 |
| 可复用结论、排错过程 | `40-Knowledge/` | 标题即结论，命令完整可复制 |
| 当天流水 | `50-Journal/YYYY-MM-DD.md` | 追加不覆盖 |
| 来不及归类 | `00-Inbox/` | 允许粗糙，必须带日期 |

## 格式硬要求

```markdown
---
type: profile | project | decision | knowledge | journal
updated: YYYY-MM-DD
tags: [knowledge]
---

# 标题（就是结论）

正文；内部链接用 [[另一篇笔记]]。
```

- 每篇必须有 frontmatter，`type` / `updated` / `tags` 三件套
- 链接写 `[[文件名]]`（不带 `.md`、不带路径），指向不存在的文件就是坏链
- **新增或改名后同步更新 `99-Agent/记忆索引.md`**，否则下次会话找不到
- 一条笔记一个主题；同一事实只存一处，别处用链接

## 检索

```bash
# 按标签
rg -l "^tags:.*knowledge" "<vault>" -g "*.md"
# 全文
rg -i "关键词" "<vault>" -g "*.md"
# 最近改动
Get-ChildItem "<vault>" -Recurse -Filter *.md | Sort-Object LastWriteTime -Descending | Select-Object -First 10
```

## 禁止

- 不写密钥、token、密码
- 不覆盖用户手写段落（改写时把原文保留到「历史」小节）
- 不把整段对话粘进库，要提炼成一条结论
- 不在 vault 里放二进制或 >1 MiB 的文件

## 冲突处理

新事实与旧记录矛盾时：旧笔记 frontmatter 加 `status: superseded` 并链接到新笔记，不直接删除。

## 检查清单

- [ ] 写对了目录（profile / project / decision / knowledge / journal）
- [ ] frontmatter 三件套齐全，日期是 `YYYY-MM-DD`
- [ ] 双链目标存在，没有坏链
- [ ] `记忆索引.md` 已同步
- [ ] 没有敏感信息
