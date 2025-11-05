// RPG Map JavaScript for Hakusan League Gym Badge Quest

// Security utilities
const SecurityUtils = {
    safeJSONParse(data, defaultValue = null) {
        try {
            const parsed = JSON.parse(data);
            if (typeof parsed === 'object') {
                return parsed;
            }
            return defaultValue;
        } catch (e) {
            console.error('JSON parse error:', e);
            return defaultValue;
        }
    }
};

class RPGMapController {
    constructor() {
        this.gyms = {
            'oguchi': { name: '尾口', type: 'fairy', icon: '🧚‍♀️', completed: false },
            'kawachi': { name: '河内', type: 'water', icon: '🌊', completed: false },
            'mattou': { name: '松任', type: 'normal', icon: '⭐', completed: false },
            'mikawa': { name: '美川', type: 'ground', icon: '🌍', completed: false },
            'shiramine': { name: '白峰', type: 'ice', icon: '❄️', completed: false },
            'torigoe': { name: '鳥越', type: 'grass', icon: '🌿', completed: false },
            'tsurugi': { name: '鶴来', type: 'fighting', icon: '⚔️', completed: false },
            'yoshinodani': { name: '吉野谷', type: 'water', icon: '💧', completed: false }
        };
        
        this.badges = [];
        this.initializeMap();
        this.loadProgress();
        this.setupEventListeners();
        this.updateDisplay();
        this.checkUrlParameters();
    }

    initializeMap() {
        // マップ要素の初期化
        this.mapContainer = document.querySelector('.rpg-world-map');
        this.progressRing = document.querySelector('.progress-ring-circle');
        this.badgeCounter = document.querySelector('.badge-count');
        this.progressText = document.querySelector('.progress-text');
        
        // ジム位置の設定
        this.gymPositions = {
            'oguchi': { x: 15, y: 25 },      // 左上 - 尾口
            'kawachi': { x: 20, y: 80 },     // 左下 - 河内  
            'mattou': { x: 50, y: 70 },      // 中央下 - 松任
            'mikawa': { x: 35, y: 85 },      // 左下寄り - 美川
            'shiramine': { x: 60, y: 15 },   // 白山付近 - 白峰
            'torigoe': { x: 75, y: 40 },     // 右中央 - 鳥越
            'tsurugi': { x: 70, y: 60 },     // 右下 - 鶴来
            'yoshinodani': { x: 45, y: 35 }  // 中央 - 吉野谷
        };
        
        this.createGymBuildings();
        this.createAdventureElements();
        this.initializeAnimations();
    }

    createGymBuildings() {
        Object.keys(this.gyms).forEach(gymId => {
            const gym = this.gyms[gymId];
            const position = this.gymPositions[gymId];
            
            const gymElement = document.createElement('div');
            gymElement.className = 'gym-location';
            gymElement.id = `gym-${gymId}`;
            gymElement.style.left = `${position.x}%`;
            gymElement.style.top = `${position.y}%`;
            gymElement.onclick = () => this.visitGym(gymId);
            
            gymElement.innerHTML = `
                <div class="gym-building ${gym.completed ? 'completed' : ''}" data-type="${gym.type}">
                    <div class="gym-glow"></div>
                    <div class="gym-roof ${gym.type}-roof"></div>
                    <div class="gym-walls ${gym.type}-walls"></div>
                    <div class="gym-door"></div>
                    <div class="gym-badge">${gym.icon}</div>
                </div>
                <div class="gym-info">
                    <span class="gym-name">${gym.name}ジム</span>
                    <span class="gym-type ${gym.type}">${this.getTypeNameJa(gym.type)}タイプ</span>
                    <span class="gym-status">${gym.completed ? '制覇済み' : '未挑戦'}</span>
                </div>
            `;
            
            this.mapContainer.appendChild(gymElement);
        });
    }

    createAdventureElements() {
        // 伝説のポケモン（白山山頂）
        const legendaryElement = document.createElement('div');
        legendaryElement.className = 'legendary-pokemon';
        legendaryElement.style.left = '52%';
        legendaryElement.style.top = '8%';
        legendaryElement.innerHTML = '<i data-lucide="dragon" style="width: 32px; height: 32px;"></i>';
        legendaryElement.onclick = () => this.interactWithLegendary();
        
        // 宝箱（隠された場所）
        const treasureElements = [
            { x: 25, y: 45, icon: 'gem' },
            { x: 80, y: 25, icon: 'trophy' },
            { x: 65, y: 75, icon: 'star' }
        ];
        
        treasureElements.forEach((treasure, index) => {
            const treasureElement = document.createElement('div');
            treasureElement.className = 'treasure-chest';
            treasureElement.style.left = `${treasure.x}%`;
            treasureElement.style.top = `${treasure.y}%`;
            treasureElement.innerHTML = `<i data-lucide="${treasure.icon}" style="width: 24px; height: 24px;"></i>`;
            treasureElement.onclick = () => this.collectTreasure(index);
            this.mapContainer.appendChild(treasureElement);
        });
        
        // Lucideアイコンを初期化
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // 野生のポケモン
        const wildPokemonElements = [
            { x: 30, y: 30, icon: 'bird' },
            { x: 85, y: 50, icon: 'circle' },
            { x: 40, y: 60, icon: 'fish' }
        ];
        
        wildPokemonElements.forEach((pokemon, index) => {
            const pokemonElement = document.createElement('div');
            pokemonElement.className = 'wild-pokemon';
            pokemonElement.style.left = `${pokemon.x}%`;
            pokemonElement.style.top = `${pokemon.y}%`;
            pokemonElement.innerHTML = `<i data-lucide="${pokemon.icon}" style="width: 20px; height: 20px;"></i>`;
            pokemonElement.onclick = () => this.encounterWildPokemon(index);
            this.mapContainer.appendChild(pokemonElement);
        });
        
        // Lucideアイコンを初期化
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        this.mapContainer.appendChild(legendaryElement);
    }

    initializeAnimations() {
        // 天候エフェクト
        this.createWeatherEffects();
        
        // 昼夜サイクル
        this.startDayNightCycle();
        
        // 季節エフェクト
        this.applySeasonalEffects();
    }

    createWeatherEffects() {
        // 雲の動き
        const cloudsContainer = document.createElement('div');
        cloudsContainer.className = 'weather-clouds';
        cloudsContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 30%;
            z-index: 4;
            pointer-events: none;
        `;
        
        for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 50px;
                animation: cloudMove ${15 + i * 5}s infinite linear;
                top: ${10 + i * 8}%;
                left: -10%;
                width: ${60 + i * 20}px;
                height: ${30 + i * 10}px;
            `;
            cloudsContainer.appendChild(cloud);
        }
        
        this.mapContainer.appendChild(cloudsContainer);
        
        // 雲のアニメーション追加
        const cloudKeyframes = `
            @keyframes cloudMove {
                0% { transform: translateX(-100px); }
                100% { transform: translateX(calc(100vw + 100px)); }
            }
        `;
        
        if (!document.querySelector('#cloud-animations')) {
            const style = document.createElement('style');
            style.id = 'cloud-animations';
            style.textContent = cloudKeyframes;
            document.head.appendChild(style);
        }
    }

    startDayNightCycle() {
        const updateTime = () => {
            const hour = new Date().getHours();
            let timeClass = 'day';
            
            if (hour >= 6 && hour < 18) {
                timeClass = 'day';
            } else if (hour >= 18 && hour < 22) {
                timeClass = 'evening';
            } else {
                timeClass = 'night';
            }
            
            this.mapContainer.className = this.mapContainer.className.replace(/\b(day|evening|night)\b/g, '');
            this.mapContainer.classList.add(timeClass);
        };
        
        updateTime();
        setInterval(updateTime, 60000); // 1分ごとに更新
    }

    applySeasonalEffects() {
        const month = new Date().getMonth() + 1;
        let season = 'spring';
        
        if (month >= 6 && month <= 8) season = 'summer';
        else if (month >= 9 && month <= 11) season = 'autumn';
        else if (month >= 12 || month <= 2) season = 'winter';
        
        this.mapContainer.classList.add(`season-${season}`);
        
        // 季節に応じた特殊エフェクト
        if (season === 'winter') {
            this.createSnowEffect();
        } else if (season === 'autumn') {
            this.createFallingLeavesEffect();
        }
    }

    createSnowEffect() {
        const snowContainer = document.createElement('div');
        snowContainer.className = 'snow-effect';
        snowContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 6;
        `;
        
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄';
            snowflake.style.cssText = `
                position: absolute;
                color: rgba(255, 255, 255, 0.8);
                font-size: ${Math.random() * 10 + 10}px;
                left: ${Math.random() * 100}%;
                animation: snowfall ${Math.random() * 3 + 2}s infinite linear;
                animation-delay: ${Math.random() * 2}s;
            `;
            snowContainer.appendChild(snowflake);
        }
        
        this.mapContainer.appendChild(snowContainer);
        
        // 雪のアニメーション
        const snowKeyframes = `
            @keyframes snowfall {
                0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
            }
        `;
        
        if (!document.querySelector('#snow-animations')) {
            const style = document.createElement('style');
            style.id = 'snow-animations';
            style.textContent = snowKeyframes;
            document.head.appendChild(style);
        }
    }

    createFallingLeavesEffect() {
        const leavesContainer = document.createElement('div');
        leavesContainer.className = 'leaves-effect';
        leavesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 6;
        `;
        
        const leafEmojis = ['🍂', '🍁', '🍃'];
        
        for (let i = 0; i < 30; i++) {
            const leaf = document.createElement('div');
            leaf.innerHTML = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
            leaf.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 8 + 12}px;
                left: ${Math.random() * 100}%;
                animation: leaffall ${Math.random() * 4 + 3}s infinite linear;
                animation-delay: ${Math.random() * 3}s;
            `;
            leavesContainer.appendChild(leaf);
        }
        
        this.mapContainer.appendChild(leavesContainer);
        
        // 落ち葉のアニメーション
        const leafKeyframes = `
            @keyframes leaffall {
                0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
            }
        `;
        
        if (!document.querySelector('#leaf-animations')) {
            const style = document.createElement('style');
            style.id = 'leaf-animations';
            style.textContent = leafKeyframes;
            document.head.appendChild(style);
        }
    }

    setupEventListeners() {
        // ジムのホバーエフェクト
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.gym-location')) {
                const gym = e.target.closest('.gym-location');
                this.showGymPreview(gym);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.gym-location')) {
                this.hideGymPreview();
            }
        });
        
        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                this.toggleMapView();
            }
            if (e.key === 'r' || e.key === 'R') {
                this.resetProgress();
            }
        });
        
        // タッチデバイス対応
        this.mapContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
    }

    showGymPreview(gymElement) {
        const gymId = gymElement.id.replace('gym-', '');
        const gym = this.gyms[gymId];
        
        // プレビュー情報を表示
        const preview = document.createElement('div');
        preview.className = 'gym-preview';
        preview.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            z-index: 1000;
            max-width: 200px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            border: 2px solid #3498db;
        `;
        
        preview.innerHTML = `
            <h4>${gym.name}ジム</h4>
            <p>タイプ: ${this.getTypeNameJa(gym.type)}</p>
            <p>状態: ${gym.completed ? '<span style="color: #27ae60;">制覇済み</span> <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>' : '<span style="color: #e74c3c;">未挑戦</span> <i data-lucide="x-circle" style="width: 14px; height: 14px;"></i>'}</p>
            <p>リーダー: ${this.getGymLeaderName(gymId)}</p>
            <small>クリックして挑戦</small>
        `;
        
        document.body.appendChild(preview);
        
        // Lucideアイコンを初期化
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // マウス位置に表示
        document.addEventListener('mousemove', this.updatePreviewPosition);
        this.currentPreview = preview;
    }

    updatePreviewPosition = (e) => {
        if (this.currentPreview) {
            this.currentPreview.style.left = `${e.clientX + 10}px`;
            this.currentPreview.style.top = `${e.clientY + 10}px`;
        }
    }

    hideGymPreview() {
        if (this.currentPreview) {
            this.currentPreview.remove();
            this.currentPreview = null;
            document.removeEventListener('mousemove', this.updatePreviewPosition);
        }
    }

    visitGym(gymId) {
        // ジムページに遷移
        window.location.href = `town/${gymId}.html`;
    }

    interactWithLegendary() {
        if (this.badges.length === 8) {
            this.showMessage('伝説のポケモンが現れた！\n全てのジムバッジを集めた真のチャンピオンよ...', 'legendary');
        } else {
            this.showMessage('まだその時ではない...\n全てのジムバッジを集めてから来るがよい。', 'warning');
        }
    }

    collectTreasure(index) {
        const treasures = ['ダイヤモンド', 'チャンピオントロフィー', 'スターピース'];
        this.showMessage(`${treasures[index]}を発見した！`, 'success');
        
        // 宝箱を非表示にする
        const treasureElements = document.querySelectorAll('.treasure-chest');
        if (treasureElements[index]) {
            treasureElements[index].style.display = 'none';
        }
    }

    encounterWildPokemon(index) {
        const pokemon = ['🦅 オオワシ', '🐻 ツキノワグマ', '🐟 アユ'];
        this.showMessage(`野生の ${pokemon[index]} が現れた！`, 'encounter');
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `game-message ${type}`;
        messageElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${this.getMessageColor(type)};
            color: white;
            padding: 2rem;
            border-radius: 15px;
            z-index: 2000;
            text-align: center;
            border: 3px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: messageAppear 0.5s ease;
        `;
        
        messageElement.innerHTML = `
            <div style="white-space: pre-line; margin-bottom: 1rem;">${message}</div>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.5);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
            ">OK</button>
        `;
        
        document.body.appendChild(messageElement);
        
        // 自動削除
        setTimeout(() => {
            if (messageElement.parentElement) {
                messageElement.remove();
            }
        }, 5000);
    }

    getMessageColor(type) {
        const colors = {
            'info': 'linear-gradient(135deg, #3498db, #2980b9)',
            'success': 'linear-gradient(135deg, #27ae60, #229954)',
            'warning': 'linear-gradient(135deg, #f39c12, #e67e22)',
            'legendary': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
            'encounter': 'linear-gradient(135deg, #e74c3c, #c0392b)'
        };
        return colors[type] || colors.info;
    }

    toggleMapView() {
        const sidebar = document.querySelector('.adventure-sidebar');
        if (sidebar.style.display === 'none') {
            sidebar.style.display = 'flex';
        } else {
            sidebar.style.display = 'none';
        }
    }

    resetProgress() {
        if (confirm('本当に進行状況をリセットしますか？')) {
            localStorage.removeItem('hakusan_badges');
            this.badges = [];
            Object.keys(this.gyms).forEach(gymId => {
                this.gyms[gymId].completed = false;
            });
            this.updateDisplay();
            this.updateGymBuildings();
            this.showMessage('進行状況をリセットしました。', 'info');
        }
    }

    loadProgress() {
        // SecurityUtils.getBadges()を使用（グローバルから）
        const badges = window.SecurityUtils ? window.SecurityUtils.getBadges() : [];
        this.badges = badges;
        
        if (Array.isArray(this.badges)) {
            this.badges.forEach(badge => {
                if (this.gyms[badge]) {
                    this.gyms[badge].completed = true;
                }
            });
        }
    }

    saveProgress() {
        localStorage.setItem('hakusan_badges', JSON.stringify(this.badges));
    }

    addBadge(gymId) {
        if (!this.badges.includes(gymId)) {
            this.badges.push(gymId);
            this.gyms[gymId].completed = true;
            this.saveProgress();
            this.updateDisplay();
            this.updateGymBuildings();
            
            // Fire incentive system events
            if (window.incentiveSystem) {
                const gymName = this.gyms[gymId].name;
                window.incentiveSystem.onBadgeAcquired(gymId, gymName);
            }
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('badgeAcquired', {
                detail: { gymId: gymId, badgeName: this.gyms[gymId].name }
            }));
            
            // Update incentive content if available
            if (window.updateIncentiveContent) {
                setTimeout(() => window.updateIncentiveContent(), 100);
            }
            
            if (this.badges.length === 8) {
                this.showChampionMessage();
            }
        }
    }

    updateDisplay() {
        // バッジカウンター更新
        if (this.badgeCounter) {
            this.badgeCounter.textContent = this.badges.length;
        }
        
        // プログレスリング更新
        if (this.progressRing) {
            const progress = (this.badges.length / 8) * 157; // 円周の長さ
            this.progressRing.style.strokeDashoffset = 157 - progress;
        }
        
        // プログレステキスト更新
        if (this.progressText) {
            this.progressText.textContent = `${this.badges.length}/8`;
        }
        
        // サイドバーのバッジスロット更新
        this.updateBadgeSlots();
        
        // 次の目標更新
        this.updateNextObjective();
    }

    updateBadgeSlots() {
        const badgeSlots = document.querySelectorAll('.badge-slot');
        const gymIds = Object.keys(this.gyms);
        
        badgeSlots.forEach((slot, index) => {
            if (index < gymIds.length) {
                const gymId = gymIds[index];
                const gym = this.gyms[gymId];
                
                if (gym.completed) {
                    slot.classList.add('obtained');
                    slot.innerHTML = gym.icon;
                } else {
                    slot.classList.remove('obtained');
                    slot.innerHTML = '';
                }
            }
        });
    }

    updateGymBuildings() {
        Object.keys(this.gyms).forEach(gymId => {
            const gymElement = document.getElementById(`gym-${gymId}`);
            const building = gymElement?.querySelector('.gym-building');
            const status = gymElement?.querySelector('.gym-status');
            
            if (building && status) {
                if (this.gyms[gymId].completed) {
                    building.classList.add('completed');
                    status.textContent = '制覇済み';
                } else {
                    building.classList.remove('completed');
                    status.textContent = '未挑戦';
                }
            }
        });
    }

    updateNextObjective() {
        const objectiveContent = document.querySelector('.objective-content');
        if (objectiveContent) {
            let objective = '';
            
            if (this.badges.length === 0) {
                objective = '白山地方の冒険を始めよう！\n任意のジムを選んでバッジ収集を開始。';
            } else if (this.badges.length < 8) {
                const remaining = 8 - this.badges.length;
                objective = `残り${remaining}個のジムバッジを集めよう！\n${this.getNextGymRecommendation()}`;
            } else {
                objective = '全てのジムバッジを獲得！\n白山山頂の伝説のポケモンに挑戦しよう。';
            }
            
            objectiveContent.textContent = objective;
        }
    }

    getNextGymRecommendation() {
        const uncompletedGyms = Object.entries(this.gyms)
            .filter(([id, gym]) => !gym.completed)
            .map(([id, gym]) => gym.name);
        
        if (uncompletedGyms.length > 0) {
            const randomGym = uncompletedGyms[Math.floor(Math.random() * uncompletedGyms.length)];
            return `おすすめ: ${randomGym}ジムに挑戦`;
        }
        
        return '';
    }

    showChampionMessage() {
        const championModal = document.createElement('div');
        championModal.className = 'complete-section';
        championModal.innerHTML = `
            <div class="complete-modal">
                <div class="champion-effects"></div>
                <h2><i data-lucide="trophy" style="width: 48px; height: 48px;"></i> おめでとうございます！ <i data-lucide="trophy" style="width: 48px; height: 48px;"></i></h2>
                <p>全てのジムバッジを集めました！</p>
                <p>あなたは真の<br><strong>ハクサンリーグチャンピオン</strong>です！</p>
                <button class="complete-btn" onclick="this.closest('.complete-section').remove()">
                    チャンピオンロードへ
                </button>
            </div>
        `;
        
        document.body.appendChild(championModal);
        
        // Lucideアイコンを初期化
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const badge = urlParams.get('badge');
        
        if (badge && this.gyms[badge]) {
            this.addBadge(badge);
            // URLからパラメータを削除
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    getTypeNameJa(type) {
        const typeNames = {
            'fairy': 'フェアリー',
            'water': 'みず',
            'normal': 'ノーマル',
            'ground': 'じめん',
            'ice': 'こおり',
            'grass': 'くさ',
            'fighting': 'かくとう'
        };
        return typeNames[type] || type;
    }

    getGymLeaderName(gymId) {
        const leaders = {
            'oguchi': 'オグチ',
            'kawachi': 'カワチ',
            'mattou': 'マットウ',
            'mikawa': 'ミカワ',
            'shiramine': 'シラミネ',
            'torigoe': 'トリゴエ',
            'tsurugi': 'ツルギ',
            'yoshinodani': 'ヨシノダニ'
        };
        return leaders[gymId] || 'ミスティック';
    }
}

// メッセージアニメーション用CSS
const messageAnimationCSS = `
    @keyframes messageAppear {
        0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8);
        }
        100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;

if (!document.querySelector('#message-animations')) {
    const style = document.createElement('style');
    style.id = 'message-animations';
    style.textContent = messageAnimationCSS;
    document.head.appendChild(style);
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    const rpgMap = new RPGMapController();
    window.rpgMap = rpgMap;
    
    // Initialize incentive content when available
    setTimeout(() => {
        if (window.incentiveSystem && window.updateIncentiveContent) {
            window.updateIncentiveContent();
        }
    }, 1000);
});
