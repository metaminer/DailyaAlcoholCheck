import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')!;
const CRON_SECRET = Deno.env.get('CRON_SECRET')!;

Deno.serve(async (req) => {
  // cron-job.org 에서 보내는 요청 검증
  const auth = req.headers.get('Authorization');
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 한국 시간 기준 오늘 날짜
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

  const { data } = await sb
    .from('alcohol_records')
    .select('id')
    .eq('date', today)
    .maybeSingle();

  if (data) {
    // 이미 오늘 기록 있음 → 알림 생략
    return new Response(JSON.stringify({ sent: false, reason: 'already recorded' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 텔레그램 메시지 발송
  const message = `📅 *음주달력 리마인더*\n\n오늘 기록이 아직 없어요\\.\n음주 여부를 기록해보세요\\!\n\n[👉 기록하러 가기](https://dailya-alcohol-check\\.vercel\\.app)`;

  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'MarkdownV2',
      }),
    }
  );

  const result = await res.json();
  return new Response(JSON.stringify({ sent: result.ok === true, telegram: result }), {
    status: res.ok ? 200 : 502,
    headers: { 'Content-Type': 'application/json' },
  });
});
