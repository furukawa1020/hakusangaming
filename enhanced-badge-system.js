/**
 * 🎊 Enhanced Badge System with Visual & Audio Effects
 * 強化されたバッジシステム - 視覚・音響効果付き
 */

// Enhanced Configuration
const ENHANCED_CONFIG = {
    // パーティクル設定
    particles: {
        count: 30,
        duration: 3000,
        types: ['star', 'heart', 'diamond', 'rainbow']
    },
    
    // 音響設定
    audio: {
        badgeAcquired: '/sounds/badge-acquired.mp3',
        allComplete: '/sounds/all-complete.mp3',
        error: '/sounds/error.mp3',
        volume: 0.7
    },
    
    // アニメーション設定
    animation: {
        badgeDuration: 2000,
        glowDuration: 1500,
        celebrationDuration: 5000
    }
};

// Enhanced Audio Manager
class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.isEnabled = true;
        this.volume = ENHANCED_CONFIG.audio.volume;
        this.loadSounds();
    }
    
    loadSounds() {
        Object.entries(ENHANCED_CONFIG.audio).forEach(([key, url]) => {
            if (key !== 'volume' && typeof url === 'string') {
                const audio = new Audio();
                audio.src = url;
                audio.volume = this.volume;
                audio.preload = 'auto';
                this.sounds.set(key, audio);
            }
        });
    }
    
    play(soundName) {
        if (!this.isEnabled) return;
        
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => {
                console.warn('Audio play failed:', e);
            });
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => {
            sound.volume = this.volume;
        });
    }
    
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }
}

// Enhanced Particle System
class ParticleSystem {
    constructor() {
        this.container = null;
        this.createContainer();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'badge-celebration';
        document.body.appendChild(this.container);
    }
    
    createParticle(type, x, y) {
        const particle = document.createElement('div');
        particle.className = `particle-${type}`;
        
        // ランダムな開始位置とアニメーション遅延
        const randomX = (Math.random() - 0.5) * 200;
        const delay = Math.random() * 1000;
        
        particle.style.cssText = `
            left: ${x || Math.random() * window.innerWidth}px;
            top: ${y || window.innerHeight}px;
            --random-x: ${randomX}px;
            --delay: ${delay}ms;
        `;
        
        this.container.appendChild(particle);
        
        // パーティクルを自動削除
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, ENHANCED_CONFIG.particles.duration + delay);
        
        return particle;
    }
    
    burst(x, y, count = ENHANCED_CONFIG.particles.count) {
        const types = ENHANCED_CONFIG.particles.types;
        
        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            setTimeout(() => {
                this.createParticle(type, x, y);
            }, Math.random() * 500);
        }
    }
    
    celebration() {
        // 画面全体に大きな祝典エフェクト
        for (let i = 0; i < ENHANCED_CONFIG.particles.count * 2; i++) {
            setTimeout(() => {
                this.burst(Math.random() * window.innerWidth, window.innerHeight);
            }, Math.random() * 2000);
        }
    }
    
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Enhanced Badge System
class EnhancedBadgeSystem {
    constructor() {
        this.audioManager = new AudioManager();
        this.particleSystem = new ParticleSystem();
        this.dataStore = new EnhancedDataStore();
        this.uiManager = new UIManager();
        
        this.isAnimating = false;
        this.initialize();
    }
    
    initialize() {
        // 既存のaddStamp関数を拡張
        this.enhanceExistingFunctions();
        
        // UIの初期化
        this.uiManager.initialize();
        
        // データの整合性チェック
        this.dataStore.validateAndRepair();
        
        console.log('🎊 Enhanced Badge System initialized!');
    }
    
    enhanceExistingFunctions() {
        // 既存のaddStamp関数をバックアップして拡張
        if (window.addStamp) {
            const originalAddStamp = window.addStamp;
            window.addStamp = (townCode) => {
                const result = originalAddStamp(townCode);
                if (result) {
                    this.onBadgeAcquired(townCode);
                }
                return result;
            };
        }
    }
    
    async onBadgeAcquired(townCode) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        try {
            // 音響効果
            this.audioManager.play('badgeAcquired');
            
            // バッジ要素を取得
            const badgeElement = this.findBadgeElement(townCode);
            
            // 視覚効果
            if (badgeElement) {
                await this.playBadgeAnimation(badgeElement);
                this.particleSystem.burst(
                    badgeElement.offsetLeft + badgeElement.offsetWidth / 2,
                    badgeElement.offsetTop + badgeElement.offsetHeight / 2
                );
            }
            
            // データを強化ストレージに保存
            await this.dataStore.saveBadge(townCode);
            
            // 全バッジ取得チェック
            if (this.checkAllBadgesComplete()) {
                await this.onAllBadgesComplete();
            }
            
            // UI更新
            this.uiManager.updateProgress();
            
        } catch (error) {
            console.error('Badge acquisition error:', error);
            this.audioManager.play('error');
        } finally {
            this.isAnimating = false;
        }
    }
    
    async playBadgeAnimation(element) {
        return new Promise((resolve) => {
            element.style.animation = `badgeAcquired ${ENHANCED_CONFIG.animation.badgeDuration}ms ease-out`;
            element.classList.add('badge-glow');
            
            setTimeout(() => {
                element.style.animation = '';
                element.classList.remove('badge-glow');
                element.classList.add('badge-obtained');
                resolve();
            }, ENHANCED_CONFIG.animation.badgeDuration);
        });
    }
    
    findBadgeElement(townCode) {
        // 複数のセレクタでバッジ要素を検索
        const selectors = [
            `[data-town="${townCode}"]`,
            `[data-badge="${townCode}"]`,
            `.badge-${townCode}`,
            `#badge-${townCode}`
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        
        return null;
    }
    
    checkAllBadgesComplete() {
        const allTowns = Object.keys(towns || {});
        const acquiredBadges = getStamps() || [];
        
        return allTowns.length > 0 && allTowns.every(town => acquiredBadges.includes(town));
    }
    
    async onAllBadgesComplete() {
        // 特別な祝典効果
        this.audioManager.play('allComplete');
        this.particleSystem.celebration();
        
        // 背景エフェクト
        const celebrationBg = document.createElement('div');
        celebrationBg.className = 'all-badges-completed';
        document.body.appendChild(celebrationBg);
        
        setTimeout(() => {
            celebrationBg.remove();
        }, ENHANCED_CONFIG.animation.celebrationDuration);
        
        // 完了通知
        this.uiManager.showCompletionMessage();
    }
}

// Enhanced Data Store with backup and recovery
class EnhancedDataStore {
    constructor() {
        this.primaryKey = 'hakusan_badges';
        this.backupKey = 'hakusan_badges_backup';
        this.timestampKey = 'hakusan_badges_timestamp';
        this.checksumKey = 'hakusan_badges_checksum';
    }
    
    async saveBadge(townCode) {
        const badges = this.getBadges();
        if (!badges.includes(townCode)) {
            badges.push(townCode);
            await this.saveWithBackup(badges);
        }
    }
    
    async saveWithBackup(badges) {
        const timestamp = Date.now();
        const checksum = this.generateChecksum(badges);
        const data = JSON.stringify(badges);
        
        try {
            // 現在のデータをバックアップ
            const currentData = localStorage.getItem(this.primaryKey);
            if (currentData) {
                localStorage.setItem(this.backupKey, currentData);
            }
            
            // 新しいデータを保存
            localStorage.setItem(this.primaryKey, data);
            localStorage.setItem(this.timestampKey, timestamp.toString());
            localStorage.setItem(this.checksumKey, checksum);
            
            // IndexedDBにも保存（可能であれば）
            await this.saveToIndexedDB(badges, timestamp, checksum);
            
        } catch (error) {
            console.error('Save error:', error);
            throw error;
        }
    }
    
    getBadges() {
        if (typeof getStamps === 'function') {
            return getStamps();
        }
        
        try {
            const data = localStorage.getItem(this.primaryKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Get badges error:', error);
            return this.recoverFromBackup();
        }
    }
    
    generateChecksum(data) {
        return btoa(JSON.stringify(data)).slice(0, 16);
    }
    
    validateAndRepair() {
        const badges = this.getBadges();
        const storedChecksum = localStorage.getItem(this.checksumKey);
        const currentChecksum = this.generateChecksum(badges);
        
        if (storedChecksum !== currentChecksum) {
            console.warn('Data integrity check failed, attempting recovery...');
            return this.recoverFromBackup();
        }
        
        return badges;
    }
    
    recoverFromBackup() {
        try {
            const backupData = localStorage.getItem(this.backupKey);
            if (backupData) {
                const badges = JSON.parse(backupData);
                localStorage.setItem(this.primaryKey, backupData);
                console.log('Data recovered from backup');
                return badges;
            }
        } catch (error) {
            console.error('Backup recovery failed:', error);
        }
        
        return [];
    }
    
    async saveToIndexedDB(badges, timestamp, checksum) {
        return new Promise((resolve) => {
            try {
                const request = indexedDB.open('HakusanBadges', 1);
                
                request.onerror = () => resolve();
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction(['badges'], 'readwrite');
                    const store = transaction.objectStore('badges');
                    
                    store.put({
                        id: 'current',
                        badges: badges,
                        timestamp: timestamp,
                        checksum: checksum
                    });
                    
                    resolve();
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    db.createObjectStore('badges', { keyPath: 'id' });
                };
            } catch (error) {
                resolve();
            }
        });
    }
}

// UI Manager for enhanced user experience
class UIManager {
    initialize() {
        this.createProgressIndicator();
        this.createVolumeControls();
        this.createCompletionModal();
    }
    
    createProgressIndicator() {
        // 進捗表示の実装は必要に応じて
    }
    
    createVolumeControls() {
        // 音量コントロールの実装は必要に応じて
    }
    
    createCompletionModal() {
        // 完了モーダルの実装は必要に応じて
    }
    
    updateProgress() {
        // 進捗更新の実装は必要に応じて
    }
    
    showCompletionMessage() {
        // 完了メッセージ表示の実装は必要に応じて
    }
}

// Initialize Enhanced Badge System when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // CSSを動的に読み込み
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './badge-effects.css';
    document.head.appendChild(link);
    
    // システムを初期化
    window.enhancedBadgeSystem = new EnhancedBadgeSystem();
});

// Export for global access
window.EnhancedBadgeSystem = EnhancedBadgeSystem;
window.AudioManager = AudioManager;
window.ParticleSystem = ParticleSystem;