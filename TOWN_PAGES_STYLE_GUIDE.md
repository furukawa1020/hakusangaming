# 町ページ統一フォーマット - スタイルガイド

## 🎨 統一構造（全8町共通）

### 1. 🎯 町の魅力セクション
```html
<section class="story-section highlight-section">
    <h2><i data-lucide="sparkles"></i> 町の魅力</h2>
    <div class="attraction-card">
        <p class="lead-text">
            <strong>[町名]</strong>は、[キャッチコピー]<strong>「[愛称]」</strong>✨
            [魅力の説明文]
        </p>
    </div>
</section>
```

### 2. ✨ 見どころハイライト（3項目）
```html
<section class="story-section">
    <h2><i data-lucide="star"></i> 見どころハイライト</h2>
    <div class="highlight-grid">
        <!-- 3つのハイライトカード -->
    </div>
</section>
```

### 3. 🗺️ 冒険ポイント（4-5項目）
```html
<section class="story-section">
    <h2><i data-lucide="map"></i> 冒険ポイント</h2>
    <ul class="explore-points adventure-list">
        <!-- 詳細な説明付きリスト -->
    </ul>
</section>
```

### 4. 📖 この町の物語
```html
<section class="story-section">
    <h2><i data-lucide="book-open"></i> この町の物語</h2>
    <div class="story-text">
        <p class="story-paragraph">[歴史1]</p>
        <p class="story-paragraph">[歴史2]</p>
        <p class="story-highlight">💡 <em>[締めの一言]</em></p>
    </div>
</section>
```

### 5. 💎 地域の宝（4項目）
```html
<section class="story-section treasure-section">
    <h2><i data-lucide="gem"></i> 地域の宝</h2>
    <div class="treasure-grid">
        <!-- 4つの特産品カード -->
    </div>
</section>
```

---

## 📝 各町のコンテンツ

### 吉野谷 ✅ 完了
- **愛称**: 花と温泉の里
- **アイコン**: flower-2 (花)
- **テーマカラー**: ピンク (#e91e63)
- **特徴**: 桜、温泉、四季の絶景

### 美川 🌊
- **愛称**: 海の恵みの町
- **アイコン**: waves (波)
- **テーマカラー**: 青 (#2196f3)
- **特徴**: 漁港、海鮮、美川大祭

### 松任 🏛️
- **愛称**: 白山市の心臓部
- **アイコン**: building-2 (ビル)
- **テーマカラー**: 紺 (#3f51b5)
- **特徴**: 市役所、文化施設、交通要衝

### 鶴来 ⛩️
- **愛称**: 白山信仰の聖地
- **アイコン**: church (神社)
- **テーマカラー**: 紫 (#9c27b0)
- **特徴**: 白山比咩神社、手取川、白山菊酒

### 鳥越 🦅
- **愛称**: 歴史と伝統の里
- **アイコン**: bird (鳥)
- **テーマカラー**: オレンジ (#ff9800)
- **特徴**: 歴史的建造物、伝統工芸、里山

### 尾口 💧
- **愛称**: 滝の王国
- **アイコン**: waves (滝)
- **テーマカラー**: 水色 (#00bcd4)
- **特徴**: 姥ヶ滝、渓谷美、清流

### 河内 🏔️
- **愛称**: 清流と森の里
- **アイコン**: mountain (山)
- **テーマカラー**: 緑 (#4caf50)
- **特徴**: 手取川渓谷、山菜、ハイキング

### 白峰 ❄️
- **愛称**: 白山の懐
- **アイコン**: mountain-snow (雪山)
- **テーマカラー**: 白青 (#03a9f4)
- **特徴**: 白山登山口、古民家、雪景色

---

## 🎨 CSSクラス追加推奨

```css
/* ハイライトセクション */
.highlight-section {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
}

.attraction-card {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.lead-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #2c3e50;
}

/* ハイライトグリッド */
.highlight-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.highlight-item {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: transform 0.3s, box-shadow 0.3s;
}

.highlight-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.highlight-icon {
    margin-bottom: 1rem;
}

.highlight-item h3 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    color: #2c3e50;
}

.highlight-item p {
    font-size: 0.95rem;
    color: #7f8c8d;
    line-height: 1.6;
}

/* 冒険リスト */
.adventure-list {
    list-style: none;
    padding: 0;
}

.adventure-list li {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 0.8rem;
    transition: background 0.3s;
}

.adventure-list li:hover {
    background: #e9ecef;
}

.point-content {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.point-desc {
    font-size: 0.9rem;
    color: #6c757d;
}

/* 物語セクション */
.story-paragraph {
    margin-bottom: 1rem;
    line-height: 1.8;
}

.story-highlight {
    background: #fff3cd;
    border-left: 4px solid #ffc107;
    padding: 1rem;
    margin-top: 1.5rem;
    border-radius: 4px;
}

/* 宝物グリッド */
.treasure-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 15px;
    padding: 2rem;
}

.treasure-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
}

.treasure-item {
    background: rgba(255,255,255,0.15);
    padding: 1.5rem 1rem;
    border-radius: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: transform 0.3s;
}

.treasure-item:hover {
    transform: scale(1.05);
    background: rgba(255,255,255,0.25);
}

.treasure-emoji {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.treasure-item strong {
    font-size: 1rem;
    color: white;
}

.treasure-item span {
    font-size: 0.85rem;
    opacity: 0.9;
}
```

---

## ✅ 実装チェックリスト

- [ ] 吉野谷 ✅
- [ ] 美川
- [ ] 松任
- [ ] 鶴来
- [ ] 鳥越
- [ ] 尾口
- [ ] 河内
- [ ] 白峰
- [ ] CSS追加

作成日: 2024年11月7日
