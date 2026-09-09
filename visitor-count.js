const STORE_NAME = "portfolio-stats";
const COUNTER_KEY = "unique-visitors";

async function readCount(store) {
  const entry = await store.getWithMetadata(COUNTER_KEY, {
    type: "json",
    consistency: "strong"
  });

  return Number(entry?.data?.count || 0);
}

async function incrementCount(store) {
  // ETag-based retry avoids losing increments when two visitors arrive together.
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const entry = await store.getWithMetadata(COUNTER_KEY, {
      type: "json",
      consistency: "strong"
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

exports.handler = async (event) => {
  try {
    const { connectLambda, getStore } = await import("@netlify/blobs");

    // Required when using the Lambda-compatible Netlify Function format.
    connectLambda(event);

    const store = getStore({
      name: STORE_NAME,
      consistency: "strong"
    });

    let count;
    if (event.httpMethod === "POST") {
      count = await incrementCount(store);
    } else if (event.httpMethod === "GET") {
      count = await readCount(store);
    } else {
      return {
        statusCode: 405,
        headers: { Allow: "GET, POST" },
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      },
      body: JSON.stringify({ count })
    };
  } catch (error) {
    console.error("Visitor counter error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Unable to load visitor count" })
    };
  }
};
