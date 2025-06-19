const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event) => {
  const url = 'https://tracker.gg/valorant/profile/riot/SEN%20Sakura%20鬼%23Kurai/overview';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const $ = cheerio.load(html);

  const rank = $('span.valorant-highlighted-stat__value').first().text().trim() || 'N/A';
  const matches = $('div.match__content').slice(0,3);
  const games = [];
  matches.each((i, el) => {
    const result = $(el).find('div.match__result').text().trim();
    const rr = $(el).find('div.match__rating').text().trim();
    if (result && rr) games.push(`${result} ${rr}`);
  });

  const path = event.path.replace('/', '');
  if (path === 'record') {
    return {
      statusCode: 200,
      body: games.join(' | ')
    };
  } else {
    return {
      statusCode: 200,
      body: rank
    };
  }
};
