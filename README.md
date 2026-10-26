# DSH Skills

个人 Agent Skills 合集。每个技能是一个目录 + 一个 `SKILL.md`，遵循 Agent Skills 通用规范，可直接在 DeepSeek Harness（DSH）的「技能 → 发现技能」里订阅安装。

## 在 DSH 里安装

1. 打开 DSH 侧边栏 **技能 → 发现技能 → GitHub 仓库**
2. 点右上角 **+（添加仓库）**，填 `Mchzys-10/dsh-skills`（或完整地址 `https://github.com/Mchzys-10/dsh-skills`）
3. 点 **刷新**，面板会整仓扫描出下面这些技能
4. 选择技能 → 安装，写入目标二选一：
   - **用户目录**：`~/.agents/skills`（全局可用）
   - **项目目录**：`<项目根>/.dsh/skills`（只在该工作区可用）

也可以手动克隆后把想要的技能目录整个拷进 `~/.agents/skills/`。

## 技能列表

| 技能 | 用途 |
| --- | --- |
| [`github-repo-bootstrap`](skills/github-repo-bootstrap/SKILL.md) | 用 `gh` + `git` 从零建一个规范的公开/私有仓库：README、LICENSE、.gitignore、首次提交、推送、验证 |
| [`skill-forge`](skills/skill-forge/SKILL.md) | 从零写一个合规的 `SKILL.md`：命名规则、frontmatter、正文结构、自检清单 |
| [`changelog-writer`](skills/changelog-writer/SKILL.md) | 根据 `git log` 生成 / 更新 Keep a Changelog 格式的 CHANGELOG |
| [`memory-vault`](skills/memory-vault/SKILL.md) | 读写本地 Markdown 记忆库（Obsidian vault）：稳定事实、项目进展、决策、可复用结论 |

## 目录结构

```
dsh-skills/
├── skills/
│   └── <skill-name>/          # 目录名 = frontmatter 里的 name
│       ├── SKILL.md           # 必需：frontmatter + 正文说明
│       └── references/        # 可选：长文档、示例、脚本
├── scripts/validate.mjs       # 提交前的规范校验
├── templates/SKILL.md.example # 新建技能时复制这个模板
└── .github/workflows/validate.yml
```

## 编写规范

- **目录名必须等于 `name`**：`skills/my-skill/SKILL.md` → `name: my-skill`
- **`name` 只允许** 小写字母、数字、连字符（kebab-case），不超过 100 字符，且不能是 `con` / `nul` / `com1` 这类 Windows 保留名
- **`description` 必填**：一句话说清「做什么 + 什么时候该用它」，建议把触发词也写进去
- 正文推荐顺序：**何时使用 → 步骤 → 示例 → 检查清单**；能跑的命令写完整，别写「按需处理」这类空话
- 提交前跑一遍校验：

```bash
node scripts/validate.mjs
```

校验不通过的技能在 DSH 里会显示为「无效」，不会被安装。

## 新建一个技能

```bash
mkdir -p skills/my-skill
cp templates/SKILL.md.example skills/my-skill/SKILL.md
# 改 name / description / 正文
node scripts/validate.mjs
git add -A && git commit -m "feat: add my-skill" && git push
```

## License

[MIT](LICENSE)
