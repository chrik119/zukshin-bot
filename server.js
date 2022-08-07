import tmiJs from 'tmi.js';
import connect from './lib/database.js';
import Task from './models/Task.js';
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
await connect();

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  try {
    const [raw, command, args] = message.toLowerCase().match(regexpCommand);

    if (command === 'hello') {
      client.say(channel, `@${tags.username}, heya!`);
    }
  } catch (err) {}
  return;
});

const handleTask = ({ task, args }) => {
  if ((task = 'newUser')) {
    client.say('zukshin', `Thanks for joining Zukshin Domain @${args[0]}!`);
  } else {
    console.error(`Unhandled Task: ${task}`);
  }
};

let errorCount = 0;
let ms = 120000;
const pullTasks = async () => {
  if (errorCount < 5) {
    try {
      const task = await Task.findOneAndDelete({});

      errorCount = 0;
      if (!task) {
        ms = 120000; // 2mins
        return;
      }

      handleTask(task);
      ms = 100;
      return;
    } catch (err) {
      ms = 120000; // 2mins
      console.log(err);
      errorCount++;
    }
  } else {
    console.log(`I'm Broken :(`);
    ms = 1800000; // 30mins
  }
};

setInterval(pullTasks, ms);
