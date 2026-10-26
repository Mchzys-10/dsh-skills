---
name: skill-forge
description: 从零编写或修订一个合规的 Agent Skill（SKILL.md），包括命名规则、frontmatter、正文结构与本机校验。当用户说「写一个技能 / 新建 skill / 这个 SKILL.md 为什么无效 / 技能不触发」时使用。
---

# Skill 编写工坊

产出一个「能被宿主正确加载、能被模型正确触发」的 `SKILL.md`。

## 何时使用

- 从零新建一个技能
- 现有技能**不触发**、**显示无效**、被截断或读不到
- 想把一段反复使用的流程沉淀成可复用技能

## 硬性规则（违反就会被判无效）

1. **目录名 = `name`**：`skills/my-skill/SKILL.md` ↔ `name: my-skill`
2. `name` 只能是小写字母、数字、连字符：正则 `^[a-z0-9]+(-[a-z0-9]+)*$`，长度 ≤ 100
3. `name` 不能是 Windows 保留名：`con` `prn` `aux` `nul` `com1`~`com9` `lpt1`~`lpt9`
4. `description` **必填且非空**，它决定模型什么时候用这个技能
5. 必须有 YAML frontmatter，正文不能为空

## frontmatter 模板

```yaml
---
name: my-skill
description: 一句话说清「做什么」，并把触发词写进去。当用户说「A / B / C」时使用。
---
```

可选字段（宿主不强制，但社区常用）：`version`、`user-invocable: true`。

## description 写法

描述是唯一的路由信号，写成「功能 + 触发场景」两段式：

```yaml
# 好
description: 用 pnpm 给前端项目升级依赖并跑通测试。当用户说「升级依赖 / 更新包 / dependency upgrade」时使用。

# 差（没有触发词，模型不知道何时用）
description: 依赖管理工具。
```

把用户真实会说的话原样列进去（中英文都列），比抽象概括有效得多。

## 正文结构（推荐顺序）

```markdown
# 技能标题

一句话说明这个技能产出什么。

## 何时使用
- 场景 1
- 场景 2
- 不适用：……

## 步骤
1. 先做什么，命令写全
2. 再做什么，说明判断条件

## 示例
（真实输入 → 真实输出）

## 检查清单
- [ ] 结果已验证，不是「应该可以」
```

原则：

- **命令要能直接复制运行**，不要写「按需调整脚本」
- **判断条件要具体**：写「HTTP 401 就重新登录」，不写「出错时处理」
- 长文档、大段参考资料放 `references/`，正文只留导航和关键结论
- 正文控制在 300~500 行内，太长会稀释注意力

## 本机校验

```bash
node scripts/validate.mjs          # 校验本仓库全部技能
node scripts/validate.mjs --json   # 机器可读输出
```

在 DSH 里，未通过校验的技能会显示为「无效」，不会出现在可安装列表里。

手动快速自检：

```bash
head -5 skills/my-skill/SKILL.md   # frontmatter 是否存在
```

## 常见坑

- **目录名和 `name` 不一致**：最常见的无效原因
- **description 缺失或只写了一句话的功能**：技能永远不触发
- **frontmatter 用了 tab 缩进**：YAML 只认空格
- **中文目录名**：可以，但必须在 frontmatter 里显式声明英文 `name`
- **把技能塞进项目根 `skills/`**：部分宿主不扫描项目根，只扫 `.dsh/skills`

## 检查清单

- [ ] 目录名 = `name`，kebab-case，非保留名
- [ ] `description` 含真实触发词
- [ ] 正文有「何时使用 / 步骤 / 检查清单」
- [ ] 命令可直接复制执行
- [ ] `node scripts/validate.mjs` 通过
