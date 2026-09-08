const PROFILE_URL = 'https://community.powerplatform.com/profile/?userid=f5181eed-0df4-ef11-be20-7c1e5282477e';
const COMMUNITY_ORIGIN = 'https://community.powerplatform.com';

const decodeEntities = value => String(value)
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));

const cleanText = html => decodeEntities(
  String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
);

const extractPosts = html => {
  const posts = [];
  const seen = new Set();
  const linkPattern = /<a\b[^>]*href=["']([^"']*\/blogs\/post\/\?postid=[^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(html)) !== null) {
    const title = cleanText(match[2]);
    if (!title || /^image$/i.test(title) || title.length < 6) continue;

    let url;
    try {
      url = new URL(decodeEntities(match[1]), COMMUNITY_ORIGIN).toString();
    } catch {
      continue;
    }

    // The public profile page can contain repeated navigation/markup; keep each post once.
    const postId = new URL(url).searchParams.get('postid');
    if (!postId || seen.has(postId)) continue;
    seen.add(postId);
    posts.push({ title, url });
  }

  return posts;
};

exports.handler = async () => {
  try {
    const response = await fetch(PROFILE_URL, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; HaseebAhmadPortfolio/1.0; +https://haseebahmadcrm.netlify.app/)'
      }
    });

    if (!response.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ error: `Power Platform Community returned ${response.status}` })
      };
    }

    const html = await response.text();
    const posts = extractPosts(html);

    if (!posts.length) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ error: 'No public blog posts found on the profile page.' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400'
      },
      body: JSON.stringify({ posts, source: PROFILE_URL, updatedAt: new Date().toISOString() })
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: error.message || 'Unable to sync community blogs.' })
    };
  }
};

// Exported for lightweight local/unit testing; ignored by Netlify runtime.
exports._extractPosts = extractPosts;
