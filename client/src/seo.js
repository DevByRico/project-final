// client/src/seo.js
export function setSEO({
  title,
  description,
  canonical,
  robots,     // "index,follow" | "noindex,nofollow"
  jsonLd,     // valfri strukturdata (objekt)
} = {}) {
  if (title) document.title = title;

  upsertMeta('description', description ?? '');
  if (robots) upsertMeta('robots', robots);

  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }

  // rensa tidigare JSON-LD script vi satt
  document.querySelectorAll('script[data-seo-jsonld]').forEach(n => n.remove());
  if (jsonLd) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.seoJsonld = '1';
    s.text = JSON.stringify(jsonLd);
    document.head.appendChild(s);
  }
}

function upsertMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
