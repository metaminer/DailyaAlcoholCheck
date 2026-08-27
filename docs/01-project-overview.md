# 프로젝트 개요

## 프로젝트명
**DailyaAlcohol** — 달력 기반 음주 기록 관리 웹 애플리케이션

## 목적
날짜별 음주 여부와 음주량을 달력에 기록하고, 통계 및 텔레그램 알림으로 관리하는 개인용 웹페이지

## 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | 순수 HTML / CSS / JavaScript | 프레임워크 없음 |
| 스타일링 | Tailwind CSS | CDN 방식 |
| 데이터베이스 | Supabase (PostgreSQL) | CDN JS 클라이언트 사용 |
| 인증 | Supabase Auth | 이메일 + 비밀번호, 단일 계정 |
| 차트 | Chart.js v4 | CDN 방식, stats 페이지 전용 |
| 알림 | Supabase Edge Functions + Telegram Bot | 일일/월간 알림 |
| 스케줄러 | cron-job.org | Edge Function 트리거 |
| 호스팅 | Vercel | 정적 파일 배포 |
| 형상관리 | GitHub | https://github.com/metaminer/DailyaAlcoholCheck |

## 파일 구조

```
DailyaAlcoholProject/
├── index.html            # 달력 메인 페이지
├── stats.html            # 통계 대시보드 페이지
├── login.html            # 로그인 페이지
├── js/
│   └── config.js         # Supabase 접속 설정 (URL, anon key)
├── supabase-setup.sql    # DB 테이블 및 RLS 초기화 SQL
├── supabase/
│   └── functions/
│       ├── daily-reminder/   # 일일 기록 리마인더 Edge Function
│       └── monthly-summary/  # 월간 요약 알림 Edge Function
├── docs/
│   ├── 01-project-overview.md
│   ├── 02-database-schema.md
│   ├── 03-features.md
│   ├── 04-supabase-setup.md
│   ├── 05-vercel-deploy.md
│   ├── 06-auth.md
│   └── 07-notifications.md
└── .gitignore
```

## 페이지 구성

| 페이지 | 파일 | 주요 역할 |
|--------|------|-----------|
| 로그인 | `login.html` | 이메일/비밀번호 로그인 |
| 달력 | `index.html` | 월별 달력, 날짜 클릭으로 기록 입력/수정/삭제 |
| 통계 | `stats.html` | 요약 카드, 월별 추이 차트, 최근 기록 목록 |

## 작업 이력

| 날짜 | 내용 |
|------|------|
| 2026-08-27 | 초기 프로젝트 생성, 전체 파일 구현, GitHub 푸시 |
| 2026-08-27 | 다크 테마 UI 전면 재디자인 |
| 2026-08-27 | drink_type 제거, 절주일 표시 추가 |
| 2026-08-27 | Supabase Auth 로그인/로그아웃 추가, RLS 인증 기반으로 변경 |
| 2026-08-27 | 텔레그램 일일 리마인더 / 월간 요약 알림 추가 |
