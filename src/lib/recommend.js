import axios from 'axios';

const RAWG = axios.create({
  baseURL: 'https://api.rawg.io/api',
  params: { key: process.env.RAWG_API_KEY },
});

export async function searchGames({ mood, time, coop, platform }) {
  const platformIds = { pc: '4', xbox: '1', ps: '18', switch: '7', any: '' };
  const tagByMood = {
    chill: ['relaxing','exploration','walking-simulator','cozy'],
    story: ['story-rich','narrative','singleplayer'],
    intense: ['difficult','action','competitive','roguelike'],
    creative: ['sandbox','building','crafting'],
    brainoff: ['arcade','casual','roguelite'],
  };
  const tags = (tagByMood[mood] ?? []).join(',');

  const r = await RAWG.get('/games', {
    params: {
      platforms: platformIds[platform] || undefined,
      tags,
      ordering: '-metacritic',
      page_size: 40,
    },
  });

  const items = (r.data.results || []).map(g => {
    const meta = g.metacritic ?? 70;
    const shortBias = ['short','1-2h'].includes(time) ? (g.playtime <= 5 ? 8 : 0) : 0;
    const coopBias = coop ? ((g.tags || []).some(t => /co-op|coop/i.test(t.name)) ? 6 : -2) : 0;
    const moodBias = 4;
    const score = meta + shortBias + coopBias + moodBias;
    return {
      id: g.id,
      name: g.name,
      score,
      playtime: g.playtime,
      slug: g.slug,
      metacritic: g.metacritic,
      released: g.released,
      storeUrl: `https://rawg.io/games/${g.slug}`,
    };
  });

  items.sort((a,b)=>b.score-a.score);
  return items.slice(0, 6);
}
