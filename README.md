# Filtered Code Mirrors

This repository keeps three filtered source snapshots. Each snapshot lives at
the root of a separate branch, so GitHub's **Download ZIP** produces a clean,
single-project archive.

| Branch | Upstream content |
| --- | --- |
| [`bondageclub`](../../tree/bondageclub) | `BondageClub/` from [BondageProjects/Bondage-College](https://gitgud.io/BondageProjects/Bondage-College) |
| [`echo-activity-ext`](../../tree/echo-activity-ext) | [SugarChain-Studio/echo-activity-ext](https://github.com/SugarChain-Studio/echo-activity-ext) |
| [`echo-clothing-ext`](../../tree/echo-clothing-ext) | [SugarChain-Studio/echo-clothing-ext](https://github.com/SugarChain-Studio/echo-clothing-ext) |

The `main` branch only contains this documentation, the sync workflow, and a
small browser tool (`index.html`, published via GitHub Pages) for searching
the mirrored branches by filename or content. The sync workflow runs daily at
approximately 02:17 Taiwan time (18:17 UTC) and can also be triggered
manually from the Actions tab.

Common images, image project files, audio, video, fonts, 3D assets,
documents, archives, and upstream GitHub Actions workflow definitions are
excluded from the snapshots. Source submodules are expanded into the
snapshots so they are included in downloaded ZIP files. A new snapshot
commit is only created when its filtered upstream content actually changes.

These are filtered snapshots and do not preserve the original upstream Git
history.

## Upstream and licensing

All mirrored files originate from their respective upstream projects. Review
and comply with each upstream project's current licensing and redistribution
terms before using or redistributing these mirrors.

---

# 過濾後的程式碼鏡像

這個倉庫保存了三份經過過濾的原始碼快照。每份快照都放在各自獨立分支的根目錄下，
這樣使用 GitHub 的 **Download ZIP** 就能直接得到一份乾淨、單一專案的壓縮檔。

| 分支 | 上游來源 |
| --- | --- |
| [`bondageclub`](../../tree/bondageclub) | 來自 [BondageProjects/Bondage-College](https://gitgud.io/BondageProjects/Bondage-College) 的 `BondageClub/` 資料夾 |
| [`echo-activity-ext`](../../tree/echo-activity-ext) | [SugarChain-Studio/echo-activity-ext](https://github.com/SugarChain-Studio/echo-activity-ext) |
| [`echo-clothing-ext`](../../tree/echo-clothing-ext) | [SugarChain-Studio/echo-clothing-ext](https://github.com/SugarChain-Studio/echo-clothing-ext) |

`main` 分支只放這份說明文件、同步用的 workflow，以及一個透過 GitHub Pages
發佈的小型瀏覽器工具（`index.html`），可以用檔名或內容關鍵字搜尋各個鏡像分支。
同步 workflow 每天約在台灣時間 02:17（UTC 18:17）自動執行一次，也可以在
Actions 分頁手動觸發。

快照會排除常見的圖片、影像專案檔、音訊、影片、字型、3D 素材、文件、壓縮檔，
以及上游倉庫自帶的 GitHub Actions workflow 定義。原始碼中的 submodule 會被
展開併入快照，讓下載的 ZIP 檔案包含完整內容。只有在過濾後的上游內容真的有
變動時，才會產生新的快照 commit。

這些都是經過過濾的快照，不會保留上游原本的 Git 歷史紀錄。

## 上游與授權

所有被鏡像的檔案都源自各自的上游專案。使用或轉散布這些鏡像內容之前，請自行
檢視並遵守各上游專案目前的授權與轉散布條款。
