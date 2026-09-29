import { PUBLIC_PINS } from "./catalog";

export function socialFeed(stats) {
  const tiktok = stats?.tiktok?.recent || [];
  const instagram = stats?.instagram?.recent || [];
  const pinterest = stats?.pinterest?.recent?.length ? stats.pinterest.recent : PUBLIC_PINS;
  return { tiktok, instagram, pinterest };
}
