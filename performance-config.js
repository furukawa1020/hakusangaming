// Performance Optimization Configuration
// パフォーマンス最適化設定

// Lazy loading configuration
const PERFORMANCE_CONFIG = {
    // 画像遅延読み込み
    lazyLoadImages: true,
    
    // デバウンス時間（ms）
    DEBOUNCE_DELAY: 250,
    
    // スロットル時間（ms）
    THROTTLE_DELAY: 100,
    
    // Intersection Observer設定
    observerOptions: {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    },
    
    // ローカルストレージキャッシュ時間（ms）
    CACHE_DURATION: 5 * 60 * 1000, // 5分
    
    // バッチ処理サイズ
    BATCH_SIZE: 10
};

// Debounce utility
function debounce(func, wait = PERFORMANCE_CONFIG.DEBOUNCE_DELAY) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility
function throttle(func, limit = PERFORMANCE_CONFIG.THROTTLE_DELAY) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// LocalStorage with expiration
const CachedStorage = {
    set(key, value, ttl = PERFORMANCE_CONFIG.CACHE_DURATION) {
        const item = {
            value: value,
            expiry: Date.now() + ttl
        };
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            logger.error('LocalStorage write error:', e);
        }
    },
    
    get(key) {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;
            
            const item = SecurityUtils.safeJSONParse(itemStr, null);
            if (!item) return null;
            
            // Check expiration
            if (Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            
            return item.value;
        } catch (e) {
            logger.error('LocalStorage read error:', e);
            return null;
        }
    }
};

// Lazy load images with Intersection Observer
function initLazyLoading() {
    if (!PERFORMANCE_CONFIG.lazyLoadImages) return;
    
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, PERFORMANCE_CONFIG.observerOptions);
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// DOM Ready optimization
function onDOMReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Request Animation Frame utility
const rafThrottle = (callback) => {
    let requestId = null;
    
    return function(...args) {
        if (requestId === null) {
            requestId = requestAnimationFrame(() => {
                requestId = null;
                callback.apply(this, args);
            });
        }
    };
};

// Batch DOM updates
function batchDOMUpdates(updates) {
    requestAnimationFrame(() => {
        updates.forEach(update => update());
    });
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.PerformanceUtils = {
        debounce,
        throttle,
        CachedStorage,
        initLazyLoading,
        onDOMReady,
        rafThrottle,
        batchDOMUpdates,
        CONFIG: PERFORMANCE_CONFIG
    };
}
