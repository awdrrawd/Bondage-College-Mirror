# Filtered code mirrors

This repository keeps three filtered source snapshots. Each snapshot lives at
the root of a separate branch so GitHub's **Download ZIP** produces a clean,
single-project archive.

| Branch | Upstream content |
| --- | --- |
| [`bondageclub`](../../tree/bondageclub) | `BondageClub/` from [BondageProjects/Bondage-College](https://gitgud.io/BondageProjects/Bondage-College) |
| [`echo-activity-ext`](../../tree/echo-activity-ext) | [SugarChain-Studio/echo-activity-ext](https://github.com/SugarChain-Studio/echo-activity-ext) |
| [`echo-clothing-ext`](../../tree/echo-clothing-ext) | [SugarChain-Studio/echo-clothing-ext](https://github.com/SugarChain-Studio/echo-clothing-ext) |

The `main` branch contains only this documentation and the synchronization
workflow. The workflow runs daily at approximately 02:17 Taiwan time and can
also be started manually from the Actions page.

Common images, image project files, audio, video, fonts, 3D assets, documents,
and archives are excluded. Source submodules are expanded into the snapshots so
they are included in downloaded ZIP files. A new snapshot commit is created only
when its filtered upstream content changes.

These are filtered snapshots and do not preserve original upstream Git history.

## Upstream and licensing

All mirrored files originate from their respective upstream projects. Review
and comply with each upstream project's current licensing and redistribution
terms before using or redistributing these mirrors.
