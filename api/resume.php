<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->prepare('SELECT data FROM resume_pages WHERE slug = ? LIMIT 1');
    $stmt->execute(['main']);
    $row = $stmt->fetch();

    if (!$row) {
        json_response(['ok' => false, 'message' => '尚未建立前台資料'], 404);
    }

    $data = json_decode($row['data'], true);
    if (!is_array($data)) {
        json_response(['ok' => false, 'message' => '資料格式不正確'], 500);
    }

    json_response(['ok' => true, 'data' => $data]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!is_array($data)) {
        json_response(['ok' => false, 'message' => '資料格式不正確'], 400);
    }

    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $stmt = db()->prepare(
        'INSERT INTO resume_pages (slug, data)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = CURRENT_TIMESTAMP'
    );
    $stmt->execute(['main', $json]);

    json_response(['ok' => true]);
}

json_response(['ok' => false, 'message' => '不支援的請求方法'], 405);
