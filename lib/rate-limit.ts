type Bucket = { count: number; resetAt: number };

const memory = new Map<string, Bucket>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 10;

async function upstashCheck(key: string): Promise<{ allowed: boolean; remaining: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { allowed: true, remaining: -1 };

  const fullKey = `rl:${key}`;
  try {
    const incr = await fetch(`${url}/incr/${fullKey}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json() as Promise<{ result: number }>);

    if (incr.result === 1) {
      await fetch(`${url}/expire/${fullKey}/${Math.floor(WINDOW_MS / 1000)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return {
      allowed: incr.result <= MAX_REQUESTS,
      remaining: Math.max(0, MAX_REQUESTS - incr.result),
    };
  } catch {
    return { allowed: true, remaining: -1 };
  }
}

function memoryCheck(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = memory.get(key);
  if (!bucket || bucket.resetAt < now) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }
  bucket.count += 1;
  return {
    allowed: bucket.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - bucket.count),
  };
}

export async function rateLimit(key: string) {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return upstashCheck(key);
  }
  return memoryCheck(key);
}
