-- Supabase SQL Editor 에서 실행하세요
-- Dashboard > SQL Editor > New Query

CREATE TABLE IF NOT EXISTS alcohol_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  glasses INTEGER NOT NULL CHECK (glasses > 0 AND glasses <= 50),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS(행 수준 보안) 활성화
ALTER TABLE alcohol_records ENABLE ROW LEVEL SECURITY;

-- 개인 프로젝트용 정책: 모든 접근 허용
-- (인증 추가 시 이 정책을 수정하세요)
CREATE POLICY "Allow all operations" ON alcohol_records
  FOR ALL USING (true) WITH CHECK (true);
