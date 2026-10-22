CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('pageview','click')),
  page TEXT NOT NULL,
  target TEXT NOT NULL,
  referrer TEXT NOT NULL,
  ip TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  asn INTEGER,
  network TEXT NOT NULL,
  ua TEXT NOT NULL,
  details TEXT NOT NULL CHECK(length(details) <= 4096)
);
CREATE INDEX IF NOT EXISTS events_at ON events(at);
CREATE INDEX IF NOT EXISTS events_ip_id ON events(ip,id);
CREATE TABLE IF NOT EXISTS daily_usage (day TEXT PRIMARY KEY, events INTEGER NOT NULL);
-- These bounds are atomic even when requests arrive concurrently in different regions.
CREATE TRIGGER IF NOT EXISTS event_daily_cap BEFORE INSERT ON events
WHEN COALESCE((SELECT events FROM daily_usage WHERE day = strftime('%Y-%m-%d',NEW.at,'unixepoch')),0) >= 5000
BEGIN SELECT RAISE(IGNORE); END;
CREATE TRIGGER IF NOT EXISTS event_accounting AFTER INSERT ON events
BEGIN
  INSERT INTO daily_usage(day,events) VALUES(strftime('%Y-%m-%d',NEW.at,'unixepoch'),1)
    ON CONFLICT(day) DO UPDATE SET events=events+1;
  DELETE FROM events WHERE id <= NEW.id - 50000;
END;
CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS login_budget (id INTEGER PRIMARY KEY CHECK(id=1), window INTEGER NOT NULL, attempts INTEGER NOT NULL);
