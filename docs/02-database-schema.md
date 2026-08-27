# 데이터베이스 스키마

## 플랫폼
Supabase (PostgreSQL)

## 테이블: `alcohol_records`

### 컬럼 정의

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 고유 식별자 |
| `date` | DATE | NOT NULL, UNIQUE | 기록 날짜 (하루에 1건만 허용) |
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

-- 로그인한 사용자만 접근 허용
CREATE POLICY "Authenticated users only" ON alcohol_records
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
```

## 초기화 SQL

전체 SQL은 프로젝트 루트의 `supabase-setup.sql` 파일 참고.
