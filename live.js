// ========== LIVE PAGE JAVASCRIPT ==========

// ===== ویدیوهای نمونه برای پخش =====
const SAMPLE_VIDEOS = [
    // 6 ویدیوی کوتاه برای پخش در لایوها
    'Film11.mp4',
    'Film12.mp4',
    'Film13.mp4',
    'Film14.mp4',
    'Film15.mp4',
    'Film16.mp4'
];

// ===== داده‌های لایوها =====
const LIVE_STREAMS = [
    {
        id: 1,
        title: 'لایو زهرا از تهران',
        streamer: 'زهرا',
        viewers: 245,
        category: 'کیر میخوام ',
        description: '',
        color: '#f59e0b',
        tags: ['', 'لایو', 'سرگرمی'],
        videoIndex: 0
    },
    {
        id: 2,
        title: 'آوا از مشهد',
        streamer: 'آوا',
        viewers: 180,
        category: 'حضوری پایه ؟',
        description: '',
        color: '#d97706',
        tags: ['جق', 'مشهد', 'زنده'],
        videoIndex: 1
    },
    {
        id: 3,
        title: 'لطیفه از ساری',
        streamer: 'لطیفه',
        viewers: 95,
        category: 'شبی ۱۳۰۰',
        description: '',
        color: '#b45309',
        tags: ['کص', 'ممه', 'ساری'],
        videoIndex: 2
    },
    {
        id: 4,
        title: 'میترا از اصفهان',
        streamer: 'میترا',
        viewers: 320,
        category: 'ساعتی هستم',
        description: '',
        color: '#92400e',
        tags: ['ساعتی', 'میترا', 'سفید'],
        videoIndex: 3
    },
    {
        id: 5,
        title: 'زینب از کرمانشاه',
        streamer: 'زینب',
        viewers: 75,
        category: 'بیا بازی سکسی',
        description: '',
        color: '#f59e0b',
        tags: ['کرمانشاه', 'بازی', 'آرامش'],
        videoIndex: 4
    },
    {
        id: 6,
        title: 'فریبا کیش',
        streamer: 'فریبا',
        viewers: 150,
        category: 'پایه چت سکسی',
        description: '',
        color: '#d97706',
        tags: ['چت', 'فریبا', 'سکس'],
        videoIndex: 5
    }
];

// ===== وضعیت سیستم =====
class LiveSystem {
    constructor() {
        this.isPremium = false;
        this.videoElements = [];
        this.currentStream = null;
        this.observers = [];
        this.isVisible = true;
    }

    // ===== متدهای اصلی =====
    
    // بارگذاری وضعیت از localStorage
    loadPremiumStatus() {
        const premiumStatus = localStorage.getItem('hasPremium');
        this.isPremium = premiumStatus === 'true';
        this.updatePremiumCount();
        return this.isPremium;
    }

    // ذخیره وضعیت پریمیوم
    savePremiumStatus() {
        localStorage.setItem('hasPremium', this.isPremium.toString());
    }

    // به‌روزرسانی شمارنده پریمیوم
    updatePremiumCount() {
        const premiumCountElement = document.getElementById('premiumCount');
        if (premiumCountElement) {
            premiumCountElement.textContent = this.isPremium ? '۱' : '۰';
        }
    }

    // رندر لایوها
    renderLiveStreams() {
        const liveGrid = document.getElementById('liveGrid');
        if (!liveGrid) return;

        liveGrid.innerHTML = '';
        this.videoElements = [];

        LIVE_STREAMS.forEach((stream, index) => {
            const streamCard = this.createLiveStreamCard(stream, index);
            liveGrid.appendChild(streamCard);
        });

        // بعد از رندر، ویدیوها را مدیریت کن
        setTimeout(() => this.manageVideos(), 100);
    }

    // ایجاد کارت لایو
    createLiveStreamCard(stream, index) {
        const card = document.createElement('div');
        card.className = 'live-card';
        if (!this.isPremium) {
            card.classList.add('locked');
        }
        card.dataset.streamId = stream.id;

        card.innerHTML = `
            <div class="live-video-container">
                <video class="live-video" 
                       id="liveVideo${index}" 
                       playsinline 
                       muted 
                       loop
                       preload="metadata">
                    <source src="${SAMPLE_VIDEOS[stream.videoIndex]}" type="video/mp4">
                    مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                </video>
                <div class="live-overlay">
                    <i class="fas fa-lock lock-icon"></i>
                    <div class="lock-text">برای تماشای لایو باید حساب پریمیوم داشته باشید</div>
                </div>
                <div class="live-badge">
                    <i class="fas fa-circle"></i> زنده
                </div>
                <div class="live-viewers">
                    <i class="fas fa-eye"></i> ${stream.viewers.toLocaleString('fa-IR')} بیننده
                </div>
            </div>
            <div class="live-content">
                <h3 class="live-title">${stream.title}</h3>
                <p class="live-streamer"><i class="fas fa-user"></i> ${stream.streamer}</p>
                <p class="live-description">${stream.category} • ۱۰ دقیقه گذشته</p>
                <div class="live-tags">
                    ${stream.tags.map(tag => `<span class="live-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // ذخیره عنصر ویدیو
        const videoElement = card.querySelector(`#liveVideo${index}`);
        if (videoElement) {
            this.videoElements.push({
                element: videoElement,
                streamId: stream.id,
                isPlaying: false,
                isVisible: false,
                stream: stream
            });
        }

        // افزودن event listener
        card.addEventListener('click', (e) => this.handleStreamClick(e, stream));
        
        // برای hover
        card.addEventListener('mouseenter', () => {
            if (this.isPremium && this.isVisible) {
                const videoData = this.videoElements.find(v => v.streamId === stream.id);
                if (videoData && videoData.element.paused) {
                    videoData.element.play().catch(e => console.log('پخش نشد:', e));
                }
            }
        });

        card.addEventListener('mouseleave', () => {
            if (this.isPremium && this.isVisible) {
                const videoData = this.videoElements.find(v => v.streamId === stream.id);
                if (videoData && !videoData.element.paused) {
                    videoData.element.pause();
                }
            }
        });

        return card;
    }

    // مدیریت ویدیوها
    manageVideos() {
        if (!this.isPremium) {
            this.pauseAllVideos();
            return;
        }

        // راه‌اندازی Intersection Observer
        this.setupIntersectionObserver();

        // راه‌اندازی Mutation Observer برای تغییر visibility
        this.setupMutationObserver();

        // تلاش برای پخش ویدیوهای visible
        setTimeout(() => this.playVisibleVideos(), 200);
    }

    // تنظیم Intersection Observer
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const videoId = entry.target.id;
                const videoData = this.videoElements.find(v => v.element.id === videoId);
                
                if (videoData) {
                    videoData.isVisible = entry.isIntersecting;
                    
                    if (this.isPremium && this.isVisible) {
                        if (entry.isIntersecting) {
                            // ویدیو visible شد
                            videoData.element.play().catch(e => {
                                console.log(`ویدیو ${videoId} پخش نشد:`, e);
                            });
                        } else {
                            // ویدیو hidden شد
                            videoData.element.pause();
                        }
                    }
                }
            });
        }, {
            root: null,
            threshold: 0.5
        });

        // مشاهده همه ویدیوها
        this.videoElements.forEach(videoData => {
            observer.observe(videoData.element);
        });

        this.observers.push(observer);
    }

    // تنظیم Mutation Observer
    setupMutationObserver() {
        const observer = new MutationObserver(() => {
            this.checkVisibility();
        });

        observer.observe(document.body, {
            attributes: true,
            childList: false,
            subtree: false
        });

        this.observers.push(observer);
    }

    // بررسی visibility صفحه
    checkVisibility() {
        const isCurrentlyVisible = !document.hidden;
        
        if (this.isVisible !== isCurrentlyVisible) {
            this.isVisible = isCurrentlyVisible;
            
            if (this.isVisible && this.isPremium) {
                // صفحه visible شد
                this.playVisibleVideos();
            } else {
                // صفحه hidden شد
                this.pauseAllVideos();
            }
        }
    }

    // پخش ویدیوهای visible
    playVisibleVideos() {
        if (!this.isPremium || !this.isVisible) return;

        this.videoElements.forEach(videoData => {
            if (videoData.isVisible) {
                videoData.element.play().catch(e => {
                    console.log(`ویدیو ${videoData.element.id} پخش نشد:`, e);
                });
            }
        });
    }

    // توقف همه ویدیوها
    pauseAllVideos() {
        this.videoElements.forEach(videoData => {
            if (videoData.element && !videoData.element.paused) {
                videoData.element.pause();
            }
        });
    }

    // مدیریت کلیک روی لایو
    handleStreamClick(event, stream) {
        // جلوگیری از کلیک روی overlay قفل
        if (event.target.closest('.live-overlay') || 
            event.target.classList.contains('fa-lock') ||
            event.target.classList.contains('lock-text')) {
            event.preventDefault();
            event.stopPropagation();
            this.showPremiumPopup();
            return;
        }

        // اگر کاربر پریمیوم نیست
        if (!this.isPremium) {
            event.preventDefault();
            event.stopPropagation();
            this.showPremiumPopup();
            return;
        }

        // اگر کاربر پریمیوم هست، ویدیو را toggle کن
        const videoData = this.videoElements.find(v => v.streamId === stream.id);
        if (videoData) {
            if (videoData.element.paused) {
                videoData.element.play().catch(e => console.log('پخش نشد:', e));
            } else {
                videoData.element.pause();
            }
        }
    }

    // نمایش پاپ‌آپ پریمیوم
    showPremiumPopup() {
        const popup = document.getElementById('premiumPopup');
        if (popup) {
            popup.style.display = 'flex';
        }
    }

    // بستن پاپ‌آپ پریمیوم
    closePremiumPopup() {
        const popup = document.getElementById('premiumPopup');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    // رفتن به صفحه پریمیوم
    goToPremiumPage() {
        this.closePremiumPopup();
        window.location.href = 'premium.html';
    }

    // ارتقاء به پریمیوم
    upgradeToPremium() {
        this.isPremium = true;
        this.savePremiumStatus();
        this.updatePremiumCount();
        
        // حذف قفل‌ها
        document.querySelectorAll('.live-card.locked').forEach(card => {
            card.classList.remove('locked');
        });
        
        // شروع ویدیوها
        this.manageVideos();
        
        // نمایش پیام موفقیت
        alert('🎉 حساب شما با موفقیت به پریمیوم ارتقاء یافت! حالا می‌توانید تمام لایوها را تماشا کنید.');
    }

    // راه‌اندازی event listeners
    setupEventListeners() {
        // visibility change
        document.addEventListener('visibilitychange', () => this.checkVisibility());
        
        // قبل از بسته شدن صفحه
        window.addEventListener('beforeunload', () => this.pauseAllVideos());
        
        // Escape برای بستن پاپ‌آپ
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePremiumPopup();
            }
        });
        
        // کلیک خارج از پاپ‌آپ برای بستن
        document.addEventListener('click', (e) => {
            const popup = document.getElementById('premiumPopup');
            if (popup && popup.style.display === 'flex' && e.target === popup) {
                this.closePremiumPopup();
            }
        });
        
        // وقتی از صفحه premium برگشتیم
        window.addEventListener('pageshow', (event) => {
            const wasPremium = this.isPremium;
            this.loadPremiumStatus();
            
            if (!wasPremium && this.isPremium) {
                // کاربر تازه پریمیوم شده
                this.upgradeToPremium();
            }
        });
    }

    // شروع سیستم
    initialize() {
        console.log('📡 Initializing Live System...');
        
        // بارگذاری وضعیت
        this.loadPremiumStatus();
        
        // رندر لایوها
        this.renderLiveStreams();
        
        // راه‌اندازی event listeners
        this.setupEventListeners();
        
        console.log('✅ Live System Initialized');
    }

    // پاکسازی
    cleanup() {
        this.pauseAllVideos();
        this.observers.forEach(observer => observer.disconnect());
    }
}

// ===== ایجاد instance از سیستم =====
const liveSystem = new LiveSystem();

// ===== تابع‌های global =====
window.goToPremiumPage = () => liveSystem.goToPremiumPage();
window.closePremiumPopup = () => liveSystem.closePremiumPopup();
window.upgradeToPremium = () => liveSystem.upgradeToPremium();

// ===== راه‌اندازی هنگام لود صفحه =====
document.addEventListener('DOMContentLoaded', () => {
    liveSystem.initialize();
});

// ===== پاکسازی هنگام بسته شدن =====
window.addEventListener('beforeunload', () => {
    liveSystem.cleanup();
});
