# 226宿舍管理系统

辽宁大学蒲河校区226宿舍的共享管理平台。

## 部署步骤（5分钟）

### 第1步：推到 GitHub

把 `dorm226` 文件夹推到你的 GitHub 仓库。

### 第2步：导入 Vercel

1. 打开 [vercel.com](https://vercel.com)，登录
2. 点 **Add New Project**
3. 导入你的 GitHub 仓库
4. 直接点 **Deploy**（不需要设置任何环境变量）

### 第3步：创建 KV 存储

1. 部署完成后，进入项目 → **Storage** 标签
2. 点 **Create Database** → 选 **KV (Redis)**
3. 名字填 `DORM226_KV`，地区选 `Hong Kong`（离沈阳最近）
4. 点 **Create**
5. 创建后，点 **Connect to Project** → 选你的项目 → **Connect**

### 第4步：重新部署

回到 **Deployments** 标签，点最新部署右边的三个点 → **Redeploy**

### 完成！

访问 Vercel 给你的网址（如 `dorm226-xxx.vercel.app`），发给室友即可。

## 功能

- 📅 日程管理（公共 + 个人）
- 📋 作业管理（自动按紧急程度排序）
- 💬 留言板（四人实时同步）
- 🍜 外卖推荐
- 🍅 番茄钟
- 🧰 工具箱（水票/电费/聚餐）
- 🔗 校园服务入口（教务系统/图书馆/知网）
