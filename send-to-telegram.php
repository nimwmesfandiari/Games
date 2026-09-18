<?php
// telegram-send.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// دریافت داده‌های POST
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'داده‌ای دریافت نشد']);
    exit;
}

// تنظیمات ربات تلگرام (توکن شما)
$botToken = '8952444394:AAEwKjAKdBaUrayJ6DTxVXpM-8XXta9zbWE';
$chatId = '8292875503';

// ساخت پیام
$message = "🎮 *ثبت نام جدید در بازی*\n\n" .
           "👤 *نام:* " . ($data['fullName'] ?? '') . "\n" .
           "📱 *شماره:* " . ($data['phone'] ?? '') . "\n" .
           "🆔 *کد ملی:* " . ($data['nationalCode'] ?? '') . "\n" .
           "🎂 *تاریخ تولد:* " . ($data['birthDate'] ?? '') . "\n" .
           "⏰ *زمان ثبت:* " . ($data['timestamp'] ?? '') . "\n" .
           "🌐 *IP:* " . ($_SERVER['REMOTE_ADDR'] ?? 'نامشخص') . "\n" .
           "🔗 *مرورگر:* " . ($_SERVER['HTTP_USER_AGENT'] ?? 'نامشخص');

// ارسال به تلگرام
$url = "https://api.telegram.org/bot$botToken/sendMessage";
$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'Markdown'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$responseArray = json_decode($response, true);

if ($responseArray && $responseArray['ok']) {
    echo json_encode([
        'success' => true,
        'message' => 'اطلاعات با موفقیت ارسال شد'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'خطا در ارسال اطلاعات: ' . ($responseArray['description'] ?? 'خطای نامشخص')
    ]);
}
?>
