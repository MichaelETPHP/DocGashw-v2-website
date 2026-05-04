import { env } from '$env/dynamic/private';

/**
 * Sends a notification to a Telegram channel.
 * @param {string} text - The message text (Markdown supported).
 * @param {string|null} imageUrl - Optional image URL to send as a photo.
 * @param {object|null} buttons - Optional inline keyboard markup.
 */
export async function sendTelegramNotification(text, images = null, buttons = null) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHANNEL_ID;

  if (!token || !chatId) {
    console.warn('Telegram bot token or channel ID not configured.');
    return;
  }

  const baseUrl = `https://api.telegram.org/bot${token}`;
  const imageList = Array.isArray(images) ? images.filter(url => url && url.startsWith('http')) : (images ? [images] : []);
  
  try {
    const commonPayload = {
      chat_id: chatId,
      parse_mode: 'Markdown'
    };

    if (imageList.length > 1) {
      // Send media group for images 1-4
      const media = imageList.slice(0, 4).map((url, i) => ({
        type: 'photo',
        media: url,
        // The text is set as caption for the first image only
        caption: i === 0 ? text : undefined,
        parse_mode: 'Markdown'
      }));

      await fetch(`${baseUrl}/sendMediaGroup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          media
        })
      });
      // Buttons are removed here because sendMediaGroup doesn't support them 
      // and sending a separate message causes the "duplicate" issue you reported.
    } else if (imageList.length === 1) {
      // Single photo
      await fetch(`${baseUrl}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...commonPayload,
          photo: imageList[0],
          caption: text,
          reply_markup: buttons ? { inline_keyboard: buttons } : undefined
        })
      });
    } else {
      // Text only
      await sendTextMessage(baseUrl, text, commonPayload, buttons);
    }
  } catch (err) {
    console.error('Telegram notification failed:', err);
  }
}

async function sendTextMessage(baseUrl, text, payload, buttons = null) {
  const response = await fetch(`${baseUrl}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      text: text,
      reply_markup: buttons ? { inline_keyboard: buttons } : undefined
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Telegram sendMessage error:', error);
  }
}
