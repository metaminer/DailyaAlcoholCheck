# 프로젝트 개요

## 프로젝트명
**DailyaAlcohol** — 달력 기반 음주 기록 관리 웹 애플리케이션

## 목적
날짜별 음주 여부, 주종, 음주량을 달력에 기록하고 통계로 확인하는 개인용 웹페이지

## 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | 순수 HTML / CSS / JavaScript | 프레임워크 없음 |
| 스타일링 | Tailwind CSS | CDN 방식 |
| 데이터베이스 | Supabase (PostgreSQL) | CDN JS 클라이언트 사용 |
| 차트 | Chart.js v4 | CDN 방식, stats 페이지 전용 |
| 호스팅 | Vercel | 정적 파일 배포 |
| 형상관리 | GitHub | https://github.com/metaminer/DailyaAlcoholCheck |

## 파일 구조

```
DailyaAlcoholProject/
├── index.html            # 달력 메인 페이지
├── stats.html            # 통계 대시보드 페이지
├── js/
│   └── config.js         # Supabase 접속 설정 (URL, anon key)
├── supabase-setup.sql    # DB 테이블 및 RLS 초기화 SQL
├── docs/                 # 프로젝트 문서
│   ├── 01-project-overview.md
│   ├── 02-database-schema.md
│   ├── 03-features.md
│   ├── 04-supabase-setup.md
│   └── 05-vercel-deploy.md
└── .gitignore
```

## 페이지 구성

| 페이지 | 파일 | 주요 역할 |
|--------|------|-----------|
| 달력 | `index.html` | 월별 달력, 날짜 클릭으로 기록 입력/수정/삭제 |
| 통계 | `stats.html` | 요약 카드, 월별 추이 차트, 주종 분포 차트, 최근 기록 목록 |

## 작업 이력

| 날짜 | 내용 |
|------|------|
| 2026-08-27 | 초기 프로젝트 생성, 전체 파일 구현, GitHub 푸시 |
