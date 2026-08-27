# 데이터베이스 스키마

## 플랫폼
Supabase (PostgreSQL)

## 테이블: `alcohol_records`

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 고유 식별자 |
| `date` | DATE | NOT NULL, UNIQUE | 기록 날짜 (하루에 1건만 허용) |
| `drink_type` | TEXT | NOT NULL | 주종 (소주/맥주/와인/막걸리/양주/기타) |
| `glasses` | INTEGER | NOT NULL, CHECK (1~50) | 음주량 (잔 단위) |
| `memo` | TEXT | nullable | 메모 (선택 입력) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 최초 생성 시각 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 마지막 수정 시각 |

### 제약 사항
- `date` 컬럼에 UNIQUE 제약 → 하루에 기록 1건만 저장
- `glasses` 범위: 1 이상 50 이하

## 보안 설정 (RLS)

```sql
-- RLS 활성화
ALTER TABLE alcohol_records ENABLE ROW LEVEL SECURITY;

-- 개인 프로젝트용 전체 허용 정책
CREATE POLICY "Allow all operations" ON alcohol_records
  FOR ALL USING (true) WITH CHECK (true);
```

> **참고:** 인증(Auth) 추가 시 정책을 `USING (auth.uid() = user_id)` 방식으로 교체 권장

## 초기화 SQL

전체 SQL은 프로젝트 루트의 `supabase-setup.sql` 파일 참고.

## 주종 코드 목록

| 표시값 | 이모지 |
|--------|--------|
| 소주 | 🍶 |
| 맥주 | 🍺 |
| 와인 | 🍷 |
| 막걸리 | 🍵 |
| 양주 | 🥃 |
| 기타 | 🫙 |
