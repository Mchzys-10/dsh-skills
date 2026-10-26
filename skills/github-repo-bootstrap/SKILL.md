---
name: github-repo-bootstrap
description: 用 gh + git 从零创建一个规范的 GitHub 仓库（骨架、首次提交、推送、验证）。当用户说「帮我建一个 GitHub 库 / 新建仓库 / 初始化项目并推到 GitHub / 建个库放技能」时使用。
---

# GitHub 仓库脚手架

从零到「远端仓库可见 + 本地已关联 + 首个提交已推送」，一次跑完并验证。

## 何时使用

- 用户要在自己的 GitHub 账号下新建一个仓库（公开或私有）
- 已有本地文件，需要「初始化成 git 仓库并推上 GitHub」
- 需要给技能仓库 / 文档仓库 / 代码仓库配一套最小可用骨架

不适用：只改已有仓库、只建本地 git 仓库（不需要远端）。

## 前置检查（三条命令，失败就先修）

```bash
gh auth status                     # 必须处于 Logged in
gh api user --jq .login            # 确认目标账号
git config --global user.name; git config --global user.email
```

`git config` 为空时先设置，否则首个提交会失败：

```bash
git config --global user.name "你的名字"
git config --global user.email "you@example.com"
```

## 步骤

### 1. 定参数

| 参数 | 取值建议 |
| --- | --- |
| 仓库名 | 小写 + 连字符，`dsh-skills`、`my-tool`；不要中文和空格 |
| 可见性 | 需要被公开订阅/分享用 `--public`；敏感内容 `--private` |
| 描述 | 一句话，说明「是什么 + 给谁用」 |

先确认名字没被占用：

```bash
gh repo view OWNER/REPO 2>&1 | head -3   # 报 Could not resolve 说明可用
```

### 2. 建本地骨架

```bash
mkdir REPO && cd REPO
git init -b main
```

至少放这四个文件，缺一个仓库就显得半成品：

- `README.md`：项目名、一句话简介、安装/使用、目录结构、License 段
- `LICENSE`：一般用 MIT（`gh repo create --license mit` 也能自动生成）
- `.gitignore`：按语言 + 编辑器垃圾文件
- 业务目录 / 源码入口

### 3. 首次提交

```bash
git add -A
git commit -m "chore: initial scaffold"
```

### 4. 建远端并推送

```bash
gh repo create OWNER/REPO --public --description "一句话描述" --source . --remote origin --push
```

`--source . --push` 会把当前目录直接关联并推送，省掉 `git remote add` + `git push -u`。

### 5. 验证（必须做，不看结果不算完成）

```bash
gh repo view OWNER/REPO --json name,visibility,defaultBranchRef,url
git log --oneline -1
git status -sb                      # 应为 up to date，工作区干净
```

再抽查一个远端文件，确认内容真的上去了：

```bash
gh api repos/OWNER/REPO/contents/README.md --jq .path
```

## 常见坑

- **仓库已存在**：`gh repo create` 会直接报错，不会自动合并；先 `gh repo view` 确认
- **分支名不一致**：`git init` 默认可能是 `master`，远端默认 `main`。统一用 `git init -b main`
- **私有仓库 ≠ 可订阅**：技能源只扫描公开仓库，做技能仓库必须 `--public`
- **中文/空格仓库名**：URL 和工具链都会出问题，一律 kebab-case
- **推送前有敏感文件**：先 `git status` 通读一遍，`.env`、密钥、token 一律进 `.gitignore`

## 检查清单

- [ ] `gh auth status` 已登录目标账号
- [ ] 仓库名可用、全小写 kebab-case
- [ ] README / LICENSE / .gitignore 齐全
- [ ] 首个提交已推送，`git status -sb` 干净
- [ ] `gh repo view` 显示正确可见性与默认分支
- [ ] 远端文件抽查通过
