import tmiJs from 'tmi.js';
import dotenv from 'dotenv';

dotenv.config();

const regexpCommand = new RegExp(/^!([a-z0-9]+)(?:W+)?(.*)?/);

const client = new tmiJs.Client({
  options: { debug: true },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  channels: ['zukshin'],
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  try{
    const [raw, command, args] = message.toLowerCase().match(regexpCommand);

    if (command === 'hello') {
      client.say(channel, `@${tags.username}, heya!`);
    }
  }catch(err){
    continue;
  }
  return;
});
