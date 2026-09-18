// ========== CONFIGURATION ==========
const CONFIG = {
    appName: "ChatHub",
    paymentGateway: "pay/index.php",
    freeUserLimit: 3,
    animationDuration: 300,
    notificationDuration: 8000,
    api: {
        baseUrl: "https://api.chathub.com/v1",
        timeout: 10000
    },
    features: {
        chat: true,
        games: true,
        videos: true,
        live: true,
        premium: true
    },
    pricing: {
        monthly: 20000,
        currency: "تومان",
        currencySymbol: "ت"
    }
};

// ========== STATE MANAGEMENT ==========
const STATE = {
    currentUser: null,
    hasPremium: localStorage.getItem('hasPremium') === 'true' || false,
    currentPage: getCurrentPageFromURL(),
    notificationVisible: true,
    isOnline: navigator.onLine,
    lastUpdate: Date.now(),
    popups: {
        premium: false,
        success: false,
        guide: false
    },
    isNavigating: false,
    
    // User preferences
    preferences: JSON.parse(localStorage.getItem('preferences')) || {
        theme: 'dark',
        language: 'fa',
        notifications: true,
        sound: true
    }
};

// ========== HELPER FUNCTIONS ==========
function getCurrentPageFromURL() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return ['chat', 'games', 'videos', 'live', 'premium', 'payment'].includes(page) ? page : 'chat';
}

function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function generateTransactionId() {
    return Math.random().toString(36).substr(2, 10).toUpperCase();
}

function getRenewalDate(period = 'month') {
    const now = new Date();
    let renewalDate = new Date(now);
    
    switch(period) {
        case 'month':
            renewalDate.setMonth(renewalDate.getMonth() + 1);
            break;
        case 'year':
            renewalDate.setFullYear(renewalDate.getFullYear() + 1);
            break;
        default:
            renewalDate.setMonth(renewalDate.getMonth() + 1);
    }
    
    return renewalDate.toLocaleDateString('fa-IR');
}

// ========== NAVIGATION SYSTEM ==========
function updateNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === STATE.currentPage) {
            item.classList.add('active');
        }
    });
}

function navigateToPage(page) {
    if (STATE.isNavigating) return;
    
    STATE.isNavigating = true;
    const pageUrl = page === 'chat' ? 'index.html' : `${page}.html`;
    
    // Show loading indicator
    showLoadingIndicator();
    
    // Update active state immediately
    STATE.currentPage = page;
    updateNavigation();
    
    // Navigate after a small delay for better UX
    setTimeout(() => {
        window.location.href = pageUrl;
    }, CONFIG.animationDuration);
    
    // Reset navigation lock after timeout
    setTimeout(() => {
        STATE.isNavigating = false;
    }, 3000);
}

function showLoadingIndicator() {
    // Remove existing loading overlay
    const existingOverlay = document.querySelector('.loading-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(26, 26, 46, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(10px);
    `;
    
    loadingOverlay.innerHTML = `
        <div style="text-align: center;">
            <div style="
                width: 60px;
                height: 60px;
                border: 4px solid rgba(67, 97, 238, 0.2);
                border-top: 4px solid #4361ee;
                border-radius: 50%;
                margin: 0 auto 20px;
                animation: spin 1s linear infinite;
            "></div>
            <div style="color: white; font-size: 18px; font-weight: 600;">
                در حال بارگذاری...
            </div>
            <div style="color: #94a3b8; font-size: 14px; margin-top: 10px;">
                ${CONFIG.appName}
            </div>
        </div>
        
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(loadingOverlay);
}

// ========== NOTIFICATION SYSTEM ==========
function showTemporaryNotification(message, type = 'info') {
    console.log(`🔔 ${type.toUpperCase()}: ${message}`);
    
    // Remove existing notification
    const existingNotification = document.querySelector('.temporary-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification-bar temporary-notification';
    notification.style.animation = 'slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Set color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        default:
            notification.style.
