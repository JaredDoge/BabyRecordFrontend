# Baby Record Frontend

React TypeScript PWA application for tracking baby feeding and pumping records.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

此專案使用多個環境變數檔案來區分開發和生產環境：

- **`.env.development`** - 開發環境（`npm run dev`）
  - 預設連接本地 Worker: `http://127.0.0.1:8787`
  
- **`.env.production`** - 生產環境（`npm run build`）
  - 連接遠端 Worker: `https://baby-record-worker.jay07111995.workers.dev`

- **`.env.local`** (可選) - 本地覆蓋設定
  - 此檔案會被 `.gitignore` 忽略
  - 可用於個人化設定，優先級最高

### 使用方式

**本地開發**（自動使用 `.env.development`）：
```bash
npm run dev
```

**建置生產版本**（自動使用 `.env.production`）：
```bash
npm run build
```

**如需覆蓋設定**，創建 `.env.local` 檔案：
```bash
VITE_API_BASE_URL=http://your-custom-url
```

