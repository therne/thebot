
const { Bot, ConsoleChannel, regexParser } = require('.');
const sleep = require('sleep-promise');

const bot = new Bot();
bot.incoming.use(regexParser({
    weather: /weather/g,
    hello: /hello/g,
}));

bot.when('weather', async ({i}) => {
    const {text} = await i.ask('지역이 어디에요?');
    await i.speak(`오늘의 ${text} 지역의 날씨는...`);
    await sleep(1600);

    await i.speak('모르겠습니다!')
});

bot.when('hello', async ({i}) => {
    await i.speak('Fuck u!!!!!!!!!!!!!!');
});

bot.use(async ({i}) => {
    i.speak('뭐어라고~? 찐따가 하는 말이라 못알아듣겠는데~?')
});

const channel = new ConsoleChannel();
channel.start(bot);