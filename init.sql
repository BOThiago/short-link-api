-- Create database if not exists
CREATE DATABASE IF NOT EXISTS shortlink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE shortlink;

-- Create urls table
CREATE TABLE IF NOT EXISTS urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  short_code VARCHAR(10) NOT NULL UNIQUE,
  original_url VARCHAR(2000) NOT NULL,
  access_count INT DEFAULT 0 NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  creator_ip VARCHAR(45),
  
  INDEX short_code_idx (short_code),
  INDEX expires_at_idx (expires_at),
  INDEX created_at_idx (created_at)
);

-- Create url_accesses table
CREATE TABLE IF NOT EXISTS url_accesses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url_id INT NOT NULL,
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  user_agent VARCHAR(500),
  ip_address VARCHAR(45),
  referer VARCHAR(1000),
  
  INDEX url_id_idx (url_id),
  INDEX accessed_at_idx (accessed_at),
  INDEX ip_address_idx (ip_address),
  
  FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE
);

-- Insert sample URLs
INSERT INTO urls (short_code, original_url, access_count, expires_at, creator_ip) VALUES 
('test1234', 'https://www.google.com', 25, DATE_ADD(NOW(), INTERVAL 30 DAY), '127.0.0.1'),
('demo5678', 'https://www.github.com', 18, DATE_ADD(NOW(), INTERVAL 15 DAY), '127.0.0.1'),
('sample99', 'https://www.stackoverflow.com', 42, DATE_ADD(NOW(), INTERVAL 7 DAY), '127.0.0.1'),
('news2024', 'https://www.bbc.com/news/technology', 67, DATE_ADD(NOW(), INTERVAL 5 DAY), '192.168.1.10'),
('docs123', 'https://docs.nestjs.com/fundamentals/custom-providers', 35, DATE_ADD(NOW(), INTERVAL 1 DAY), '192.168.1.11'),
('video456', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 156, DATE_ADD(NOW(), INTERVAL 2 DAY), '10.0.0.1'),
('social88', 'https://twitter.com/nestframework', 89, DATE_ADD(NOW(), INTERVAL 14 DAY), '10.0.0.2'),
('shop999', 'https://www.amazon.com/dp/B08N5WRWNW', 73, DATE_ADD(NOW(), INTERVAL 21 DAY), '172.16.0.1'),
('learn55', 'https://www.coursera.org/learn/machine-learning', 29, DATE_ADD(NOW(), INTERVAL 10 DAY), '172.16.0.2'),
('code777', 'https://leetcode.com/problems/two-sum/', 91, DATE_ADD(NOW(), INTERVAL 3 DAY), '192.168.0.100'),
('music44', 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', 134, DATE_ADD(NOW(), INTERVAL 6 DAY), '192.168.0.101'),
('weather1', 'https://weather.com/weather/today/l/USNY0996:1:US', 23, DATE_ADD(NOW(), INTERVAL 1 DAY), '203.0.113.1'),
('crypto22', 'https://coinmarketcap.com/currencies/bitcoin/', 187, DATE_ADD(NOW(), INTERVAL 4 DAY), '203.0.113.2'),
('gaming33', 'https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/', 45, DATE_ADD(NOW(), INTERVAL 8 DAY), '198.51.100.1'),
('blog555', 'https://medium.com/@author/building-scalable-apis-with-nestjs', 38, DATE_ADD(NOW(), INTERVAL 12 DAY), '198.51.100.2');

-- Insert comprehensive access data with varied timestamps
INSERT INTO url_accesses (url_id, accessed_at, user_agent, ip_address, referer) VALUES 
-- Recent accesses (today)
(1, NOW(), 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', '192.168.1.1', 'https://www.google.com/search'),
(6, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', '192.168.1.2', 'https://twitter.com/share'),
(13, DATE_SUB(NOW(), INTERVAL 1 HOUR), 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', '192.168.1.3', 'https://reddit.com/r/cryptocurrency'),
(11, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', '10.0.0.10', 'https://music.apple.com'),

-- Yesterday
(6, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0', '192.168.2.1', 'https://facebook.com/share'),
(6, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 2 HOUR, 'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/121.0 Firefox/121.0', '192.168.2.2', NULL),
(13, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 4 HOUR, 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15', '10.0.0.11', 'https://news.ycombinator.com'),
(4, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 6 HOUR, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '172.16.1.1', 'https://www.linkedin.com/feed'),

-- 2 days ago
(10, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '192.168.3.1', 'https://stackoverflow.com/questions'),
(10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 3 HOUR, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0', '192.168.3.2', NULL),
(2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 5 HOUR, 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0', '172.16.1.2', 'https://dev.to/trending'),

-- 3 days ago
(7, DATE_SUB(NOW(), INTERVAL 3 DAY), 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15', '10.0.0.12', 'https://twitter.com/timeline'),
(11, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 1 HOUR, 'Mozilla/5.0 (Android 13; Mobile; rv:108.0) Gecko/108.0 Firefox/108.0', '192.168.4.1', 'https://open.spotify.com/browse'),
(8, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 7 HOUR, 'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36', '172.16.2.1', 'https://www.google.com/shopping'),

-- 1 week ago
(3, DATE_SUB(NOW(), INTERVAL 7 DAY), 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15', '192.168.5.1', 'https://news.google.com'),
(14, DATE_SUB(NOW(), INTERVAL 7 DAY) + INTERVAL 2 HOUR, 'Mozilla/5.0 (PlayStation 5 5.00) AppleWebKit/605.1.15', '10.0.0.13', NULL),
(5, DATE_SUB(NOW(), INTERVAL 7 DAY) + INTERVAL 4 HOUR, 'Mozilla/5.0 (Nintendo Switch; WifiWebAuthApplet) AppleWebKit/606.4', '192.168.5.2', NULL),

-- 2 weeks ago
(12, DATE_SUB(NOW(), INTERVAL 14 DAY), 'Mozilla/5.0 (Smart TV; Linux; Tizen 6.0) AppleWebKit/537.36', '172.16.3.1', NULL),
(9, DATE_SUB(NOW(), INTERVAL 14 DAY) + INTERVAL 3 HOUR, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.6.1', 'https://www.udemy.com/courses'),

-- 1 month ago
(1, DATE_SUB(NOW(), INTERVAL 30 DAY), 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36', '203.0.113.10', 'https://chrome.google.com/webstore'),
(15, DATE_SUB(NOW(), INTERVAL 30 DAY) + INTERVAL 5 HOUR, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', '198.51.100.10', 'https://medium.com/feed');

-- Additional random accesses to create more realistic data distribution
INSERT INTO url_accesses (url_id, accessed_at, user_agent, ip_address, referer)
SELECT 
    FLOOR(1 + RAND() * 15) as url_id,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY) + INTERVAL FLOOR(RAND() * 24) HOUR as accessed_at,
    CASE FLOOR(RAND() * 5)
        WHEN 0 THEN 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        WHEN 1 THEN 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
        WHEN 2 THEN 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        WHEN 3 THEN 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
        ELSE 'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/121.0 Firefox/121.0'
    END as user_agent,
    CONCAT('192.168.', FLOOR(1 + RAND() * 254), '.', FLOOR(1 + RAND() * 254)) as ip_address,
    CASE FLOOR(RAND() * 4)
        WHEN 0 THEN 'https://www.google.com/search'
        WHEN 1 THEN 'https://twitter.com/share'
        WHEN 2 THEN 'https://www.facebook.com'
        ELSE NULL
    END as referer
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t2,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t3
LIMIT 75; 