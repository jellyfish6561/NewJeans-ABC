NewJeans一起學ABC — GitHub Pages / PWA 版

已將分享預覽標題改為「NewJeans一起學ABC」，避免 Android LINE 預覽中文字變成方框。


更新內容：
1. 全部圖片路徑使用 ./ 相對路徑，支援 GitHub Pages 子目錄部署。
2. 包含海報、26 張圖卡、收藏/徽章圖片、App Icon。
3. App Icon 已改用提供的藍白 ABC 兔兔圖案。
4. 新增圖片載入失敗自動重試、Loading Skeleton、Lazy Load。
5. 新增分享功能：LINE、IG 貼文、IG 訊息、Threads 貼文、Threads 訊息、FB 貼文、Messenger 訊息、複製連結。
6. 已移除圖卡內「跟著唸」語音辨識功能。
7. 保留 PWA：可加入手機主畫面，首次載入後可快取主要檔案。

部署方式：
將本資料夾內所有檔案上傳到 GitHub Pages Repository 根目錄，或保留整個資料夾上傳也可以。
請確認 index.html、style.css、script.js、manifest.webmanifest、sw.js、images/、assets/ 都一起上傳。

本次更新：LINE 預覽圖改用 line-preview.png，移除圖卡頁「分享這張」，首頁分享只保留手機系統分享與複製連結，並增加圖卡頁底部空間避免按鍵被右下角說明遮住。