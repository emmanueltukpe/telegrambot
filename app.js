require("dotenv").config();
const express = require("express");
const { parseHTMLPage } = require("./html");
const { convertTextToAudio } = require("./convert");
const app = express();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TOKEN);
bot.start((ctx) => ctx.reply("Welcome to Big Mouth"));
bot.help((ctx) =>
  ctx.reply(
    "The program start by converting the blogpost from the url into plain text. The text will then be passed to google-tts-api to convert the text into splitted audio files . With the help of a special package FFMPEG the splitted audio files will then be merged back into one whole file and be stored in filename given to the CLI at the start of the program."
  )
);

bot.hears(/\/bigmouth (.+)/, async (ctx) => {
  const url = ctx.match[1];
  const text = await parseHTMLPage(url);
  const splittedtext = url.split("/");
  const blogTitle =
    splittedtext[splittedtext.length - 1] == ""
      ? `${splittedtext[splittedtext.length - 2].substring(0, 25)}.mp3`
      : `${splittedtext[splittedtext.length - 1].substring(0, 25)}.mp3`;
  const audio = `${blogTitle}.mp3`;
  await convertTextToAudio(text, audio);
  ctx.replyWithAudio({ source: `./${blogTitle}.mp3` });
});

bot.on("text", (ctx) => {
  ctx.telegram.sendMessage(ctx.message.chat.id, `Hi there`);
});
bot.launch();

app.get('/', (req, res) => {
  res.status(200).json({ status: 'UP' });
});
app.listen(process.env.PORT || 5000, async () => {
  console.log(`App running on port ${process.env.PORT || 5000}`);
});
