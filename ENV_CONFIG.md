# 環境變數配置說明

## 📁 檔案結構

```
frontend/
├── .env.development      # 開發環境（npm run dev）
├── .env.production       # 生產環境（npm run build）
├── .env.local.example    # 本地設定範本
└── .env.local           # 本地覆蓋設定（不會被提交到 Git）
```

## 🔧 Vite 環境變數載入順序

Vite 會按照以下優先級載入環境變數（後面的會覆蓋前面的）：

1. `.env` - 所有環境共用
2. `.env.development` 或 `.env.production` - 根據模式載入
3. `.env.local` - 本地覆蓋設定（**優先級最高**）

## 🚀 使用場景

### 場景 1: 本地開發（連接本地 Worker）

```bash
npm run dev
```

自動使用 `.env.development`：
```
VITE_API_BASE_URL=http://127.0.0.1:8787
```

### 場景 2: 建置生產版本（連接遠端 Worker）

```bash
npm run build
# 或
npm run deploy
```

自動使用 `.env.production`：
```
VITE_API_BASE_URL=https://baby-record-worker.jay07111995.workers.dev
```

### 場景 3: 本地開發但想連接遠端 Worker

創建 `.env.local` 檔案：
```bash
VITE_API_BASE_URL=https://baby-record-worker.jay07111995.workers.dev
```

然後執行：
```bash
npm run dev
```

### 場景 4: 測試不同的 API 端點

創建 `.env.local` 檔案：
```bash
VITE_API_BASE_URL=http://localhost:3000
```

## ⚠️ 注意事項

1. **`.env.local` 不會被提交到 Git**，適合存放個人化設定
2. **`.env.development` 和 `.env.production` 會被提交到 Git**，作為團隊共用的預設值
3. **環境變數必須以 `VITE_` 開頭**才能在前端程式碼中使用
4. **修改環境變數後需要重啟開發伺服器**才會生效

## 🔍 如何檢查當前使用的 API URL

在瀏覽器 Console 中執行：
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```
