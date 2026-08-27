# Supabase 설정 가이드

## 1. 프로젝트 생성

1. [https://supabase.com](https://supabase.com) 접속 및 로그인
2. **New Project** 클릭
3. Organization 선택 → 프로젝트 이름 입력 → 비밀번호 설정 → 리전 선택 (Northeast Asia 권장)
4. **Create new project** 클릭 후 약 1~2분 대기

## 2. 테이블 생성

1. 좌측 메뉴 **SQL Editor** 클릭
2. **New Query** 클릭
3. 프로젝트 루트의 `supabase-setup.sql` 전체 내용 붙여넣기
4. **Run** (또는 Ctrl+Enter) 실행

실행 결과 확인:
- 좌측 **Table Editor**에서 `alcohol_records` 테이블이 생성되었는지 확인

## 3. API 키 확인

1. 좌측 하단 **Project Settings** 클릭
2. **API** 탭 선택
3. 아래 두 값 복사:

| 항목 | 위치 |
|------|------|
| Project URL | `https://xxxxxxxxxxxx.supabase.co` |
| anon public key | `eyJhbGci...` (JWT 형식의 긴 문자열) |

## 4. 프로젝트에 키 입력

`js/config.js` 파일을 열어 아래 두 줄 수정:

```js
const SUPABASE_URL = 'https://xxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 5. RLS 정책 확인

1. **Table Editor** → `alcohol_records` 테이블 선택
2. 상단 **RLS** 버튼 클릭
3. "Allow all operations" 정책이 활성화되어 있는지 확인

## 주의사항

- `anon public key`는 클라이언트에 노출되어도 안전하나, GitHub Public 레포에 올릴 경우 RLS가 반드시 활성화되어 있어야 함
- `service_role key`는 절대 클라이언트 코드에 넣지 말 것
- 추후 인증(Auth) 추가 시 RLS 정책을 `auth.uid()` 기반으로 교체 필요
