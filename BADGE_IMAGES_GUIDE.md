# バッジ画像置き換えガイド

## 📍 配置場所
`icons/` フォルダに以下の8つのPNG画像を配置してください:

## 🎯 必要なバッジ画像ファイル

| ファイル名 | 町名 | タイプ | 現在の絵文字 | 説明 |
|-----------|------|--------|-------------|------|
| `badge-oguchi.png` | 尾口 | fairy | 🧚‍♀️ | 妖精タイプ |
| `badge-kawachi.png` | 河内 | water | 🌊 | 水タイプ |
| `badge-mattou.png` | 松任 | normal | ⭐ | ノーマルタイプ |
| `badge-mikawa.png` | 美川 | ground | 🌍 | 地面タイプ |
| `badge-shiramine.png` | 白峰 | ice | ❄️ | 氷タイプ |
| `badge-torigoe.png` | 鳥越 | grass | 🌿 | 草タイプ |
| `badge-tsurugi.png` | 鶴来 | fighting | ⚔️ | 格闘タイプ |
| `badge-yoshinodani.png` | 吉野谷 | water | 💧 | 水タイプ |

## 📐 画像仕様

### 推奨サイズ
- **解像度**: 128x128px または 256x256px (正方形)
- **フォーマット**: PNG (透過背景推奨)
- **ファイルサイズ**: 50KB以下を推奨

### デザインガイドライン
1. **透過背景**: 背景は透明にしてください
2. **余白**: 画像の端から10%程度の余白を確保
3. **円形デザイン**: 円形の枠内に収まるデザインが望ましい
4. **色彩**: 各タイプに合った色使い
   - fairy: ピンク系
   - water: 青系
   - normal: グレー/白系
   - ground: 茶色系
   - ice: 水色/白系
   - grass: 緑系
   - fighting: 赤/オレンジ系

## 🔧 技術仕様

### 自動フォールバック機能
画像ファイルが見つからない場合、自動的に絵文字にフォールバックします:
```javascript
<img src="icons/badge-oguchi.png" 
     alt="尾口バッジ" 
     onerror="this.style.display='none'; this.parentElement.textContent='🧚‍♀️';">
```

### CSS エフェクト
- **通常時**: ドロップシャドウ効果
- **制覇済み**: 回転アニメーション + ゴールド光彩
- **ホバー時**: 拡大効果

## 📝 置き換え手順

1. **画像準備**
   - 上記仕様に従って8つのバッジ画像を作成
   - ファイル名を正確に命名

2. **ファイル配置**
   ```
   icons/
   ├── badge-oguchi.png
   ├── badge-kawachi.png
   ├── badge-mattou.png
   ├── badge-mikawa.png
   ├── badge-shiramine.png
   ├── badge-torigoe.png
   ├── badge-tsurugi.png
   └── badge-yoshinodani.png
   ```

3. **確認**
   - ブラウザでindex.htmlを開く
   - マップ上の8つのジムを確認
   - 画像が正しく表示されているか確認
   - 画像が見つからない場合は絵文字が表示されるか確認

## ⚠️ 注意事項

- ファイル名は**完全一致**が必要です（大文字小文字区別）
- 画像パスは `icons/badge-*.png` に固定されています
- PWAキャッシュを有効にする場合は `sw.js` にもパスを追加してください

## 🎨 参考リソース

- Canva: https://www.canva.com/
- Figma: https://www.figma.com/
- GIMP: https://www.gimp.org/
- Adobe Express: https://www.adobe.com/express/

---

**最終更新**: 2025年11月5日  
**作成者**: フルカワ

