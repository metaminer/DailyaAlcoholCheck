import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')!;
const WEBHOOK_SECRET = Deno.env.get('TELEGRAM_WEBHOOK_SECRET')!;

const APP_URL = 'https://dailya-alcohol-check.vercel.app';
const escapeHtml = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const tg = (method: string, body: unknown) =>
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

Deno.serve(async (req) => {
  // Telegram 이 setWebhook 의 secret_token 을 이 헤더로 보내줌
  if (req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const update = await req.json();
  const cb = update.callback_query;
  if (!cb) return new Response('ok'); // 버튼 클릭 외 업데이트는 무시

  // 본인 채팅에서 온 요청만 처리
  const chatId = cb.message?.chat?.id;
  if (String(chatId) !== String(TELEGRAM_CHAT_ID)) {
    await tg('answerCallbackQuery', { callback_query_id: cb.id });
    return new Response('ok');
  }

  const m = /^([yn]):(\d{4}-\d{2}-\d{2})$/.exec(cb.data ?? '');
  if (!m) {
    await tg('answerCallbackQuery', { callback_query_id: cb.id });
    return new Response('ok');
  }
  const [, answer, date] = m;

  let resultText: string;
  let showLink = false;

  if (answer === 'n') {
    resultText = `🙅 ${date} 절주로 확인했어요. 기록 없이 넘어갑니다.`;
  } else {
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 이미 기록이 있으면 덮어쓰지 않음 (중복 클릭/앱에서 먼저 입력한 경우)
    const { data: existing } = await sb
      .from('alcohol_records')
      .select('glasses')
      .eq('date', date)
      .maybeSingle();

    if (existing) {
      resultText = `ℹ️ ${date} 은(는) 이미 ${existing.glasses}캔으로 기록되어 있어요.`;
    } else {
      const { error } = await sb
        .from('alcohol_records')
        .insert({ date, glasses: 1, memo: '텔레그램 간편 기록' });
      resultText = error
        ? `⚠️ 기록 실패: ${error.message}`
        : `🍺 ${date} 1캔으로 기록했어요. 양은 앱에서 수정할 수 있어요.`;
      showLink = !error;
    }
  }

  await tg('answerCallbackQuery', { callback_query_id: cb.id, text: resultText.slice(0, 200) });
  // 버튼 제거 + 결과 문구로 교체 (재클릭 방지)
  await tg('editMessageText', {
    chat_id: chatId,
    message_id: cb.message.message_id,
    text: escapeHtml(resultText) + (showLink ? `

<a href="${APP_URL}">앱에서 확인하기</a>` : ''),
    parse_mode: 'HTML',
  });

  return new Response('ok');
});
