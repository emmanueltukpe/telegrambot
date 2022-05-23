require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const { TOKEN, SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app = express();
app.use(bodyParser.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

app.post(URI, async (req, res) => {
  console.log(req.body);
  const chatId = req.body.message.chat.id
    if (req.body.message.text === '/start'){
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id:chatId,
            text: "Big Mouth"
        });
    }

    else if (req.body.message.text === '/help') {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id:chatId,
            text: "The program start by converting the blogpost from the url into plain text. The text will then be passed to google-tts-api to convert the text into splitted audio files . With the help of a special package FFMPEG the splitted audio files will then be merged back into one whole file and be stored in filename given to the CLI at the start of the program."
        });
    }
  else {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id:chatId,
        text: "Hi there"
    });
  }



  return res.send();
});

app.listen(process.env.PORT || 5000, async () => {
  console.log(`App running on port ${process.env.PORT || 5000}`);
  await init();
});
