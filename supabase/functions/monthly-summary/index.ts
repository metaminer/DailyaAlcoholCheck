import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')!;
const CRON_SECRET = Deno.env.get('CRON_SECRET')!;

Deno.serve(async (req) => {
  const auth = req.headers.get('Authorization');
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 한국 시간 기준 지난달 계산
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

  const startDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`;
  const endDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${daysInPrevMonth}`;

  const { data, error } = await sb
    .from('alcohol_records')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const records = data || [];
  const drinkDays = records.length;
  const soberDays = daysInPrevMonth - drinkDays;
  const totalGlasses = records.reduce((sum, r) => sum + (r.glasses || 0), 0);
  const drinkRate = Math.round(drinkDays / daysInPrevMonth * 100);
  const avgGlasses = drinkDays > 0 ? (totalGlasses / drinkDays).toFixed(1) : '0';

  const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const monthLabel = MONTH_NAMES[prevMonth - 1];

  const message = [
    `📊 *${prevYear}년 ${monthLabel} 음주 결과*`,
    ``,
    `🍶 음주일: *${drinkDays}일* / ${daysInPrevMonth}일`,
    `🌿 절주일: *${soberDays}일*`,
    `📈 음주율: *${drinkRate}%*`,
    `🥃 총 음주량: *${totalGlasses}캔*`,
    `📉 음주일 평균: *${avgGlasses}캔*`,
    ``,
    `[👉 통계 자세히 보기](https://dailya\\-alcohol\\-check\\.vercel\\.app/stats\\.html)`,
  ].join('\n');

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
  return new Response(JSON.stringify({ sent: true, month: monthLabel, drinkDays, telegram: result }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
