---
name: changelog-writer
description: 根据 git 提交历史生成或更新 Keep a Changelog 格式的 CHANGELOG.md，并按 semver 建议版本号。当用户说「写更新日志 / 生成 CHANGELOG / 发版说明 / release notes」时使用。
---

# CHANGELOG 生成器

把 `git log` 变成人能读的版本记录，格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 semver。

## 何时使用

- 准备发版，需要 release notes
- 仓库还没有 CHANGELOG，或上次更新停在几个版本前
- 用户问「这次改了什么，该升哪个版本号」

## 步骤

### 1. 取提交范围

```bash
# 上次发布之后的所有提交（有 tag 时最准）
git log --oneline --no-merges "$(git describe --tags --abbrev=0)..HEAD"

# 没有 tag 时，按时间取
git log --oneline --no-merges --since="2026-01-01"
```

带文件信息辅助分类：

```bash
git log --no-merges --pretty=format:'%h %s' --name-only
```

### 2. 分类（映射到固定小标题）

| 提交信号 | CHANGELOG 分类 |
| --- | --- |
| `feat:` 新功能、`add` | Added |
| `fix:` 修 bug | Fixed |
| `perf:` 性能、`refactor:` 重构不改行为 | Changed |
| `deprecate:` 即将废弃 | Deprecated |
| `remove:` 删除功能 | Removed |
| `security:` 安全修复 | Security |

**只写用户能感知的变化**：`chore:`、`ci:`、`test:`、格式化提交不进 CHANGELOG。

### 3. 建议版本号（semver）

- 删除/重命名公开接口、不兼容改动 → **MAJOR**
- 新增能力、接口兼容 → **MINOR**
- 只修 bug / 优化体验 → **PATCH**

### 4. 写入 CHANGELOG.md

新版本条目插在文件最上方（`## [Unreleased]` 之后）：

```markdown
## [1.2.0] - 2026-10-26

### Added
- 支持从 GitHub 仓库订阅技能（#12）

### Fixed
- 修复 Windows 下中文目录名导致技能加载失败

### Changed
- 校验脚本改为纯 Node 实现，去掉外部依赖
```

顶部保留约定段落：

```markdown
# Changelog

本文件记录所有值得注意的变更。
格式基于 Keep a Changelog，版本号遵循语义化版本。
```

### 5. 打 tag（用户确认后再执行）

```bash
git tag -a v1.2.0 -m "v1.2.0"
git push origin v1.2.0
```

## 写作要求

- 每条一句话，**动词开头**，说清「改了什么 + 影响谁」
- 带 PR/issue 号：`- 修复登录过期后白屏（#42）`
- 同一版本内按 Added / Changed / Fixed / Removed / Security 排序，空分类不写
- 日期用 `YYYY-MM-DD`，不要写「今天」

## 检查清单

- [ ] 提交范围正确（没漏 tag 之后的提交）
- [ ] 只有用户可感知的变更
- [ ] 分类与 semver 建议自洽
- [ ] 日期、版本号、PR 号与仓库实际一致
- [ ] 新条目插在 `## [Unreleased]` 之后，未打乱历史
