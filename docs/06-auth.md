# 인증 (Authentication)

## 방식
Supabase Auth — 이메일 + 비밀번호 (단일 계정, 개인 전용)

## 파일 구성

| 파일 | 역할 |
|------|------|
| `login.html` | 로그인 페이지 (이메일/비밀번호 폼) |
| `index.html` | 진입 시 세션 체크 → 미인증이면 login.html로 리다이렉트 |
| `stats.html` | 진입 시 세션 체크 → 미인증이면 login.html로 리다이렉트 |

## 인증 흐름

```
접속
 └─ getSession() 확인
      ├─ 세션 없음 → login.html 리다이렉트
      └─ 세션 있음 → 정상 진입
           └─ 로그아웃 버튼 → signOut() → login.html 리다이렉트
```

## 계정 관리

계정은 **Supabase 대시보드에서만** 관리 (앱 내 회원가입 없음):
- 생성: Authentication → Users → Add user → Create new user
- 비밀번호 변경: 해당 유저 클릭 → Send password recovery (이메일로 링크 발송)

## RLS 정책

```sql
-- 로그인한 사용자만 데이터 접근 허용
CREATE POLICY "Authenticated users only" ON alcohol_records
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
```

## Supabase Auth 설정 주의사항

- **Email confirmations**: Supabase 기본값은 이메일 인증 필요. 대시보드에서 직접 Add user하면 이메일 인증 없이 계정 생성됨
- Authentication → Providers → Email → "Confirm email" 옵션 비활성화 시 이메일 인증 생략 가능 (개인 프로젝트에서는 무방)
