// ========== GAMES PAGE JAVASCRIPT ==========

// Data Model - ۴ بازی با ویدیوهای پس‌زمینه
const GamesData = {
    games: [
        {
            id: 1,
            name: 'بازی آنلاین با دختر',
            description: '',
            video: 'Film1.mp4',
            poster: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=250&fit=crop&auto=format',
            icon: 'fa-chess',
            players: 856,
            rating: 4.8,
            color: '#8b5cf6',
            difficulty: 'متوسط',
            features: ['زمان‌دار', 'امتیازدهی', 'چت حین بازی'],
            category: '',
            gameFile: 'index1.html?game=chess',
            videoLength: 15
        },
        {
            id: 2,
            name: 'بازی شانسی',
            description: '',
            video: 'Film2.mp4',
            poster: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=400&h=250&fit=crop&auto=format',
            icon: 'fa-times',
            players: 1245,
            rating: 4.3,
            color: '#3b82f6',
            difficulty: 'آسان',
            features: ['مولتی پلیر', 'چند حالت'],
            category: '',
            gameFile: 'index1.html?game=tic-tac-toe',
            videoLength: 12
        },
        {
            id: 3,
            name: 'بازی با پسر',
            description: '',
            video: 'Film3.mp4',
            poster: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=250&fit=crop&auto=format',
            icon: 'fa-font',
            players: 932,
            rating: 4.6,
            color: '#ec4899',
            difficulty: 'آسان',
            features: ['کلمات فارسی', 'راهنما', 'امتیاز ویژه'],
            category: '',
            gameFile: 'index1.html?game=word',
            videoLength: 18
        },
        {
            id: 4,
            name: 'بازی خود ارضایی',
            description: '',
            video: 'Film4.mp4',
            poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop&auto=format',
            icon: 'fa-tank',
            players: 1678,
            rating: 4.7,
            color: '#0ea5e9',
            difficulty: 'سخت',
            features: ['گرافیک 3D', 'تیم بازی'],
            category: '',
            gameFile: 'index1.html?game=tank',
            videoLength: 20
        }
    ]
};

// State Management
const GamesState = {
    selectedGame: null,
    isPremium: false,
    videoPlayers: new Map(),
    videoObservers: new Map(),
    fallbackVideos: new Map()
};

// Fallback videos
const FallbackVideos = {
    1: 'https://cdn.pixabay.com/vimeo/657287805/chess-105661.mp4?width=640&hash=f8d75bdfbcc8d69014b5ce5759e9a2f4590d4d6b',
    2: 'https://cdn.pixabay.com/vimeo/655378275/tic-tac-toe-102356.mp4?width=640&hash=7b9d5c17f3a44b31f704d62b2ff2733ab6970f50',
    3: 'https://cdn.pixabay.com/vimeo/735452633/alphabet-144337.mp4?width=640&hash=e4c5c15877ff711977cd1e22e1f35449ae96d706',
    4: 'https://cdn.pixabay.com/vimeo/646377680/game-93200.mp4?width=640&hash=2e3633e7c97d3b1d439b379911788b6a4fa7b351'
};

// DOM Elements
const GamesElements = {
    gamesGrid: document.getElementById('gamesGrid'),
    quickStartBtn: document.getElementById('quickStartBtn')
};

// Initialize Games Page
function initializeGamesPage() {
    console.log('🎮 Initializing Games Page...');
    
    // Check premium status
    GamesState.isPremium = checkPremiumStatus();
    console.log('Premium status:', GamesState.isPremium ? '✅ Premium' : '❌ Not Premium');
    
    // Preload videos
    preloadVideos();
    
    // Render games with videos
    renderGames();
    
    // Setup event listeners
    setupGamesListeners();
    
    console.log('✅ Games Page Initialized');
}

// Preload Videos
function preloadVideos() {
    console.log('📹 Preloading videos...');
    
    GamesData.games.forEach(game => {
        if (game.video) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = game.video;
            video.onloadeddata = () => {
                console.log(`✅ Video preloaded: ${game.name}`);
            };
            video.onerror = () => {
                console.warn(`⚠️ Could not preload video for: ${game.name}`);
                GamesState.fallbackVideos.set(game.id, FallbackVideos[game.id]);
            };
            
            document.body.appendChild(video);
            setTimeout(() => video.remove(), 1000);
        }
    });
}

// Check Premium Status
function checkPremiumStatus() {
    if (!localStorage.getItem('hasPremium')) {
        localStorage.setItem('hasPremium', 'true');
        console.log('📝 Set default premium status to true');
    }
    
    return localStorage.getItem('hasPremium') === 'true';
}

// Render Games with Video Background
function renderGames() {
    if (!GamesElements.gamesGrid) {
        console.error('❌ gamesGrid element not found!');
        return;
    }
    
    GamesElements.gamesGrid.innerHTML = '';
    
    GamesData.games.forEach(game => {
        const gameCard = createGameCard(game);
        GamesElements.gamesGrid.appendChild(gameCard);
    });
    
    console.log('🎨 Rendered', GamesData.games.length, 'games with auto-play video');
    
    // Initialize video players after rendering
    setTimeout(initializeVideoPlayers, 100);
}

// Create Game Card with Video Background
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.gameId = game.id;
    
    card.innerHTML = `
        <!-- Online Indicator -->
        <div class="online-indicator">
            <i class="fas fa-circle"></i>
            آنلاین
        </div>
        
        <!-- Game Video Background -->
        <div class="game-video-section">
            <div class="video-background-container">
                <video class="game-background-video" 
                       id="video-${game.id}"
                       muted 
                       loop 
                       playsinline
                       preload="metadata"
                       autoplay
                       poster="${game.poster}">
                </video>
                
                <!-- Overlay for better text visibility -->
                <div class="video-content-overlay">
                    <div class="game-header">
                        <h3 class="game-title">${game.name}</h3>
                        <div class="game-category-badge">
                            <i class="fas fa-tag"></i>
                            ${game.category}
                        </div>
                    </div>
                    
                    <p class="game-description">${game.description}</p>
                    
                    <!-- Auto-play indicator -->
                    <div class="auto-play-indicator">
                        <i class="fas fa-play-circle"></i>
                        <span>پخش خودکار</span>
                    </div>
                </div>
                
                <!-- Video Loading -->
                <div class="video-loading" id="loading-${game.id}">
                    <div class="loading-spinner"></div>
                    <span>در حال بارگذاری...</span>
                </div>
            </div>
            
            <!-- Game Stats -->
            <div class="game-stats">
                <div class="game-stat">
                    <i class="fas fa-users"></i>
                    <span>${game.players.toLocaleString('fa-IR')} بازیکن</span>
                </div>
                <div class="game-stat">
                    <i class="fas fa-star"></i>
                    <span>${game.rating}/5</span>
                </div>
                <div class="game-stat">
                    <i class="fas fa-bolt"></i>
                    <span>${game.difficulty}</span>
                </div>
            </div>
            
            <!-- Game Features -->
            <div class="game-features">
                ${game.features.map(feature => `
                    <span class="game-feature">
                        <i class="fas fa-check"></i>
                        ${feature}
                    </span>
                `).join('')}
            </div>
            
            <!-- Play Button -->
            <button class="game-play-btn" data-game-id="${game.id}" data-game-file="${game.gameFile}">
                <i class="fas fa-play"></i>
                شروع بازی
            </button>
        </div>
    `;
    
    return card;
}

// Initialize Video Players
function initializeVideoPlayers() {
    GamesData.games.forEach(game => {
        const videoElement = document.getElementById(`video-${game.id}`);
        const loadingElement = document.getElementById(`loading-${game.id}`);
        
        if (videoElement) {
            // Set video source
            let videoSource = game.video;
            if (GamesState.fallbackVideos.has(game.id)) {
                videoSource = GamesState.fallbackVideos.get(game.id);
                console.log(`🔄 Using fallback video for: ${game.name}`);
            }
            
            const source = document.createElement('source');
            source.src = videoSource;
            source.type = 'video/mp4';
            videoElement.appendChild(source);
            
            // Store video element
            GamesState.videoPlayers.set(game.id, videoElement);
            
            // Setup video events
            setupVideoEvents(videoElement, game.id, loadingElement);
            
            // Load video
            videoElement.load();
            
            // Setup observer for auto-play
            setupVideoObserver(videoElement, game.id);
        }
    });
    
    // Setup game event listeners
    setupGameEventListeners();
}

// Setup Video Events
function setupVideoEvents(videoElement, gameId, loadingElement) {
    videoElement.addEventListener('loadeddata', () => {
        console.log(`✅ Video loaded: ${gameId}`);
        if (loadingElement) {
            loadingElement.style.opacity = '0';
            setTimeout(() => {
                loadingElement.style.display = 'none';
            }, 300);
        }
        
        // Auto-play when in viewport
        setTimeout(() => {
            if (isElementInViewport(videoElement)) {
                videoElement.play().catch(e => {
                    console.log(`Auto-play prevented for video ${gameId}:`, e);
                    // If autoplay is blocked, try with user gesture
                    document.addEventListener('click', function tryPlayOnce() {
                        videoElement.play().then(() => {
                            console.log(`Video ${gameId} started after user interaction`);
                        }).catch(err => {
                            console.log('Still cannot play:', err);
                        });
                        document.removeEventListener('click', tryPlayOnce);
                    }, { once: true });
                });
            }
        }, 500);
    });
    
    videoElement.addEventListener('error', () => {
        console.warn(`❌ Video error for ${gameId}`);
        if (loadingElement) {
            loadingElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>خطا در بارگذاری</span>';
        }
    });
    
    videoElement.addEventListener('ended', () => {
        // Auto restart when video ends
        setTimeout(() => {
            if (videoElement) {
                videoElement.currentTime = 0;
                videoElement.play().catch(e => console.log('Auto-restart prevented:', e));
            }
        }, 300);
    });
    
    // Handle video loop
    videoElement.addEventListener('timeupdate', () => {
        // Ensure smooth looping
        if (videoElement.duration - videoElement.currentTime < 0.5) {
            videoElement.currentTime = 0;
        }
    });
}

// Setup Video Observer for Auto-Play
function setupVideoObserver(videoElement, gameId) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Video is visible - play it
                if (videoElement.paused) {
                    videoElement.play().catch(e => {
                        console.log(`Auto-play prevented when visible for ${gameId}:`, e);
                    });
                }
            } else {
                // Video is not visible - pause it
                if (!videoElement.paused) {
                    videoElement.pause();
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '50px'
    });
    
    observer.observe(videoElement);
    GamesState.videoObservers.set(gameId, observer);
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 1.5 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Setup Game Event Listeners
function setupGameEventListeners() {
    GamesData.games.forEach(game => {
        // Game play button
        const gamePlayBtn = document.querySelector(`.game-play-btn[data-game-id="${game.id}"]`);
        if (gamePlayBtn) {
            gamePlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                startGame(game);
            });
        }
    });
}

// Start Game
function startGame(game) {
    console.log('🕹️ Starting game:', game.name);
    
    if (!GamesState.isPremium) {
        console.log('❌ Premium access denied');
        showGamesPremiumPopup();
        return false;
    }
    
    GamesState.selectedGame = game;
    
    // Pause all videos before redirect
    pauseAllVideos();
    
    showLoadingBeforeRedirect(game);
    
    setTimeout(() => {
        console.log('🚀 Redirecting to:', game.gameFile);
        window.location.href = game.gameFile;
    }, 1500);
    
    return true;
}

// Pause All Videos
function pauseAllVideos() {
    GamesState.videoPlayers.forEach((video, gameId) => {
        if (!video.paused) {
            video.pause();
        }
    });
}

// Show Loading Before Redirect
function showLoadingBeforeRedirect(game) {
    removeAllPopups();
    
    const loadingHTML = `
        <div class="popup-overlay" id="loadingPopup" style="display: flex; z-index: 9999;">
            <div class="popup-content" style="max-width: 450px; text-align: center;">
                <div class="loading" style="
                    width: 60px; 
                    height: 60px; 
                    margin: 0 auto 25px;
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    border-top: 4px solid #10b981;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                
                <h2 style="color: white; margin-bottom: 15px; font-size: 22px;">
                    <i class="fas fa-gamepad" style="color: ${game.color}; margin-left: 10px;"></i>
                    ${game.name}
                </h2>
                
                <p style="color: #94a3b8; font-size: 15px; margin-bottom: 25px; line-height: 1.6;">
                    در حال انتقال به صفحه بازی...
                    <br>
                    لطفاً چند لحظه صبر کنید.
                </p>
                
                <div style="background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #94a3b8;">بازی:</span>
                        <span style="color: white; font-weight: 500;">${game.name}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #94a3b8;">دسته:</span>
                        <span style="color: #10b981; font-weight: 500;">${game.category}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #94a3b8;">مقصد:</span>
                        <span style="color: ${game.color}; font-weight: 500;">${game.gameFile}</span>
                    </div>
                </div>
                
                <div style="color: #94a3b8; font-size: 13px; padding: 15px; background: rgba(16, 185, 129, 0.1); border-radius: 12px;">
                    <i class="fas fa-info-circle" style="margin-left: 8px;"></i>
                    در حال اتصال به سرور بازی...
                </div>
                
                <button class="popup-secondary" style="margin-top: 20px;" onclick="cancelRedirect()">
                    <i class="fas fa-times"></i>
                    لغو
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
    
    window.cancelRedirect = function() {
        const loadingPopup = document.getElementById('loadingPopup');
        if (loadingPopup) {
            loadingPopup.remove();
            console.log('❌ Redirect cancelled by user');
        }
    };
}

// Remove all popups
function removeAllPopups() {
    const popups = document.querySelectorAll('.popup-overlay');
    popups.forEach(popup => popup.remove());
}

// Quick Start Random Game
function quickStartRandomGame() {
    console.log('🎲 Quick starting random game...');
    
    if (!GamesState.isPremium) {
        console.log('❌ Premium access denied for quick start');
        showGamesPremiumPopup();
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * GamesData.games.length);
    const randomGame = GamesData.games[randomIndex];
    console.log('🎯 Selected random game:', randomGame.name);
    
    startGame(randomGame);
}

// Show Games Premium Popup
function showGamesPremiumPopup() {
    removeAllPopups();
    
    const premiumHTML = `
        <div class="popup-overlay" style="display: flex; z-index: 9999;">
            <div class="popup-content">
                <button class="popup-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="popup-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                    <i class="fas fa-crown"></i>
                </div>
                
                <h2 class="popup-title">ارتقاء به پریمیوم</h2>
                
                <p class="popup-text" style="font-size: 16px;">
                    برای دسترسی به بازی‌های آنلاین و شروع بازی،
                    حساب خود را به پریمیوم ارتقاء دهید.
                </p>
                
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon" style="background: rgba(16, 185, 129, 0.2);">
                            <i class="fas fa-gamepad" style="color: #10b981;"></i>
                        </div>
                        <div class="feature-text" style="font-size: 14px;">بازی‌های نامحدود</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon" style="background: rgba(245, 158, 11, 0.2);">
                            <i class="fas fa-trophy" style="color: #f59e0b;"></i>
                        </div>
                        <div class="feature-text" style="font-size: 14px;">جوایز ویژه</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon" style="background: rgba(59, 130, 246, 0.2);">
                            <i class="fas fa-users" style="color: #3b82f6;"></i>
                        </div>
                        <div class="feature-text" style="font-size: 14px;">بازی آنلاین</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon" style="background: rgba(139, 92, 246, 0.2);">
                            <i class="fas fa-chart-line" style="color: #8b5cf6;"></i>
                        </div>
                        <div class="feature-text" style="font-size: 14px;">آمار پیشرفته</div>
                    </div>
                </div>
                
                <button class="popup-button" onclick="window.location.href='premium.html'">
                    <i class="fas fa-shopping-cart"></i>
                    رفتن به صفحه پرداخت
                </button>
                
                <button class="popup-secondary" onclick="this.closest('.popup-overlay').remove()">
                    شاید بعداً
                </button>
                
                <div style="margin-top: 20px; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 16px;">
                    <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-bottom: 15px;">
                        <i class="fas fa-flask"></i>
                        برای تست، می‌توانید پرمیوم را فعال کنید:
                    </p>
                    <button class="popup-button" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); font-size: 14px; padding: 15px;" 
                            onclick="enablePremiumForTesting()">
                        <i class="fas fa-check"></i>
                        فعال کردن پرمیوم (تست)
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', premiumHTML);
    
    window.enablePremiumForTesting = function() {
        localStorage.setItem('hasPremium', 'true');
        GamesState.isPremium = true;
        
        const popup = document.querySelector('.popup-overlay');
        if (popup) popup.remove();
        
        const successHTML = `
            <div class="popup-overlay" style="display: flex; z-index: 9999;">
                <div class="popup-content" style="text-align: center;">
                    <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; animation: scaleIn 0.5s ease;">
                        <i class="fas fa-check" style="color: #10b981; font-size: 32px;"></i>
                    </div>
                    <h2 style="color: white; margin-bottom: 15px; font-size: 24px;">پرمیوم فعال شد!</h2>
                    <p style="color: #94a3b8; font-size: 16px; margin-bottom: 30px;">
                        اکنون می‌توانید به تمام بازی‌ها دسترسی داشته باشید.
                    </p>
                    <button class="popup-button" style="background: linear-gradient(135deg, #10b981, #059669);" onclick="this.closest('.popup-overlay').remove()">
                        <i class="fas fa-check"></i>
                        فهمیدم
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successHTML);
        console.log('✅ Premium enabled for testing');
    };
}

// Setup Games Listeners
function setupGamesListeners() {
    // Quick start button
    if (GamesElements.quickStartBtn) {
        GamesElements.quickStartBtn.addEventListener('click', quickStartRandomGame);
    }
    
    // Close popup when clicking overlay
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup-overlay')) {
            e.target.remove();
        }
    });
    
    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            removeAllPopups();
        }
    });
    
    // Pause videos when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseAllVideos();
        }
    });
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    pauseAllVideos();
    GamesState.videoObservers.forEach(observer => {
        observer.disconnect();
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM fully loaded');
    
    // Initialize premium status
    if (!localStorage.getItem('hasPremium')) {
        localStorage.setItem('hasPremium', 'true');
    }
    
    // Initialize games page
    initializeGamesPage();
    
    console.log('🎮 Games with auto-play video page initialized');
});

// Global functions
window.startGame = startGame;
window.quickStartRandomGame = quickStartRandomGame;
window.showGamesPremiumPopup = showGamesPremiumPopup;
window.removeAllPopups = removeAllPopups;
