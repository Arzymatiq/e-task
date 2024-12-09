const BOT_TOKEN = '7130780522:AAGcTJSP6MKAbYcZ5GWpOvcg0xJLODbFJEo';
const TELEGRAM_API_URL = `https://api.telegram.org/bot7130780522:AAGcTJSP6MKAbYcZ5GWpOvcg0xJLODbFJEo/sendMessage`;
const CHAT_ID = '267400901';

export async function sendMessageToTelegram(message) {
  try {
    await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML', // РЈРєР°Р·Р°РЅРёРµ СЂРµР¶РёРјР° С„РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёСЏ
      }),
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    throw new Error('Error sending message to Telegram');
  }
}
