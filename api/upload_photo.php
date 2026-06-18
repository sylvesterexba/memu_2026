<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => '不支援的請求方法'], 405);
}

if (!isset($_FILES['photo']) || !is_uploaded_file($_FILES['photo']['tmp_name'])) {
    json_response(['ok' => false, 'message' => '沒有收到照片檔案'], 400);
}

$file = $_FILES['photo'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    json_response(['ok' => false, 'message' => '照片上傳失敗'], 400);
}

if ($file['size'] > 8 * 1024 * 1024) {
    json_response(['ok' => false, 'message' => '照片大小不可超過 8MB'], 400);
}

$info = getimagesize($file['tmp_name']);
if ($info === false) {
    json_response(['ok' => false, 'message' => '檔案不是有效圖片'], 400);
}

$allowed = [
    IMAGETYPE_JPEG => 'jpg',
    IMAGETYPE_PNG => 'png',
    IMAGETYPE_WEBP => 'webp',
    IMAGETYPE_GIF => 'gif',
];

$type = $info[2];
if (!isset($allowed[$type])) {
    json_response(['ok' => false, 'message' => '只支援 JPG、PNG、WEBP、GIF'], 400);
}

$uploadDir = dirname(__DIR__) . '/uploads';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

$filename = date('YmdHis') . '_' . bin2hex(random_bytes(6)) . '.' . $allowed[$type];
$target = $uploadDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    json_response(['ok' => false, 'message' => '無法儲存照片'], 500);
}

$url = 'uploads/' . $filename;
$stmt = db()->prepare('INSERT INTO resume_photos (filename, url) VALUES (?, ?)');
$stmt->execute([$file['name'], $url]);

json_response([
    'ok' => true,
    'url' => $url,
    'name' => $file['name'],
]);
