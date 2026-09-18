// ========== CHAT PAGE JAVASCRIPT ==========

// Data Model
const ChatData = {
    users: [
        {
            id: 1,
            name: 'سارا کریمی',
            avatar: 'س',
            bio: '',
            isPremium: true,
            status: 'online',
            level: 78,
            messages: 1245,
            rating: 4.8,
            color: '#4361ee',
            lastSeen: 'هم اکنون'
        },
        {
            id: 2,
            name: 'علی محمدی',
            avatar: 'ع',
            bio: '',
            isPremium: false,
            status: 'online',
            level: 92,
            messages: 856,
            rating: 4.5,
            color: '#3a0ca3',
            lastSeen: '۲ دقیقه پیش'
        },
        {
            id: 3,
            name: 'نازنین جعفری',
            avatar: 'ن',
            bio: '',
            isPremium: false,
            status: 'online',
            level: 65,
            messages: 932,
            rating: 4.7,
            color: '#7209b7',
            lastSeen: 'هم اکنون'
        },
        {
            id: 4,
            name: 'محمد رضایی',
            avatar: 'م',
            bio: '',
            isPremium: true,
            status: 'away',
            level: 88,
            messages: 1567,
            rating: 4.9,
            color: '#f72585',
            lastSeen: '۱۰ دقیقه پیش'
        },
        {
            id: 5,
            name: 'فاطمه حسینی',
            avatar: 'ف',
            bio: '',
            isPremium: false,
            status: 'online',
            level: 45,
            messages: 421,
            rating: 4.3,
            color: '#4cc9f0',
            lastSeen: 'هم اکنون'
        },
        {
            id: 6,
            name: 'رضا احمدی',
            avatar: 'ر',
            bio: '',
            isPremium: false,
            status: 'busy',
            level: 72,
            messages: 789,
            rating: 4.6,
            color: '#4895ef',
            lastSeen: '۵ دقیقه پیش'
        }
    ],
    
    getRandomUser() {
        const users = [
            {name: 'پارسا', avatar: 'پ', color: '#4361ee'},
            {name: 'مهسا', avatar: 'م', color: '#3a0ca3'},
            {name: 'کیمیا', avatar: 'ک', color: '#7209b7'},
            {name: 'دانیال', avatar: 'د', color: '#f72585'}
        ];
        return users[Math.floor(Math.random() * users.length)];
    }
};

// State Management
const ChatState = {
    currentUser: null,
    searchQuery: '',
    messages: [],
    onlineCount: 6,
    premiumCount: 2
};

// DOM Elements
const ChatElements = {
    usersGrid: document.getElementById('usersGrid'),
    searchInput: document.getElementById('chatSearch'),
    showGuideBtn: document.getElementById('showGuideBtn'),
    onlineCount: document.getElementById('onlineCount'),
    premiumCount: document.getElementById('premiumCount'),
    totalChats: document.getElementById('totalChats'),
    responseTime: document.getElementById('responseTime'),
    activeUsersBadge: document.getElementById('activeUsersBadge'),
    chatBadge: document.getElementById('chatBadge'),
    notificationBar: document.getElementById('notificationBar'),
    upgradeBtn: document.getElementById('upgradeBtn')
};

// Initialize Chat Page
function initializeChatPage() {
    console.log('💬 Initializing Chat Page...');
    
    // Render users
    renderUsers();
    
    // Setup event listeners
    setupChatListeners();
    
    // Update statistics
    updateChatStatistics();
    
    // Show notification if not premium
    checkPremiumStatus();
    
    console.log('✅ Chat Page Initialized');
}

// Render Users
function renderUsers() {
    if (!ChatElements.usersGrid) return;
    
    ChatElements.usersGrid.innerHTML = '';
    
    // Filter users based on search
    const filteredUsers = ChatData.users.filter(user => {
        const searchLower = ChatState.searchQuery.toLowerCase();
        return user.name.toLowerCase().includes(searchLower) || 
               user.bio.toLowerCase().includes(searchLower);
    });
    
    filteredUsers.forEach(user => {
        const userCard = createUserCard(user);
        ChatElements.usersGrid.appendChild(userCard);
    });
    
    // Update online count
    const onlineUsers = filteredUsers.filter(u => u.status === 'online').length;
    if (ChatElements.activeUsersBadge) {
        ChatElements.activeUsersBadge.innerHTML = `<i class="fas fa-circle" style="font-size: 8px;"></i> ${onlineUsers} کاربر آنلاین`;
    }
}

// Create User Card
function createUserCard(user) {
    const hasPremium = localStorage.getItem('hasPremium') === 'true';
    const buttonText = hasPremium ? 'شروع چت' : 'نیاز به پریمیوم';
    const buttonClass = hasPremium ? 'chat-button' : 'chat-button disabled';
    const buttonIcon = hasPremium ? 'fa-comment' : 'fa-comment-alt';
    
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
        <div class="user-header">
            <div class="user-avatar" style="background: linear-gradient(135deg, ${user.color}, ${darkenColor(user.color, 20)})">
                ${user.avatar}
                <div class="avatar-badge ${user.isPremium ? 'premium-badge' : 'online-badge'}">
                    ${user.isPremium ? '<i class="fas fa-crown"></i>' : '<i class="fas fa-circle"></i>'}
                </div>
            </div>
            <div class="user-info">
                <h3 class="user-name">${user.name}</h3>
                <p class="user-bio">${user.bio}</p>
                <div class="user-status">
                    <div class="status-dot ${user.status}"></div>
                    <span>${getStatusText(user.status)} - ${user.lastSeen}</span>
                </div>
            </div>
        </div>
        
        <div class="user-stats">
            <div class="stat-item">
                <div class="stat-number">${user.level}</div>
                <div class="stat-text">سطح</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${user.messages}</div>
                <div class="stat-text">پیام</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${user.rating}</div>
                <div class="stat-text">امتیاز</div>
            </div>
        </div>
        
        <button class="${buttonClass}" data-user-id="${user.id}" ${!hasPremium ? 'disabled' : ''}>
            <i class="fas ${buttonIcon}"></i>
            ${buttonText}
        </button>
    `;
    
    // Add event listeners
    const chatButton = card.querySelector('.chat-button');
    if (chatButton) {
        chatButton.addEventListener('click', (e) => {
            e.stopPropagation();
            startChat(user);
        });
    }
    
    card.addEventListener('click', () => {
        showUserProfile(user);
    });
    
    return card;
}

// Start Chat
function startChat(user) {
    const hasPremium = localStorage.getItem('hasPremium') === 'true';
    
    if (!hasPremium) {
        showPremiumPopup();
        return;
    }
    
    ChatState.currentUser = user;
    showChatWindow(user);
}

// Show Chat Window
function showChatWindow(user) {
    const chatHTML = `
        <div class="popup-overlay" id="chatWindow" style="display: flex;">
            <div class="popup-content" style="max-width: 600px; width: 90%; height: 80vh; display: flex; flex-direction: column;">
                <button class="popup-close" onclick="closeChatWindow()">
                    <i class="fas fa-times"></i>
                </button>
                
                <!-- Chat Header -->
                <div class="chat-header">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div class="user-avatar" style="width: 50px; height: 50px; background: linear-gradient(135deg, ${user.color}, ${darkenColor(user.color, 20)})">
                            ${user.avatar}
                        </div>
                        <div>
                            <h3 style="color: white; margin-bottom: 5px;">${user.name}</h3>
                            <div class="user-status">
                                <div class="status-dot ${user.status}"></div>
                                <span>${getStatusText(user.status)}</span>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="popup-secondary" style="padding: 8px 15px;">
                            <i class="fas fa-phone"></i>
                        </button>
                        <button class="popup-secondary" style="padding: 8px 15px;">
                            <i class="fas fa-video"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Messages Container -->
                <div class="chat-messages" id="chatMessages" style="flex: 1;">
                    <!-- Messages will be loaded here -->
                </div>
                
                <!-- Chat Input -->
                <div class="chat-input-container">
                    <input type="text" class="chat-input" id="messageInput" placeholder="پیام خود را بنویسید..." autocomplete="off">
                    <button class="send-button" id="sendMessageBtn">
                        <i class="fas fa-paper-plane"></i>
                        ارسال
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing chat window
    const existingWindow = document.getElementById('chatWindow');
    if (existingWindow) existingWindow.remove();
    
    // Add new chat window
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    
    // Load initial messages
    loadChatMessages(user);
    
    // Setup chat event listeners
    setupChatWindowListeners();
    
    // Focus on input
    setTimeout(() => {
        const input = document.getElementById('messageInput');
        if (input) input.focus();
    }, 100);
}

// Load Chat Messages
function loadChatMessages(user) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    // Sample messages
    const messages = [
        {
            type: 'received',
            text: 'سلام! چطور می‌تونم کمکتون کنم؟',
            time: '۲ دقیقه پیش',
            sender: user
        },
        {
            type: 'sent',
            text: 'سلام! ممنون از پاسخگویی شما.',
            time: '۱ دقیقه پیش'
        },
        {
            type: 'received',
            text: 'خیلی خوشحالم که باهاتون در ارتباطم. چه کاری براتون انجام بدم؟',
            time: 'هم اکنون'
        }
    ];
    
    messagesContainer.innerHTML = '';
    
    messages.forEach(msg => {
        const messageElement = createMessageElement(msg, user);
        messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Create Message Element
function createMessageElement(message, user) {
    const div = document.createElement('div');
    div.className = `message ${message.type}`;
    
    if (message.type === 'received') {
        div.innerHTML = `
            <div class="message-avatar" style="background: linear-gradient(135deg, ${user.color}, ${darkenColor(user.color, 20)})">
                ${user.avatar}
            </div>
            <div class="message-content">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `;
    }
    
    return div;
}

// Setup Chat Window Listeners
function setupChatWindowListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessageBtn');
    
    if (!messageInput || !sendButton) return;
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Send Message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!messageInput || !messagesContainer || !messageInput.value.trim()) return;
    
    const messageText = messageInput.value.trim();
    
    // Add sent message
    const sentMessage = {
        type: 'sent',
        text: messageText,
        time: 'هم اکنون'
    };
    
    const messageElement = createMessageElement(sentMessage, ChatState.currentUser);
    messagesContainer.appendChild(messageElement);
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate reply after delay
    setTimeout(simulateReply, 1000 + Math.random() * 2000);
}

// Simulate Reply
function simulateReply() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer || !ChatState.currentUser) return;
    
    const replies = [
        "متشکرم از پیام شما!",
        "خیلی خوب، ادامه بدهید.",
        "جالب بود، می‌تونید بیشتر توضیح بدید؟",
        "در حال حاضر مشغولم، بعداً پاسخ میدم.",
        "این اطلاعات مفید بود، ممنون!",
        "لطفاً کمی بیشتر صبر کنید...",
        "آیا نیاز به کمک بیشتری دارید؟",
        "بله، کاملاً متوجه شدم.",
        "این ایده عالی به نظر می‌رسد!",
        "لطفاً منتظر بمانید..."
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    const receivedMessage = {
        type: 'received',
        text: randomReply,
        time: 'هم اکنون',
        sender: ChatState.currentUser
    };
    
    const messageElement = createMessageElement(receivedMessage, ChatState.currentUser);
    messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Close Chat Window
function closeChatWindow() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) chatWindow.remove();
    ChatState.currentUser = null;
}

// Show User Profile
function showUserProfile(user) {
    const profileHTML = `
        <div class="popup-overlay" style="display: flex;">
            <div class="popup-content">
                <button class="popup-close" onclick="this.parentElement.parentElement.style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
                
                <div style="text-align: center; margin-bottom: 25px;">
                    <div class="user-avatar" style="margin: 0 auto 20px; width: 100px; height: 100px; font-size: 40px; background: linear-gradient(135deg, ${user.color}, ${darkenColor(user.color, 20)})">
                        ${user.avatar}
                        <div class="avatar-badge ${user.isPremium ? 'premium-badge' : 'online-badge'}" style="width: 30px; height: 30px; font-size: 14px;">
                            ${user.isPremium ? '<i class="fas fa-crown"></i>' : '<i class="fas fa-circle"></i>'}
                        </div>
                    </div>
                    
                    <h2 style="color: white; margin-bottom: 10px;">${user.name}</h2>
                    <p style="color: #94a3b8; margin-bottom: 5px;">${user.bio}</p>
                    <div class="user-status">
                        <div class="status-dot ${user.status}"></div>
                        <span>${getStatusText(user.status)} - ${user.lastSeen}</span>
                    </div>
                </div>
                
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="stat-number">${user.level}</div>
                        <div class="stat-text">سطح کاربری</div>
                    </div>
                    <div class="feature-item">
                        <div class="stat-number">${user.messages}</div>
                        <div class="stat-text">تعداد پیام</div>
                    </div>
                    <div class="feature-item">
                        <div class="stat-number">${user.rating}/5</div>
                        <div class="stat-text">امتیاز</div>
                    </div>
                    <div class="feature-item">
                        <div class="stat-number">${user.isPremium ? 'پریمیوم' : 'معمولی'}</div>
                        <div class="stat-text">نوع حساب</div>
                    </div>
                </div>
                
                <button class="popup-button" onclick="startChat(${JSON.stringify(user).replace(/"/g, '&quot;')}); this.closest('.popup-overlay').style.display='none'" ${localStorage.getItem('hasPremium') !== 'true' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <i class="fas fa-comment"></i>
                    ${localStorage.getItem('hasPremium') === 'true' ? 'شروع چت' : 'نیاز به پریمیوم'}
                </button>
            </div>
        </div>
    `;
    
    // Remove existing profile
    const existingProfile = document.querySelector('.popup-overlay');
    if (existingProfile && !existingProfile.id) existingProfile.remove();
    
    // Add new profile
    document.body.insertAdjacentHTML('beforeend', profileHTML);
}

// Show Premium Popup
function showPremiumPopup() {
    const premiumHTML = `
        <div class="popup-overlay" style="display: flex;">
            <div class="popup-content">
                <button class="popup-close" onclick="this.parentElement.parentElement.style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="popup-icon">
                    <i class="fas fa-crown"></i>
                </div>
                
                <h2 class="popup-title">ارتقاء به پریمیوم</h2>
                
                <p class="popup-text">
                    در نسخه آزمایشی هستید! برای دسترسی به تمامی امکانات چت،
                    حساب خود را به پریمیوم ارتقاء دهید.
                </p>
                
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <div class="feature-text">چت نامحدود</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-file-upload"></i>
                        </div>
                        <div class="feature-text">ارسال فایل</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-video"></i>
                        </div>
                        <div class="feature-text">تماس تصویری</div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div class="feature-text">امنیت بالا</div>
                    </div>
                </div>
                
                <button class="popup-button" onclick="window.location.href='premium.html'">
                    <i class="fas fa-shopping-cart"></i>
                    رفتن به صفحه پرداخت
                </button>
                
                <button class="popup-secondary" onclick="this.closest('.popup-overlay').style.display='none'">
                    شاید بعداً
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', premiumHTML);
}

// Show Guide
function showGuide() {
    const guideHTML = `
        <div class="popup-overlay" style="display: flex;">
            <div class="popup-content">
                <button class="popup-close" onclick="this.parentElement.parentElement.style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="popup-icon" style="color: #4361ee;">
                    <i class="fas fa-book"></i>
                </div>
                
                <h2 class="popup-title" style="background: linear-gradient(to right, #4361ee, #7209b7);">
                    راهنمای کامل چت
                </h2>
                
                <div style="text-align: right; margin-bottom: 25px;">
                    <div style="background: rgba(67, 97, 238, 0.1); padding: 20px; border-radius: 16px; margin-bottom: 20px;">
                        <h4 style="color: #4361ee; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-user-friends"></i>
                            پیدا کردن کاربران
                        </h4>
                        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                            • در بخش کاربران فعال، تمام کاربران آنلاین را می‌بینید<br>
                            • روی هر کاربر کلیک کنید تا اطلاعات کامل را ببینید<br>
                            • از کادر جستجو برای پیدا کردن کاربر خاص استفاده کنید
                        </p>
                    </div>
                    
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 16px; margin-bottom: 20px;">
                        <h4 style="color: #10b981; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-comment"></i>
                            شروع گفت‌وگو
                        </h4>
                        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                            • برای چت نیاز به حساب پریمیوم دارید<br>
                            • روی دکمه "شروع چت" کلیک کنید<br>
                            • رابط چت باز می‌شود و می‌توانید پیام بفرستید<br>
                            • کاربران به صورت خودکار پاسخ می‌دهند
                        </p>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.1); padding: 20px; border-radius: 16px;">
                        <h4 style="color: #fbbf24; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-crown"></i>
                            امکانات پریمیوم
                        </h4>
                        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                            • چت نامحدود با تمام کاربران<br>
                            • ارسال فایل و عکس<br>
                            • تماس ویدیویی و صوتی<br>
                            • ذخیره تاریخچه چت<br>
                            • بدون تبلیغات و محدودیت
                        </p>
                    </div>
                </div>
                
                <button class="popup-secondary" onclick="this.closest('.popup-overlay').style.display='none'">
                    فهمیدم
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', guideHTML);
}

// Setup Chat Listeners
function setupChatListeners() {
    // Search input
    if (ChatElements.searchInput) {
        ChatElements.searchInput.addEventListener('input', (e) => {
            ChatState.searchQuery = e.target.value;
            renderUsers();
        });
    }
    
    // Guide button
    if (ChatElements.showGuideBtn) {
        ChatElements.showGuideBtn.addEventListener('click', showGuide);
    }
    
    // Upgrade button
    if (ChatElements.upgradeBtn) {
        ChatElements.upgradeBtn.addEventListener('click', () => {
            window.location.href = 'premium.html';
        });
    }
}

// Update Chat Statistics
function updateChatStatistics() {
    const totalMessages = ChatData.users.reduce((sum, user) => sum + user.messages, 0);
    
    if (ChatElements.onlineCount) {
        ChatElements.onlineCount.textContent = ChatState.onlineCount;
    }
    
    if (ChatElements.premiumCount) {
        ChatElements.premiumCount.textContent = ChatState.premiumCount;
    }
    
    if (ChatElements.totalChats) {
        ChatElements.totalChats.textContent = totalMessages.toLocaleString('fa-IR');
    }
    
    if (ChatElements.responseTime) {
        ChatElements.responseTime.textContent = '۲.۴s';
    }
    
    if (ChatElements.chatBadge) {
        const unreadCount = Math.floor(Math.random() * 9) + 1;
        ChatElements.chatBadge.textContent = unreadCount;
        ChatElements.chatBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Check Premium Status
function checkPremiumStatus() {
    const hasPremium = localStorage.getItem('hasPremium') === 'true';
    
    if (!hasPremium && ChatElements.notificationBar) {
        setTimeout(() => {
            ChatElements.notificationBar.style.display = 'flex';
        }, 1000);
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            if (ChatElements.notificationBar) {
                ChatElements.notificationBar.style.display = 'none';
            }
        }, 8000);
    }
}

// Helper Functions
function darkenColor(color, percent = 20) {
    // This is a simplified version - in production use a proper color manipulation library
    return color;
}

function getStatusText(status) {
    const statusMap = {
        'online': 'آنلاین',
        'away': 'دور از دسترس',
        'busy': 'مشغول',
        'offline': 'آفلاین'
    };
    return statusMap[status] || 'نامشخص';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeChatPage);

// Make functions available globally for inline handlers
window.startChat = startChat;
window.closeChatWindow = closeChatWindow;
window.showPremiumPopup = showPremiumPopup;
window.showGuide = showGuide;
