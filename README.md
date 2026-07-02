# memu_2026

## 專案簡介

這是一個個人履歷與音樂教學宣傳網站，包含前台展示頁、後台內容管理、MySQL 資料儲存、圖片上傳與 LocalStorage 備援。

## 主要功能

- 前台履歷展示
- 響應式版面
- 照片輪播
- 清單查看更多 / 收合
- 回到頂端
- 後台內容管理
- 清單新增、刪除、排序
- 圖片上傳
- MySQL API 儲存
- LocalStorage fallback

## 專案結構

```text
memu_2026/
├── index.html             # 前台展示頁 HTML，也是 GitHub Pages 預設首頁
├── index.php              # PHP 環境入口，輸出 index.html
├── admin.html             # 後台內容管理頁
├── common.js              # 共用資料模型、正規化、LocalStorage、API 與圖片工具
├── memu.js                # 前台資料渲染、照片輪播、查看更多、回到頂端
├── admin.js               # 後台表單、清單排序、儲存與圖片上傳
├── common.css             # 共用樣式變數與基本元件
├── memu.css               # 前台版面與響應式樣式
├── admin.css              # 後台表單與管理介面樣式
├── api/
│   ├── config.php         # PDO 連線與 JSON response helper
│   ├── resume.php         # 履歷資料讀取 / 儲存 API
│   └── upload_photo.php   # 圖片上傳 API
├── database.sql           # MySQL 資料庫與資料表 schema
├── uploads/               # 圖片上傳目錄
├── IMG_5952.JPG           # 預設桌機照片
└── IMG_5952-mobile.jpg    # 預設手機照片
```

## 資料流程

前台：

```text
LocalStorage 預先顯示
  → API 載入 MySQL 資料
  → 更新畫面與 LocalStorage
```

後台：

```text
表單編輯
  → 儲存 LocalStorage
  → 嘗試儲存 API / MySQL
  → 若 API 失敗仍保留本機資料
```

圖片：

```text
優先上傳 API
  → 若失敗則轉成壓縮 Data URL 暫存在本機
```

## 本機開發說明

- 前台可直接開啟 `index.html` 預覽靜態畫面。
- 若要使用 API、MySQL 儲存與圖片上傳，需要 PHP + MySQL 環境。
- `database.sql` 可用來建立 `memu_resume` 資料庫與資料表。
- `api/config.php` 目前需要依部署環境調整資料庫設定。
- `uploads/` 需要伺服器具備寫入權限，圖片上傳功能才會成功。

## 注意事項

- 後台目前尚未加入登入驗證。
- API 目前尚未加入權限保護與 CSRF 防護。
- `api/config.php` 尚未改成 `.env` 或環境變數設定。
- 圖片上傳需要伺服器寫入 `uploads/` 權限。
- 正式部署前應補上安全機制，並確認 `uploads/` 不可執行 PHP 或其他伺服器端腳本。

## 後續改善方向

- 後台登入驗證
- API 權限保護
- config 改用環境變數
- 圖片壓縮與清理機制
- README 補充部署流程
- 基礎測試或驗收清單
