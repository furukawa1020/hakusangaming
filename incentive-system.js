// Advanced Incentive System for Hakusan Badge Quest
// 観光客爆売れシステム

class IncentiveSystem {
    constructor() {
        this.achievements = [];
        this.unlockedContent = [];
        this.stats = {
            totalVisitors: 0,
            badgesCollected: 0,
            completionRate: 0,
            averageTime: 0,
            socialShares: 0
        };
        
        this.badgeRarities = {
            'oguchi': 'rare',        // 尾口 - レア
            'kawachi': 'uncommon',   // 河内 - アンコモン  
            'mattou': 'common',      // 松任 - コモン
            'mikawa': 'uncommon',    // 美川 - アンコモン
            'shiramine': 'legendary', // 白峰 - レジェンダリー（白山）
            'torigoe': 'rare',       // 鳥越 - レア
            'tsurugi': 'uncommon',   // 鶴来 - アンコモン
            'yoshinodani': 'rare'    // 吉野谷 - レア
        };
        
        this.secretContent = {
            'first_badge': '隠された温泉マップ解放',
            'half_complete': '白山伝説ストーリー解放',
            'all_badges': '伝説のフォトスポット解放'
        };
        
        this.limitedEvents = [];  // 追加：期間限定イベント配列
        
        this.init();
    }

    init() {
        this.loadStats();
        this.loadAchievements();
        this.loadUnlockedContent();  // 追加：保存されたアンロックコンテンツを読み込む
        this.startLiveCounter();
        this.setupEventListeners();
        this.createPermanentUI();
        
        // 初期化後すぐにコンテンツ表示を更新
        setTimeout(() => {
            this.updateSecretContentDisplay();
            this.checkLimitedEvents();  // 期間限定イベントチェック
        }, 100);
    }

    // ===========================================
    // CORE ACHIEVEMENT SYSTEM
    // ===========================================
    
    unlockAchievement(achievementId, title, description, icon = '🏆') {
        if (this.achievements.includes(achievementId)) return;
        
        this.achievements.push(achievementId);
        this.saveAchievements();
        
        // Show achievement popup
        this.showAchievementPopup(title, description, icon);
        
        // Check for secret content unlock
        this.checkSecretContentUnlock(achievementId);
        
        // Update stats
        this.updateStats();
        
        // Trigger confetti effect
        this.triggerConfetti();
    }

    showAchievementPopup(title, description, icon) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        
        popup.innerHTML = `
            <span class="achievement-icon">${icon}</span>
            <div class="achievement-text">
                <div><strong>実績解放！</strong></div>
                <div>${title}</div>
                <div style="font-size: 0.8rem; opacity: 0.8;">${description}</div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Play achievement sound (if available)
        this.playAchievementSound();
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            popup.style.animation = 'achievementSlide 0.5s ease reverse';
            setTimeout(() => popup.remove(), 500);
        }, 5000);
    }

    // ===========================================
    // SECRET CONTENT SYSTEM
    // ===========================================
    
    checkSecretContentUnlock(trigger) {
        const badges = this.getBadges();
        
        // First badge unlock
        if (badges.length === 1 && !this.unlockedContent.includes('hot_springs')) {
            this.unlockSecretContent('hot_springs', '🌸 隠された温泉マップ', 
                '白山の秘湯スポットが解放されました！地元の人だけが知る温泉情報をゲット！');
        }
        
        // Half completion
        if (badges.length === 4 && !this.unlockedContent.includes('legend_story')) {
            this.unlockSecretContent('legend_story', '📜 白山伝説ストーリー', 
                '白山に眠る古代の伝説が明かされます。この土地の神秘的な歴史を発見！');
        }
        
        // All badges
        if (badges.length === 8 && !this.unlockedContent.includes('photo_spots')) {
            this.unlockSecretContent('photo_spots', '📸 伝説のフォトスポット', 
                'インスタ映え確実！地元カメラマンが厳選した絶景スポットを大公開！');
        }
    }

    unlockSecretContent(contentId, title, description) {
        this.unlockedContent.push(contentId);
        this.saveUnlockedContent();
        
        // Create unlock notification
        this.showSecretUnlockNotification(title, description);
        
        // Update UI to show unlocked content
        this.updateSecretContentDisplay();
        
        // Achievement for unlocking secret content
        this.unlockAchievement(`secret_${contentId}`, `秘密発見！`, `${title}を解放しました`, '🔓');
    }

    showSecretUnlockNotification(title, description) {
        const notification = document.createElement('div');
        notification.className = 'secret-unlock-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #8e44ad, #9b59b6);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            text-align: center;
            border: 3px solid #f1c40f;
            animation: secretAppear 0.8s ease;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔓</div>
            <h3 style="margin: 0 0 1rem 0; font-family: 'Orbitron', sans-serif;">秘密コンテンツ解放！</h3>
            <h4 style="margin: 0 0 1rem 0; color: #f1c40f;">${title}</h4>
            <p style="margin: 0 0 1.5rem 0; opacity: 0.9;">${description}</p>
            <button onclick="this.parentElement.remove()" style="
                background: #f1c40f;
                color: #2c3e50;
                border: none;
                padding: 1rem 2rem;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                font-family: 'Orbitron', sans-serif;
                text-transform: uppercase;
            ">確認</button>
        `;
        
        document.body.appendChild(notification);
        
        // Add animation styles
        if (!document.querySelector('#secret-animations')) {
            const style = document.createElement('style');
            style.id = 'secret-animations';
            style.textContent = `
                @keyframes secretAppear {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3) rotate(-180deg); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===========================================
    // SOCIAL SHARING SYSTEM
    // ===========================================
    
    createShareSection() {
        const badges = this.getBadges();
        if (badges.length === 0) return '';
        
        const completionPercent = Math.round((badges.length / 8) * 100);
        
        return `
            <div class="share-section">
                <h3>🌟 冒険をシェアしよう！ 🌟</h3>
                <p>ハクサンリーグで${badges.length}個のバッジを獲得！<br>完成度 ${completionPercent}% 達成中！</p>
                <div class="share-buttons">
                    <button class="share-btn twitter" onclick="incentiveSystem.shareToTwitter()">
                        🐦 Twitterでシェア
                    </button>
                    <button class="share-btn facebook" onclick="incentiveSystem.shareToFacebook()">
                        📘 Facebookでシェア
                    </button>
                    <button class="share-btn instagram" onclick="incentiveSystem.shareToInstagram()">
                        📷 Instagramでシェア
                    </button>
                    <button class="share-btn line" onclick="incentiveSystem.shareToLine()">
                        💬 LINEでシェア
                    </button>
                </div>
            </div>
        `;
    }

    shareToTwitter() {
        const badges = this.getBadges();
        const text = `🏔️ ハクサンリーグで${badges.length}/8個のジムバッジを獲得！白山市の魅力を再発見中✨ #ハクサンリーグ #白山市 #NFCバッジラリー #石川観光`;
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        this.trackSocialShare('twitter');
    }

    shareToFacebook() {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        this.trackSocialShare('facebook');
    }

    shareToInstagram() {
        // Instagram doesn't have direct URL sharing, so we copy text to clipboard
        const badges = this.getBadges();
        const text = `🏔️ ハクサンリーグで${badges.length}/8個のジムバッジを獲得！白山市の魅力を再発見中✨\n\n#ハクサンリーグ #白山市 #NFCバッジラリー #石川観光`;
        navigator.clipboard.writeText(text).then(() => {
            alert('📷 Instagram用のテキストをコピーしました！\nInstagramを開いて投稿してください。');
        });
        this.trackSocialShare('instagram');
    }

    shareToLine() {
        const badges = this.getBadges();
        const text = `🏔️ ハクサンリーグで${badges.length}/8個のジムバッジを獲得！白山市の魅力を再発見中✨`;
        const url = window.location.href;
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        this.trackSocialShare('line');
    }

    trackSocialShare(platform) {
        this.stats.socialShares++;
        this.saveStats();
        
        // Achievement for first share
        if (this.stats.socialShares === 1) {
            this.unlockAchievement('first_share', 'SNSデビュー！', '初めて冒険をシェアしました', '📱');
        }
        
        // Achievement for multiple shares
        if (this.stats.socialShares >= 5) {
            this.unlockAchievement('social_butterfly', 'SNSマスター', '5回以上シェアしました', '🦋');
        }
    }

    // ===========================================
    // LIVE STATISTICS SYSTEM
    // ===========================================
    
    startLiveCounter() {
        this.updateLiveStats();
        setInterval(() => this.updateLiveStats(), 30000); // Update every 30 seconds
    }

    updateLiveStats() {
        // Real user data only - no fake numbers
        const badges = this.getBadges();
        this.stats.badgesCollected = badges.length;
        this.stats.completionRate = Math.round((badges.length / 8) * 100);
        this.stats.totalVisitors = 0; // Will be updated with real data when available
        
        this.updateLiveCounterDisplay();
    }

    updateLiveCounterDisplay() {
        let counter = document.querySelector('.live-counter');
        if (!counter) return;
        
        counter.innerHTML = `
            <div class="counter-title">� 開発統計</div>
            <div class="counter-number">${this.stats.totalVisitors}</div>
            <div style="font-size: 0.7rem; opacity: 0.7;">現在のテストユーザー数</div>
            <hr style="margin: 0.5rem 0; border-color: rgba(255,255,255,0.3);">
            <div style="font-size: 0.8rem;">あなたの進捗: ${this.stats.completionRate}%</div>
            <div style="font-size: 0.6rem; opacity: 0.5; margin-top: 0.3rem;">※実運用時は実データに更新</div>
        `;
    }

    createStatsSection() {
        const badges = this.getBadges();
        const startTime = localStorage.getItem('quest_start_time');
        let elapsedTime = '計測中...';
        
        if (startTime) {
            const elapsed = (Date.now() - parseInt(startTime)) / (1000 * 60);
            if (elapsed < 60) {
                elapsedTime = `${Math.round(elapsed)}分`;
            } else if (elapsed < 1440) {
                const hours = Math.floor(elapsed / 60);
                const minutes = Math.round(elapsed % 60);
                elapsedTime = `${hours}時間${minutes}分`;
            } else {
                const days = Math.floor(elapsed / 1440);
                const hours = Math.floor((elapsed % 1440) / 60);
                elapsedTime = `${days}日${hours}時間`;
            }
        } else {
            // 初回訪問時にタイムスタンプを記録
            localStorage.setItem('quest_start_time', Date.now().toString());
            elapsedTime = '0分';
        }
        
        // 推定完了時間を計算
        let estimatedCompletion = '';
        if (badges.length > 0 && badges.length < 8) {
            const avgTimePerBadge = elapsed / badges.length;
            const remainingBadges = 8 - badges.length;
            const estimatedMinutes = Math.round(avgTimePerBadge * remainingBadges);
            
            if (estimatedMinutes < 60) {
                estimatedCompletion = `<div class="stat-card">
                    <div class="stat-number">約${estimatedMinutes}分</div>
                    <div class="stat-label">完了まで予測</div>
                </div>`;
            } else {
                const estHours = Math.floor(estimatedMinutes / 60);
                const estMins = Math.round(estimatedMinutes % 60);
                estimatedCompletion = `<div class="stat-card">
                    <div class="stat-number">約${estHours}h${estMins}m</div>
                    <div class="stat-label">完了まで予測</div>
                </div>`;
            }
        }
        
        return `
            <div class="stats-dashboard">
                <div class="stat-card">
                    <div class="stat-number">${badges.length}</div>
                    <div class="stat-label">獲得バッジ数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${Math.round((badges.length / 8) * 100)}%</div>
                    <div class="stat-label">完成度</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${elapsedTime}</div>
                    <div class="stat-label">プレイ時間</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${this.achievements.length}</div>
                    <div class="stat-label">実績数</div>
                </div>
                ${estimatedCompletion}
            </div>
        `;
    }

    // ===========================================
    // LIMITED TIME EVENTS
    // ===========================================
    
    checkLimitedEvents() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        // Weekend bonus event
        if (day === 0 || day === 6) {
            this.addLimitedEvent('weekend_bonus', '週末ダブルポイント！', '土日限定で全ての実績が2倍効果！', '2024-12-31');
        }
        
        // Golden hour event (sunset time)
        if (hour >= 17 && hour <= 19) {
            this.addLimitedEvent('golden_hour', 'ゴールデンアワー特典', '夕方限定！フォトスポットで特別な光景が見れるかも', '2024-12-31');
        }
        
        this.displayLimitedEvents();
    }

    addLimitedEvent(id, title, description, endDate) {
        if (this.limitedEvents.find(e => e.id === id)) return;
        
        this.limitedEvents.push({
            id,
            title,
            description,
            endDate: new Date(endDate)
        });
    }

    displayLimitedEvents() {
        this.limitedEvents.forEach(event => {
            if (new Date() > event.endDate) return;
            
            const eventElement = document.createElement('div');
            eventElement.className = 'limited-event';
            eventElement.innerHTML = `
                <h4>⚡ ${event.title}</h4>
                <p>${event.description}</p>
                <div class="event-timer">期間限定開催中！</div>
            `;
            
            // Insert after header
            const header = document.querySelector('header');
            if (header && header.nextSibling) {
                header.parentNode.insertBefore(eventElement, header.nextSibling);
            }
        });
    }

    // ===========================================
    // UI CREATION AND MANAGEMENT
    // ===========================================
    
    createPermanentUI() {
        // Add live counter
        const liveCounter = document.createElement('div');
        liveCounter.className = 'live-counter';
        document.body.appendChild(liveCounter);
        this.updateLiveCounterDisplay();
        
        // Add incentive CSS if not already added
        if (!document.querySelector('#incentive-styles')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'incentive-system.css';
            link.id = 'incentive-styles';
            document.head.appendChild(link);
        }
    }

    updateAllIncentiveElements() {
        // Update share section
        const shareContainer = document.querySelector('.share-container');
        if (shareContainer) {
            shareContainer.innerHTML = this.createShareSection();
        }
        
        // Update stats
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = this.createStatsSection();
        }
        
        // Update secret content
        this.updateSecretContentDisplay();
        
        // Update rewards display
        this.updateRewardsDisplay();
        
        // Trigger external update if available
        if (window.updateIncentiveContent) {
            window.updateIncentiveContent();
        }
    }
    
    updateRewardsDisplay() {
        const badges = this.getBadges();
        const badgeCount = badges.length;
        
        // 報酬アイテムを更新
        document.querySelectorAll('.reward-item').forEach(item => {
            const required = parseInt(item.dataset.required);
            const statusElement = item.querySelector('.reward-status');
            
            if (badgeCount >= required) {
                item.classList.add('unlocked');
                if (statusElement) {
                    statusElement.innerHTML = '<img src="icons/ui/checkmark.svg" alt="チェック" class="icon-inline"> 獲得可能！';
                }
            } else {
                item.classList.remove('unlocked');
                if (statusElement) {
                    statusElement.innerHTML = `<img src="icons/ui/lock.svg" alt="ロック" class="icon-inline"> ${required}個で解放`;
                }
            }
        });
    }

    // ===========================================
    // EVENT LISTENERS AND GAME INTEGRATION
    // ===========================================
    
    setupEventListeners() {
        // Listen for badge acquisitions
        window.addEventListener('badgeAcquired', (event) => {
            const { gymId, badgeName } = event.detail;
            this.onBadgeAcquired(gymId, badgeName);
        });
        
        // Start quest timer on first visit
        if (!localStorage.getItem('quest_start_time')) {
            localStorage.setItem('quest_start_time', Date.now().toString());
        }
    }

    onBadgeAcquired(gymId, badgeName) {
        const rarity = this.badgeRarities[gymId];
        
        // Rarity-based achievements
        this.unlockAchievement(`badge_${gymId}`, `${badgeName}獲得！`, `${rarity}バッジを手に入れました`, this.getRarityIcon(rarity));
        
        // Collection milestones
        const badgeCount = this.getBadges().length;
        if (badgeCount === 1) {
            this.unlockAchievement('first_badge', 'ファーストステップ！', '初めてのバッジを獲得', '🥇');
        } else if (badgeCount === 4) {
            this.unlockAchievement('half_way', 'ハーフウェイ！', '半分のバッジを獲得', '🏃‍♂️');
        } else if (badgeCount === 8) {
            this.unlockAchievement('grand_master', 'グランドマスター！', '全てのバッジを獲得', '👑');
        }
        
        // Rarity collection achievements
        const rareBadges = this.getBadges().filter(b => this.badgeRarities[b] === 'rare').length;
        if (rareBadges >= 2) {
            this.unlockAchievement('rare_collector', 'レアコレクター', '2個以上のレアバッジを獲得', '💎');
        }
        
        if (this.badgeRarities[gymId] === 'legendary') {
            this.unlockAchievement('legend_hunter', 'レジェンドハンター', 'レジェンダリーバッジを獲得', '🐉');
        }
        
        this.updateAllIncentiveElements();
    }

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================
    
    getBadges() {
        const saved = localStorage.getItem('hakusan_badges');
        return saved ? JSON.parse(saved) : [];
    }

    getRarityIcon(rarity) {
        const icons = {
            'legendary': '🐉',
            'rare': '💎', 
            'uncommon': '🌟',
            'common': '⭐'
        };
        return icons[rarity] || '🏅';
    }

    triggerConfetti() {
        // Simple confetti effect using emoji
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.innerHTML = ['🎉', '✨', '🌟', '🎊'][Math.floor(Math.random() * 4)];
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 9999;
                animation: confettiFall ${Math.random() * 2 + 1}s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
        
        // Add confetti animation if not exists
        if (!document.querySelector('#confetti-animations')) {
            const style = document.createElement('style');
            style.id = 'confetti-animations';
            style.textContent = `
                @keyframes confettiFall {
                    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    playAchievementSound() {
        // Create a simple audio notification (if browser supports it)
        if (typeof Audio !== 'undefined') {
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSKBzvLZiDYIF2i88OWhSwgOU6Jq7Btu');
                audio.volume = 0.1;
                audio.play().catch(() => {}); // Ignore errors if audio can't play
            } catch (e) {
                // Audio not supported or blocked
            }
        }
    }

    // ===========================================
    // DATA PERSISTENCE
    // ===========================================
    
    saveStats() {
        localStorage.setItem('hakusan_stats', JSON.stringify(this.stats));
    }

    loadStats() {
        const saved = localStorage.getItem('hakusan_stats');
        if (saved) {
            this.stats = { ...this.stats, ...JSON.parse(saved) };
        }
    }

    saveAchievements() {
        localStorage.setItem('hakusan_achievements', JSON.stringify(this.achievements));
    }

    loadAchievements() {
        const saved = localStorage.getItem('hakusan_achievements');
        if (saved) {
            this.achievements = JSON.parse(saved);
        }
    }

    saveUnlockedContent() {
        localStorage.setItem('hakusan_unlocked_content', JSON.stringify(this.unlockedContent));
    }

    loadUnlockedContent() {
        const saved = localStorage.getItem('hakusan_unlocked_content');
        if (saved) {
            this.unlockedContent = JSON.parse(saved);
        }
    }

    updateStats() {
        const badges = this.getBadges();
        this.stats.badgesCollected = badges.length;
        this.stats.completionRate = Math.round((badges.length / 8) * 100);
        this.saveStats();
    }

    updateSecretContentDisplay() {
        // Update any secret content areas to show unlocked status
        document.querySelectorAll('.secret-content').forEach(element => {
            const contentId = element.dataset.contentId;
            if (contentId && this.unlockedContent.includes(contentId)) {
                element.classList.add('unlocked');
                
                // ロックコンテンツを非表示、アンロックコンテンツを表示
                const lockedContent = element.querySelector('.locked-content');
                const unlockedContent = element.querySelector('.unlocked-content');
                const unlockRequirement = element.querySelector('.unlock-requirement');
                
                if (lockedContent) {
                    lockedContent.style.display = 'none';
                }
                if (unlockedContent) {
                    unlockedContent.style.display = 'block';
                }
                if (unlockRequirement) {
                    unlockRequirement.style.display = 'none';
                }
            } else {
                element.classList.remove('unlocked');
                
                // ロックコンテンツを表示、アンロックコンテンツを非表示
                const lockedContent = element.querySelector('.locked-content');
                const unlockedContent = element.querySelector('.unlocked-content');
                const unlockRequirement = element.querySelector('.unlock-requirement');
                
                if (lockedContent) {
                    lockedContent.style.display = 'block';
                }
                if (unlockedContent) {
                    unlockedContent.style.display = 'none';
                }
                if (unlockRequirement) {
                    unlockRequirement.style.display = 'block';
                }
            }
        });
    }
}

// Initialize the incentive system
let incentiveSystem;
document.addEventListener('DOMContentLoaded', () => {
    incentiveSystem = new IncentiveSystem();
    
    // Make it globally accessible for debugging
    window.incentiveSystem = incentiveSystem;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncentiveSystem;
}
