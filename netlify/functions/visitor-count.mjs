import { getStore } from '@netlify/blobs';

const STORE_NAME = 'portfolio-stats';
const COUNTER_KEY = 'unique-visitors';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  }
});

async function readCount(store) {
  const value = await store.get(COUNTER_KEY, {
    type: 'json',
    consistency: 'strong'
  });

  return Number(value?.count || 0);
}

async function incrementCount(store) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const entry = await store.getWithMetadata(COUNTER_KEY, {
      type: 'json',
      consistency: 'strong'
    });

    if (!entry) {
      const created = await store.setJSON(
        COUNTER_KEY,
        { count: 1, updatedAt: new Date().toISOString() },
        { onlyIfNew: true }
      );

      if (created.modified) return 1;
      continue;
    }

    const nextCount = Number(entry.data?.count || 0) + 1;
    const updated = await store.setJSON(
      COUNTER_KEY,
      { count: nextCount, updatedAt: new Date().toISOString() },
      { onlyIfMatch: entry.etag }
    );

    if (updated.modified) return nextCount;
  }

  return readCount(store);
}

export default async (request) => {
  try {
    const store = getStore({
      name: STORE_NAME,
      consistency: 'strong'
    });

    if (request.method === 'GET') {
      return json({ count: await readCount(store) });
    }

    if (request.method === 'POST') {
      return json({ count: await incrementCount(store) });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Allow': 'GET, POST'
      }
    });
  } catch (error) {
    console.error('Visitor counter error:', error);
    return json({
      error: 'Unable to load visitor count',
      message: error?.message || 'Unknown error'
    }, 500);
  }
};
