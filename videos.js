// ========== VIDEOS PAGE JAVASCRIPT ==========

// Data Model
const VideosData = {
    videos: [
        {
            id: 1,
            title: '',
            duration: '5:42',
            views: 2450,
            category: '',
            uploader: 'محمد',
            date: '۲ روز پیش',
            color: '#ef4444',
            description: 'در این ویدیو با انیمیشن‌های پیشرفته CSS آشنا می‌شوید و نحوه ایجاد ترانزیشن‌های حرفه‌ای را یاد می‌گیرید.',
            videoUrl: 'Film17.mp4',
            previewUrl: 'Film17.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop&q=80',
            isPremium: false,
            isFreeVideo: true
        },
        {
            id: 2,
            title: '',
            duration: '8:20',
            views: 12500,
            category: '',
            uploader: 'زهرا',
            date: 'امروز',
            color: '#dc2626',
            description: 'تماشای گل‌های برتر هفته از لیگ برتر فوتبال با بهترین کیفیت و زوایای مختلف.',
            videoUrl: 'Film18.mp4',
            previewUrl: 'Film18.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=225&fit=crop&q=80',
            isPremium: true,
            isFreeVideo: false
        },
        {
            id: 3,
            title: '',
            duration: '6:18',
            views: 3200,
            category: '',
            uploader: 'عسل',
            date: '۳ روز پیش',
            color: '#b91c1c',
            description: '',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            previewUrl: 'Film19.mp4',
            thumbnail: 'Film19.mp4',
            isPremium: true,
            isFreeVideo: false
        },
        {
            id: 4,
            title: '',
            duration: '4:15',
            views: 5800,
            category: '',
            uploader: 'نرگس',
            date: '۱ هفته پیش',
            color: '#991b1b',
            description: '',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            previewUrl: 'Film20.mp44',
            thumbnail: 'Film20.mp4',
            isPremium: true,
            isFreeVideo: false
        }
    ]
};

// State Management
const VideosState = {
    totalViews: 38450,
    watchedCount: 0,
    watchedVideos: [],
    currentVideo: null,
    isPremium: false,
    freeVideoUsed: false,
    videoProgress: {},
    playerInitialized: false,
    previewObservers: [],
    previewVideos: new Map()
};

// DOM Elements
const VideosElements = {
    videosGrid: document.getElementById('videosGrid'),
    videoPlayerModal: document.getElementById('videoPlayerModal'),
    mainVideoPlayer: document.getElementById('mainVideoPlayer'),
    videoSource: document.getElementById('videoSource'),
    playerTitle: document.getElementById('playerTitle'),
    playerViews: document.getElementById('playerViews'),
    playerDuration: document.getElementById('playerDuration'),
    playerDate: document.getElementById('playerDate'),
    playerDescription: document.getElementById('playerDescription'),
    watchedCount: document.getElementById('watchedCount'),
    remainingVideos: document.getElementById('remainingVideos'),
    totalViews: document.getElementById('totalViews'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    freeVideoStatus: document.getElementById('freeVideoStatus'),
    videoLoading: document.getElementById('videoLoading'),
    videoError: document.getElementById('videoError')
};

// ========== توابع اصلی ==========

// Initialize Videos Page
function initializeVideosPage() {
    console.log('🎬 Initializing Videos Page...');
    
    // Load state from localStorage
    loadVideoState();
    
    // Update watched count
    updateWatchedVideos();
    
    // Render videos
    renderVideos();
    
    // Update progress
    updateProgressBar();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check if user returned from premium page
    checkPremiumPurchase();
    
    console.log('✅ Videos Page Initialized');
}

// Load video state from localStorage
function loadVideoState() {
    try {
        // Load watched videos
        const savedWatched = localStorage.getItem('watchedVideos');
        VideosState.watchedVideos = savedWatched ? JSON.parse(savedWatched) : [];
        
        // Load video progress
        const savedProgress = localStorage.getItem('videoProgress');
        VideosState.videoProgress = savedProgress ? JSON.parse(savedProgress) : {};
        
        // Load premium status
        VideosState.isPremium = localStorage.getItem('hasPremium') === 'true';
        
        // Load free video status
        VideosState.freeVideoUsed = localStorage.getItem('freeVideoUsed') === 'true';
        
        // Apply progress to videos
        VideosData.videos.forEach(video => {
            video.watched = VideosState.watchedVideos.includes(video.id);
            video.progress = VideosState.videoProgress[video.id] || 0;
        });
        
        console.log('📁 Loaded state from localStorage');
    } catch (error) {
        console.error('❌ Error loading state:', error);
        // Reset to defaults
        VideosState.watchedVideos = [];
        VideosState.videoProgress = {};
        VideosState.isPremium = false;
        VideosState.freeVideoUsed = false;
    }
}

// Save video state to localStorage
function saveVideoState() {
    try {
        localStorage.setItem('watchedVideos', JSON.stringify(VideosState.watchedVideos));
        localStorage.setItem('videoProgress', JSON.stringify(VideosState.videoProgress));
        localStorage.setItem('freeVideoUsed', VideosState.freeVideoUsed);
        
        console.log('💾 Saved state to localStorage');
    } catch (error) {
        console.error('❌ Error saving state:', error);
    }
}

// Update watched videos
function updateWatchedVideos() {
    VideosState.watchedCount = VideosState.watchedVideos.length;
    
    // Update UI
    if (VideosElements.watchedCount) {
        VideosElements.watchedCount.textContent = VideosState.watchedCount.toLocaleString('fa-IR');
    }
    
    // Calculate remaining videos
    let remaining = 0;
    if (VideosState.isPremium) {
        remaining = VideosData.videos.length - VideosState.watchedVideos.length;
    } else {
        const freeVideo = VideosData.videos.find(v => v.isFreeVideo);
        const freeVideoWatched = freeVideo ? freeVideo.watched : false;
        
        if (freeVideoWatched) {
            remaining = 0;
        } else {
            remaining = 1;
        }
    }
    
    if (VideosElements.remainingVideos) {
        VideosElements.remainingVideos.textContent = remaining.toLocaleString('fa-IR');
        
        if (remaining === 0 && !VideosState.isPremium) {
            VideosElements.remainingVideos.style.color = '#ef4444';
        } else {
            VideosElements.remainingVideos.style.color = '';
        }
    }
    
    // Update total views
    if (VideosElements.totalViews) {
        VideosElements.totalViews.textContent = VideosState.totalViews.toLocaleString('fa-IR');
    }
}

// Update progress bar
function updateProgressBar() {
    if (!VideosElements.progressBar || !VideosElements.progressText || !VideosElements.freeVideoStatus) return;
    
    const freeVideo = VideosData.videos.find(v => v.isFreeVideo);
    const watchedFreeVideo = freeVideo ? freeVideo.watched : false;
    
    const percentage = watchedFreeVideo ? 100 : 0;
    
    VideosElements.progressBar.style.width = `${percentage}%`;
    VideosElements.progressText.textContent = watchedFreeVideo ? '۱ از ۱' : '۰ از ۱';
    
    // Update free video status
    if (VideosState.isPremium) {
        VideosElements.freeVideoStatus.innerHTML = '<span style="color: #10b981;">اکانت پریمیوم</span>';
        VideosElements.freeVideoStatus.style.color = '#10b981';
    } else if (watchedFreeVideo) {
        VideosElements.freeVideoStatus.innerHTML = '<span style="color: #ef4444;">ویدیوی رایگان استفاده شد</span>';
        VideosElements.freeVideoStatus.style.color = '#ef4444';
    } else {
        VideosElements.freeVideoStatus.innerHTML = '<span style="color: #10b981;">ویدیوی رایگان آماده است</span>';
        VideosElements.freeVideoStatus.style.color = '#10b981';
    }
}

// Render Videos
function renderVideos() {
    if (!VideosElements.videosGrid) return;
    
    VideosElements.videosGrid.innerHTML = '';
    
    // Clean up previous observers and videos
    cleanupPreviewVideos();
    
    // Sort videos: free video first
    const sortedVideos = [...VideosData.videos].sort((a, b) => {
        if (a.isFreeVideo && !b.isFreeVideo) return -1;
        if (!a.isFreeVideo && b.isFreeVideo) return 1;
        return 0;
    });
    
    sortedVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        VideosElements.videosGrid.appendChild(videoCard);
    });
    
    // Setup auto preview after cards are rendered
    setTimeout(() => {
        setupAutoPreview();
        startAllPreviews();
    }, 500);
}

// Create Video Card
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.dataset.videoId = video.id;
    
    // Check if video is locked
    let isLocked = false;
    
    if (VideosState.isPremium) {
        isLocked = false;
    } else {
        if (video.isFreeVideo) {
            isLocked = VideosState.freeVideoUsed && !video.watched;
        } else {
            isLocked = true;
        }
    }
    
    const isWatched = video.watched;
    const progress = video.progress || 0;
    
    if (isLocked) {
        card.classList.add('locked');
    }
    
    card.innerHTML = `
        <div class="video-thumbnail">
            <img class="video-poster" 
                 src="${video.thumbnail}" 
                 alt="${video.title}"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/400x225/0f172a/94a3b8?text=ویدیو'">
            
            <video class="video-preview" 
                   muted 
                   loop
                   playsinline
                   preload="auto">
                <source src="${video.previewUrl}" type="video/mp4">
            </video>
            
            <div class="video-overlay"></div>
            
            ${video.isFreeVideo ? `
                <div class="free-badge" style="background: ${isWatched ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}; color: ${isWatched ? '#ef4444' : '#10b981'};">
                    <i class="fas ${isWatched ? 'fa-eye' : 'fa-unlock'}"></i>
                    ${isWatched ? 'استفاده شده' : 'رایگان'}
                </div>
            ` : ''}
            
            ${isWatched && !video.isFreeVideo ? `
                <div class="video-watched-badge">
                    <i class="fas fa-check-circle"></i>
                    تماشا شده
                </div>
            ` : ''}
            
            ${isLocked ? `
                <div class="lock-icon">
                    <i class="fas fa-lock"></i>
                </div>
            ` : `
                <button class="play-btn" onclick="handlePlayClick(event, ${video.id})">
                    <i class="fas fa-play"></i>
                </button>
            `}
            
            ${!video.isFreeVideo ? `
                <div class="premium-badge">
                    <i class="fas fa-crown"></i>
                    پریمیوم
                </div>
            ` : ''}
            
            ${progress > 0 && progress < 100 ? `
                <div class="video-progress-bar">
                    <div class="video-progress-fill" style="width: ${progress}%"></div>
                </div>
            ` : ''}
            
            <div class="video-duration">
                ${video.duration}
            </div>
        </div>
        <div class="video-content">
            <h3 class="video-title">${video.title}</h3>
            <div class="video-meta">
                <span><i class="fas fa-eye"></i> ${video.views.toLocaleString('fa-IR')}</span>
                <span><i class="fas fa-user"></i> ${video.uploader}</span>
                <span><i class="fas fa-clock"></i> ${video.date}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Clean up preview videos
function cleanupPreviewVideos() {
    // توقف و حذف همه ویدیوهای قبلی
    VideosState.previewVideos.forEach((video, cardId) => {
        if (video && video.pause) {
            video.pause();
            video.src = '';
            video.load();
        }
    });
    
    VideosState.previewVideos.clear();
    
    // غیرفعال کردن همه observers
    VideosState.previewObservers.forEach(observer => {
        observer.disconnect();
    });
    VideosState.previewObservers = [];
}

// Setup Auto Preview System
function setupAutoPreview() {
    const videoCards = document.querySelectorAll('.video-card:not(.locked)');
    
    videoCards.forEach((card, index) => {
        const videoId = card.dataset.videoId;
        const preview = card.querySelector('.video-preview');
        
        if (!preview) return;
        
        // ذخیره ویدیو برای مدیریت بعدی
        VideosState.previewVideos.set(videoId, preview);
        
        // تنظیمات پیش‌نمایش
        preview.muted = true;
        preview.loop = true;
        preview.playsInline = true;
        
        // پیش‌بارگیری ویدیو
        preloadVideo(preview);
        
        // تأخیر برای شروع پخش
        setTimeout(() => {
            startPreview(videoId);
        }, index * 300);
    });
}

// Preload video
function preloadVideo(videoElement) {
    videoElement.load();
    
    videoElement.addEventListener('loadeddata', function() {
        console.log('✅ Preview video loaded');
    });
    
    videoElement.addEventListener('error', function(e) {
        console.error('❌ Preview video error:', e);
    });
}

// Start all previews
function startAllPreviews() {
    VideosState.previewVideos.forEach((preview, videoId) => {
        startPreview(videoId);
    });
}

// Start individual preview
function startPreview(videoId) {
    const preview = VideosState.previewVideos.get(videoId);
    if (!preview) return;
    
    try {
        const playPromise = preview.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                preview.classList.add('playing');
                console.log(`▶️ Preview started for video ${videoId}`);
            }).catch(error => {
                console.log(`⚠️ Preview autoplay prevented for video ${videoId}:`, error);
            });
        }
    } catch (error) {
        console.error(`❌ Error starting preview for video ${videoId}:`, error);
    }
}

// Handle Play Click
function handlePlayClick(event, videoId) {
    event.stopPropagation();
    event.preventDefault();
    
    const video = VideosData.videos.find(v => v.id === videoId);
    if (!video) return;
    
    console.log('▶️ Playing video:', video.title);
    
    // Check if user can play this video
    if (VideosState.isPremium) {
        playVideo(video);
        return;
    }
    
    // Free user logic
    if (video.isFreeVideo) {
        if (VideosState.freeVideoUsed && !video.watched) {
            // اگر ویدیوی رایگان قبلاً استفاده شده، مستقیم به صفحه پریمیوم هدایت کن
            showPremiumPopupAndRedirect('ویدیوی رایگان شما قبلاً تماشا شده است. برای تماشای ویدیوهای بیشتر، اکانت خود را به پریمیوم ارتقاء دهید.');
        } else {
            playVideo(video);
        }
    } else {
        // اگر کاربر سعی کند ویدیوی پریمیوم را ببیند، مستقیم به صفحه پریمیوم هدایت کن
        showPremiumPopupAndRedirect('این ویدیو فقط برای کاربران پریمیوم قابل دسترسی است. اکانت خود را ارتقاء دهید.');
    }
}

// Show Premium Popup and Redirect to Premium Page
function showPremiumPopupAndRedirect(message) {
    // اول پاپ‌آپ را نشان بده
    showPremiumPopup(message);
    
    // بعد از 3 ثانیه به صفحه پریمیوم هدایت کن
    setTimeout(() => {
        goToPremiumPage();
    }, 3000);
}

// Play Video
function playVideo(video) {
    VideosState.currentVideo = video;
    
    // Show loading
    showVideoLoading(true);
    showVideoError(false);
    
    // Set video source
    VideosElements.videoSource.src = video.videoUrl;
    VideosElements.mainVideoPlayer.load();
    
    // Update player info
    VideosElements.playerTitle.textContent = video.title;
    VideosElements.playerViews.textContent = video.views.toLocaleString('fa-IR');
    VideosElements.playerDuration.textContent = video.duration;
    VideosElements.playerDate.textContent = video.date;
    VideosElements.playerDescription.textContent = video.description;
    
    // Show player
    VideosElements.videoPlayerModal.style.display = 'flex';
    
    // Try to play
    const playPromise = VideosElements.mainVideoPlayer.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('✅ Video started playing');
            showVideoLoading(false);
        }).catch(error => {
            console.log('⚠️ Auto-play prevented:', error);
            showVideoLoading(false);
            VideosElements.mainVideoPlayer.controls = true;
        });
    }
    
    // Setup player events if not already done
    if (!VideosState.playerInitialized) {
        setupVideoPlayerEvents();
        VideosState.playerInitialized = true;
    }
}

// Setup Video Player Events
function setupVideoPlayerEvents() {
    const video = VideosElements.mainVideoPlayer;
    
    if (!video) return;
    
    // Waiting event (buffering)
    video.addEventListener('waiting', function() {
        showVideoLoading(true);
    });
    
    // Can play event
    video.addEventListener('canplay', function() {
        showVideoLoading(false);
    });
    
    // Error event
    video.addEventListener('error', function() {
        console.error('❌ Video error:', video.error);
        showVideoLoading(false);
        showVideoError(true);
    });
    
    // End event - مهم: وقتی ویدیو تمام شد
    video.addEventListener('ended', function() {
        console.log('🏁 Video ended');
        markVideoAsWatched();
        
        // بستن پلیر
        closeVideoPlayer();
        
        // اگر کاربر رایگان است و ویدیوی رایگان را تماشا کرد
        if (!VideosState.isPremium && VideosState.currentVideo && VideosState.currentVideo.isFreeVideo) {
            // نشان دادن پاپ‌آپ و هدایت به صفحه پریمیوم
            setTimeout(() => {
                showPremiumPopupAndRedirect('ویدیوی رایگان شما به پایان رسید! برای تماشای ویدیوهای بیشتر، اکانت خود را به پریمیوم ارتقاء دهید.');
            }, 500);
        }
    });
}

// Show Premium Popup
function showPremiumPopup(message = 'برای تماشای این ویدیو نیاز به اکانت پریمیوم دارید.') {
    // Remove existing popup
    const existingPopup = document.getElementById('premiumPopup');
    if (existingPopup) existingPopup.remove();
    
    const premiumHTML = `
        <div class="popup-overlay" id="premiumPopup" style="display: flex;">
            <div class="popup-content">
                <button class="popup-close" onclick="closePopup()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="popup-icon">
                    <i class="fas fa-crown" style="color: #f59e0b;"></i>
                </div>
                
                <h2 class="popup-title">نیاز به اکانت پریمیوم</h2>
                
                <p class="popup-text">
                    ${message}
                </p>
                
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-video"></i>
                        </div>
                        <div class="feature-text">تماشای تمام ویدیوها</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-unlock"></i>
                        </div>
                        <div class="feature-text">حذف محدودیت‌ها</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-hd"></i>
                        </div>
                        <div class="feature-text">کیفیت عالی</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-film"></i>
                        </div>
                        <div class="feature-text">بدون تبلیغات</div>
                    </div>
                </div>
                
                <button class="popup-button" onclick="goToPremiumPage()" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                    <i class="fas fa-crown"></i>
                    ارتقاء به پریمیوم
                </button>
                
                <button class="popup-secondary" onclick="closePopup()">
                    بعداً
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', premiumHTML);
}

// Go to Premium Page
function goToPremiumPage() {
    closePopup();
    
    // Save current URL to return after premium purchase
    localStorage.setItem('returnUrl', window.location.href);
    
    // Redirect to premium page
    window.location.href = 'premium.html';
}

// Check if user purchased premium
function checkPremiumPurchase() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('premium_purchased') === 'true') {
        console.log('🎉 Premium purchased!');
        
        // Update state
        VideosState.isPremium = true;
        VideosState.freeVideoUsed = false;
        
        // Save to localStorage
        localStorage.setItem('hasPremium', 'true');
        localStorage.setItem('freeVideoUsed', 'false');
        
        // Show success message
        showPremiumSuccessPopup();
        
        // Update UI
        updateWatchedVideos();
        updateProgressBar();
        renderVideos();
        
        // Remove URL parameter
        window.history.replaceState({}, '', window.location.pathname);
    }
}

// Show premium success popup
function showPremiumSuccessPopup() {
    // Remove existing popup
    const existingPopup = document.getElementById('premiumSuccessPopup');
    if (existingPopup) existingPopup.remove();
    
    const successHTML = `
        <div class="popup-overlay" id="premiumSuccessPopup" style="display: flex;">
            <div class="popup-content">
                <div class="popup-icon">
                    <i class="fas fa-crown" style="color: #10b981;"></i>
                </div>
                
                <h2 class="popup-title" style="background: linear-gradient(to right, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    تبریک! ارتقاء موفقیت‌آمیز بود
                </h2>
                
                <p class="popup-text">
                    اکانت شما با موفقیت به پریمیوم ارتقاء یافت!
                    <br>
                    اکنون می‌توانید به <strong>همه ویدیوها</strong> دسترسی داشته باشید.
                </p>
                
                <div style="background: rgba(16, 185, 129, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="width: 50px; height: 50px; background: rgba(16, 185, 129, 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #10b981; font-size: 24px;">
                            <i class="fas fa-unlock"></i>
                        </div>
                        <div>
                            <h4 style="color: white; margin-bottom: 5px;">همه ویدیوها آزاد شدند</h4>
                            <p style="color: #94a3b8; font-size: 13px;">دسترسی نامحدود به همه ۴ ویدیو</p>
                        </div>
                    </div>
                </div>
                
                <button class="popup-button" onclick="closePopup()" style="background: linear-gradient(135deg, #10b981, #059669);">
                    <i class="fas fa-play-circle"></i>
                    شروع تماشا
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

// Mark video as watched
function markVideoAsWatched() {
    if (!VideosState.currentVideo) return;
    
    const video = VideosState.currentVideo;
    
    if (!video.watched) {
        console.log('✅ Marking video as watched:', video.title);
        
        video.watched = true;
        video.progress = 100;
        
        if (!VideosState.watchedVideos.includes(video.id)) {
            VideosState.watchedVideos.push(video.id);
        }
        
        // Save progress
        VideosState.videoProgress[video.id] = 100;
        
        // اگر ویدیوی رایگان بود، flag را true کن
        if (video.isFreeVideo) {
            VideosState.freeVideoUsed = true;
        }
        
        // Save state
        saveVideoState();
        
        // Update UI
        updateWatchedVideos();
        updateProgressBar();
        renderVideos();
    }
}

// Show video loading
function showVideoLoading(show) {
    if (VideosElements.videoLoading) {
        VideosElements.videoLoading.style.display = show ? 'block' : 'none';
    }
}

// Show video error
function showVideoError(show) {
    if (VideosElements.videoError) {
        VideosElements.videoError.style.display = show ? 'block' : 'none';
    }
}

// Retry video load
function retryVideoLoad() {
    showVideoError(false);
    showVideoLoading(true);
    
    if (VideosState.currentVideo) {
        VideosElements.mainVideoPlayer.load();
        VideosElements.mainVideoPlayer.play().catch(e => {
            console.log('🔄 Retry play failed:', e);
            showVideoLoading(false);
            VideosElements.mainVideoPlayer.controls = true;
        });
    }
}

// Close Video Player
function closeVideoPlayer() {
    console.log('❌ Closing video player');
    
    VideosElements.videoPlayerModal.style.display = 'none';
    
    if (VideosElements.mainVideoPlayer) {
        VideosElements.mainVideoPlayer.pause();
        VideosElements.mainVideoPlayer.currentTime = 0;
        VideosElements.mainVideoPlayer.src = '';
        VideosElements.videoSource.src = '';
    }
    
    VideosState.currentVideo = null;
    showVideoLoading(false);
    showVideoError(false);
}

// Close popup
function closePopup() {
    const popups = document.querySelectorAll('.popup-overlay');
    popups.forEach(popup => {
        popup.style.display = 'none';
        setTimeout(() => popup.remove(), 300);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Close video player when clicking outside
    VideosElements.videoPlayerModal.addEventListener('click', function(event) {
        if (event.target === this) {
            closeVideoPlayer();
        }
    });
    
    // Close video player with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (VideosElements.videoPlayerModal.style.display === 'flex') {
                closeVideoPlayer();
            } else {
                closePopup();
            }
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(initializeVideosPage, 100);
});

// Make functions available globally
window.handlePlayClick = handlePlayClick;
window.closeVideoPlayer = closeVideoPlayer;
window.retryVideoLoad = retryVideoLoad;
window.goToPremiumPage = goToPremiumPage;
window.closePopup = closePopup;
