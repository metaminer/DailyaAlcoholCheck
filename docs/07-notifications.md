# 알림 설정

## 구성

| 구성요소 | 역할 |
|----------|------|
| Telegram Bot | 메시지 수신 채널 |
| Supabase Edge Functions | 알림 로직 실행 |
| cron-job.org | Edge Function 스케줄 트리거 |

## Edge Functions

### 1. `daily-reminder`
매일 아침 오늘 기록이 없을 경우에만 알림 발송.

- **엔드포인트**: `https://yzmvfuekkjpwmissjisz.supabase.co/functions/v1/daily-reminder`
- **스케줄**: `10 0 * * *` (KST 09:10)
- **로직**: 오늘 날짜(KST 기준) 기록 조회 → 없으면 텔레그램 메시지 발송
- **메시지**: 기록 독려 + 앱 바로가기 링크

### 2. `monthly-summary`
매월 1일 전달 음주 결과 요약 알림 발송.

- **엔드포인트**: `https://yzmvfuekkjpwmissjisz.supabase.co/functions/v1/monthly-summary`
- **스케줄**: `10 0 1 * *` (매월 1일 KST 09:10)
- **로직**: 지난달 전체 기록 집계 → 통계 요약 텔레그램 메시지 발송
- **메시지 포함 항목**: 음주일, 절주일, 음주율, 총 음주량, 음주일 평균, 통계 페이지 링크

### 3. `telegram-webhook`
리마인더 메시지의 인라인 버튼(예/아니오) 클릭을 처리.

- **트리거**: Telegram Webhook (`setWebhook`, `secret_token` 헤더로 인증 — JWT 검증 끔)
- **예**: 해당 날짜에 1캔으로 기록 (메모: "텔레그램 간편 기록"). 이미 기록이 있으면 덮어쓰지 않음
- **아니오**: 기록 없이 절주로 간주, 버튼 제거
- 설정 채팅(`TELEGRAM_CHAT_ID`)에서 온 요청만 처리

배포 및 웹훅 등록:

```bash
supabase secrets set TELEGRAM_WEBHOOK_SECRET=<임의 문자열>
supabase functions deploy telegram-webhook --no-verify-jwt
supabase functions deploy daily-reminder
curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -d "url=https://yzmvfuekkjpwmissjisz.supabase.co/functions/v1/telegram-webhook" \
  -d "secret_token=<위와 같은 문자열>"
```

## Supabase Secrets

| Key | 설명 |
|-----|------|
| `TELEGRAM_BOT_TOKEN` | BotFather에서 발급한 봇 토큰 |
| `TELEGRAM_CHAT_ID` | 메시지 수신할 채팅 ID |
| `CRON_SECRET` | cron-job.org 요청 인증용 임의 문자열 |
| `TELEGRAM_WEBHOOK_SECRET` | 텔레그램 웹훅 요청 인증용 임의 문자열 |

## cron-job.org 설정

| Job | URL | Schedule | Header |
|-----|-----|----------|--------|
| 일일 리마인더 | `.../daily-reminder` | `10 0 * * *` | `Authorization: Bearer dailya2026secret` |
| 월간 요약 | `.../monthly-summary` | `10 0 1 * *` | `Authorization: Bearer dailya2026secret` |

## 보안

- 모든 Edge Function은 `Authorization: Bearer <CRON_SECRET>` 헤더 검증
- `SUPABASE_SERVICE_ROLE_KEY`는 Supabase가 자동 주입 (직접 설정 불필요)
- Secrets는 Supabase 대시보드 또는 CLI(`supabase secrets set`)로만 관리
