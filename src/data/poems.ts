export interface Poem {
  title: string
  author: string
  dynasty: string
  content: string
  appreciation: string
}

let poemsCache: Poem[] = [];

export async function getPoems(): Promise<Poem[]> {
  if (poemsCache.length > 0) {
    return poemsCache;
  }

  try {
    const urls = [
      'https://pub-707dbd0d846f49a7be5c10bda803d1a2.r2.dev/poem.json',
      'https://pub-707dbd0d846f49a7be5c10bda803d1a2.r2.dev/poem1.json',
      'https://pub-707dbd0d846f49a7be5c10bda803d1a2.r2.dev/poem2.json'
    ];

    const responses = await Promise.all(urls.map(url => fetch(url)));
    const results = await Promise.all(responses.map(async response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch poems from ${response.url}`);
      }
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('JSON parse error:', e);
        return [];
      }
    }));

    poemsCache = results.flat().filter(poem => 
      poem && 
      typeof poem === 'object' && 
      'title' in poem && 
      'author' in poem && 
      'dynasty' in poem && 
      'content' in poem
    );
    
    if (poemsCache.length === 0) {
      throw new Error('No valid poems found in the response');
    }
    
    return poemsCache;
  } catch (error) {
    console.error('Error fetching poems:', error);
    // 如果CDN加载失败，使用本地数据作为后备
    return [
      {
        title: "梦微之",
        author: "白居易",
        dynasty: "唐",
        content: "夜来携手梦同游，晨起盈巾泪莫收。\n漳浦老身三度病，咸阳宿草八回秋。\n君埋泉下泥销骨，我寄人间雪满头。\n阿卫韩郎相次去，夜台茫昧得知不？\n",
        appreciation: ""
      }
    ];
  }
}