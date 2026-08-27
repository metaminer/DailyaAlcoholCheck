# Vercel 배포 가이드

## 전제 조건

- GitHub 레포에 코드가 푸시되어 있을 것
- `js/config.js`에 실제 Supabase URL과 anon key가 입력되어 있을 것

> **GitHub Public 레포 주의:** `js/config.js`에 Supabase 키가 노출됩니다.
> anon key는 클라이언트용으로 설계되어 공개되어도 무방하지만,
> Supabase RLS 정책이 올바르게 설정되어 있는지 반드시 확인하세요.

## 배포 방법 (GitHub 연동 — 권장)

### 1단계: Vercel 로그인
1. [https://vercel.com](https://vercel.com) 접속
2. **Continue with GitHub** 로 로그인

### 2단계: 프로젝트 Import
1. **Add New Project** 클릭
2. GitHub 레포 목록에서 `DailyaAlcoholCheck` 선택
3. **Import** 클릭

### 3단계: 배포 설정
순수 HTML 정적 파일이므로 별도 설정 없이 그대로 진행:

| 항목 | 값 |
|------|-----|
| Framework Preset | Other |
| Root Directory | `.` (루트) |
| Build Command | (비워두기) |
| Output Directory | (비워두기) |

4. **Deploy** 클릭

### 4단계: 배포 확인
- 약 30초~1분 후 배포 완료
- 자동 생성된 URL (예: `https://dailya-alcohol-check.vercel.app`) 접속하여 확인

## 이후 업데이트 방법

`main` 브랜치에 push할 때마다 Vercel이 자동으로 재배포함:

```bash
git add .
git commit -m "수정 내용"
git push origin main
```

## 커스텀 도메인 연결 (선택)

1. Vercel 프로젝트 대시보드 → **Settings** → **Domains**
2. 도메인 입력 후 **Add**
3. 도메인 DNS 설정에서 Vercel이 안내하는 CNAME 또는 A 레코드 추가
