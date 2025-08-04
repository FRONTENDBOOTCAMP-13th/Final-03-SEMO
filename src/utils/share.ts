interface sharePost {
  url?: string;
}

export async function sharePost(data: sharePost): Promise<boolean> {
  const { url = window.location.href } = data;

  const shareData = {
    url: url,
  };

  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return true;
    } else {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}
