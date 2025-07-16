const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const waiting = [];
const pairs = {};

bot.start((ctx) => {
  const id = ctx.from.id;
  if (waiting.includes(id)) return ctx.reply('منتظری...');
  if (pairs[id]) return ctx.reply('در حال چت ناشناس هستی.');

  if (waiting.length > 0) {
    const other = waiting.shift();
    pairs[id] = other;
    pairs[other] = id;
    bot.telegram.sendMessage(id, 'وصل شدی به یک نفر. چت کن!');
    bot.telegram.sendMessage(other, 'وصل شدی. شروع کن!');
    console.log(`Connected: ${id} ↔️ ${other}`);
  } else {
    waiting.push(id);
    ctx.reply('در حال اتصال، صبر کن...');
  }
});

bot.command('stop', (ctx) => {
  const id = ctx.from.id;
  if (waiting.includes(id)) {
    waiting.splice(waiting.indexOf(id), 1);
    return ctx.reply('خروج از صف...');
  }
  const other = pairs[id];
  if (other) {
    bot.telegram.sendMessage(other, 'چت بسته شد.');
    delete pairs[other];
    delete pairs[id];
    ctx.reply('چت رو ترک کردی.');
  } else ctx.reply('هیچ چتی فعال نیست.');
});

bot.on('text', (ctx) => {
  const id = ctx.from.id;
  const other = pairs[id];
  if (!other) return ctx.reply('برای شروع چت، /start بزن.');
  bot.telegram.sendMessage(other, ctx.message.text);
});
import os
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('سلام! من ربات شما هستم.')

def main():
    # توکن ربات خود را قرار دهید
    updater = Updater("YOUR_BOT_TOKEN")
    dispatcher = updater.dispatcher
    dispatcher.add_handler(CommandHandler("start", start))

    # دریافت پورت از متغیر محیطی
    port = os.environ.get('PORT', 5000)  # اگر پورت مشخص نشد، 5000 به طور پیشفرض استفاده می‌شود
    updater.start_polling()

    # متوقف کردن ربات و استفاده از پورت مشخص شده
    updater.idle()

if __name__ == '__main__':
    main()

bot.launch().then(() => console.log('Bot started...')).catch((err) => {
  console.error('Launch error:', err);
});
