// Public profile links. Empty values are automatically hidden.
const PROFILE = {
  email: "",
  linkedin: "https://www.linkedin.com/in/haseeb-ahmad-baa981278",
  github: "https://github.com/HaseebAhmad12-tech/haseeb-ahmad-portfolio"
};

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const progress = document.querySelector('.scroll-progress span');
const glow = document.querySelector('.cursor-glow');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  }));
}

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 18);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    glow.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 700, fill: 'forwards' });
  }, { passive: true });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px' });

document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(el);
});

const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -58% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

const setProfileLink = (selector, value, prefix = '') => {
  const el = document.querySelector(selector);
  if (!el || !value) return;
  el.href = `${prefix}${value}`;
  el.hidden = false;
};
setProfileLink('.profile-email', PROFILE.email, 'mailto:');
setProfileLink('.profile-linkedin', PROFILE.linkedin);
setProfileLink('.profile-github', PROFILE.github);

/* ---------------- Blog carousel + live profile sync ---------------- */
const blogViewport = document.querySelector('.blog-viewport');
const blogTrack = document.getElementById('blogTrack');
const blogPrev = document.querySelector('.blog-prev');
const blogNext = document.querySelector('.blog-next');
const blogPagination = document.getElementById('blogPagination');
const blogCount = document.getElementById('blogCount');
const blogSyncStatus = document.getElementById('blogSyncStatus');
let blogPage = 0;
let blogAutoTimer = null;

const normaliseBlogUrl = value => {
  try {
    const url = new URL(value, 'https://community.powerplatform.com');
    url.hash = '';
    return `${url.origin}${url.pathname}${url.search}`;
  } catch {
    return value;
  }
};

const topicFromTitle = title => {
  const t = title.toLowerCase();
  if (t.includes('copilot') || t.includes('agent')) return 'COPILOT STUDIO · AUTOMATION';
  if (t.includes('access') || t.includes('security')) return 'DYNAMICS 365 · SECURITY';
  if (t.includes('case') || t.includes('power automate')) return 'POWER AUTOMATE · DYNAMICS 365';
  if (t.includes('rest') || t.includes('api')) return 'DATAVERSE · WEB API';
  if (t.includes('grid')) return 'POWER APPS · MODEL-DRIVEN';
  if (t.includes('subgrid') || t.includes('ribbon')) return 'RIBBON WORKBENCH · XRMTOOLBOX';
  if (t.includes('lookup')) return 'DATAVERSE · XRMTOOLBOX';
  if (t.includes('deleted') || t.includes('recycle')) return 'DATAVERSE · DATA RECOVERY';
  return 'MICROSOFT POWER PLATFORM';
};

const excerptFromTitle = title => {
  const t = title.toLowerCase();
  if (t.includes('copilot') || t.includes('agent')) return 'A practical Power Platform walkthrough connecting AI agents, automation and business data.';
  if (t.includes('access')) return 'A practical Dynamics 365 guide focused on record access, permissions and faster troubleshooting.';
  if (t.includes('case')) return 'A hands-on automation pattern for Dynamics 365 case processing with Power Automate.';
  if (t.includes('rest') || t.includes('api')) return 'A hands-on integration guide for building and using Dataverse API requests.';
  if (t.includes('grid')) return 'A practical model-driven app guide for improving day-to-day data entry and productivity.';
  if (t.includes('subgrid') || t.includes('ribbon')) return 'A Dynamics 365 customization guide using XrmToolBox and Ribbon Workbench.';
  if (t.includes('lookup')) return 'A Dataverse relationship guide for flexible lookup behavior in model-driven applications.';
  if (t.includes('deleted') || t.includes('recycle')) return 'A data recovery walkthrough for restoring Dataverse records with XrmToolBox.';
  return 'A practical Microsoft Power Platform article with implementation notes, patterns and lessons learned.';
};

const createBlogCard = (post, index, existingCards) => {
  const key = normaliseBlogUrl(post.url);
  const existing = existingCards.get(key);
  if (existing) {
    existing.querySelector('.blog-card-top span').textContent = String(index + 1).padStart(2, '0');
    return existing;
  }

  const article = document.createElement('article');
  article.className = 'blog-card';
  article.dataset.blogUrl = key;

  const top = document.createElement('div');
  top.className = 'blog-card-top';

  const number = document.createElement('span');
  number.textContent = String(index + 1).padStart(2, '0');

  const topic = document.createElement('small');
  topic.textContent = topicFromTitle(post.title);

  top.append(number, topic);

  const heading = document.createElement('h3');
  heading.textContent = post.title;

  const excerpt = document.createElement('p');
  excerpt.textContent = excerptFromTitle(post.title);

  const link = document.createElement('a');
  link.href = key;
  link.target = '_blank';
  link.rel = 'noopener';
  link.innerHTML = 'Read article <span>↗</span>';

  article.append(top, heading, excerpt, link);
  return article;
};

const visibleBlogCards = () => {
  if (window.innerWidth <= 620) return 1;
  if (window.innerWidth <= 1120) return 2;
  return 3;
};

const blogPageCount = () => {
  if (!blogTrack) return 0;
  const totalCards = blogTrack.children.length;
  const visible = visibleBlogCards();
  return Math.max(1, Math.ceil(totalCards / visible));
};

const goToNextBlogPage = () => {
  const totalPages = blogPageCount();
  if (totalPages <= 1) return;
  blogPage = blogPage === totalPages - 1 ? 0 : blogPage + 1;
  renderBlogCarousel();
};

const stopBlogAutoplay = () => {
  if (!blogAutoTimer) return;
  clearInterval(blogAutoTimer);
  blogAutoTimer = null;
};

const startBlogAutoplay = () => {
  stopBlogAutoplay();
  if (!blogTrack || blogPageCount() <= 1) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  blogAutoTimer = setInterval(goToNextBlogPage, 4200);
};

const renderBlogCarousel = () => {
  if (!blogTrack || !blogViewport) return;

  const totalPages = blogPageCount();
  blogPage = ((blogPage % totalPages) + totalPages) % totalPages;

  const computed = getComputedStyle(blogTrack);
  const gap = parseFloat(computed.columnGap || computed.gap || '0') || 0;
  const shift = blogPage * (blogViewport.clientWidth + gap);
  blogTrack.style.transform = `translateX(${-shift}px)`;

  if (blogPrev) blogPrev.disabled = totalPages <= 1;
  if (blogNext) blogNext.disabled = totalPages <= 1;

  if (blogPagination) {
    blogPagination.replaceChildren();
    for (let i = 0; i < totalPages; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `blog-dot${i === blogPage ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Show blog page ${i + 1}`);
      dot.addEventListener('click', () => {
        blogPage = i;
        renderBlogCarousel();
        startBlogAutoplay();
      });
      blogPagination.appendChild(dot);
    }
  }
};

blogPrev?.addEventListener('click', () => {
  const totalPages = blogPageCount();
  if (totalPages <= 1) return;
  blogPage = blogPage === 0 ? totalPages - 1 : blogPage - 1;
  renderBlogCarousel();
  startBlogAutoplay();
});

blogNext?.addEventListener('click', () => {
  goToNextBlogPage();
  startBlogAutoplay();
});

blogViewport?.addEventListener('mouseenter', stopBlogAutoplay);
blogViewport?.addEventListener('mouseleave', startBlogAutoplay);
blogViewport?.addEventListener('focusin', stopBlogAutoplay);
blogViewport?.addEventListener('focusout', startBlogAutoplay);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopBlogAutoplay();
  else startBlogAutoplay();
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    renderBlogCarousel();
    startBlogAutoplay();
  }, 120);
}, { passive: true });

const syncCommunityBlogs = async () => {
  if (!blogTrack) return;
  renderBlogCarousel();
  startBlogAutoplay();

  try {
    const response = await fetch('/.netlify/functions/blogs', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Blog sync returned ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.posts) || !data.posts.length) throw new Error('No public blog posts returned');

    const currentCards = new Map(
      [...blogTrack.querySelectorAll('.blog-card')].map(card => [normaliseBlogUrl(card.dataset.blogUrl), card])
    );
    const fragment = document.createDocumentFragment();
    const seen = new Set();

    data.posts.forEach(post => {
      if (!post?.url || !post?.title) return;
      const key = normaliseBlogUrl(post.url);
      if (seen.has(key)) return;
      seen.add(key);
      fragment.appendChild(createBlogCard({ ...post, url: key }, seen.size - 1, currentCards));
    });

    currentCards.forEach((card, key) => {
      if (seen.has(key)) return;
      card.querySelector('.blog-card-top span').textContent = String(seen.size + 1).padStart(2, '0');
      seen.add(key);
      fragment.appendChild(card);
    });

    blogTrack.replaceChildren(fragment);
    if (blogCount) blogCount.textContent = String(blogTrack.children.length);
    if (blogSyncStatus) blogSyncStatus.textContent = 'Blog cards are synced from my public Power Platform Community profile and slide automatically.';
    blogPage = 0;
    renderBlogCarousel();
    startBlogAutoplay();
  } catch (error) {
    if (blogCount) blogCount.textContent = String(blogTrack.children.length);
    if (blogSyncStatus) blogSyncStatus.textContent = 'Showing saved blog cards. Live sync will refresh automatically when deployed on Netlify.';
    blogPage = 0;
    renderBlogCarousel();
    startBlogAutoplay();
    console.info('Community blog sync fallback:', error.message);
  }
};

syncCommunityBlogs();

const visitorCountEl = document.getElementById('visitorCount');

const loadVisitorCount = async () => {
  if (!visitorCountEl) return;

  const storageKey = 'haseeb-portfolio-counted-v1';
  let shouldIncrement = false;

  try {
    shouldIncrement = !localStorage.getItem(storageKey);
  } catch {
    shouldIncrement = false;
  }

  try {
    const response = await fetch('/.netlify/functions/visitor-count', {
      method: shouldIncrement ? 'POST' : 'GET',
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Counter returned ${response.status}`);
    }

    const data = await response.json();
    visitorCountEl.textContent = Number(data.count || 0).toLocaleString();

    if (shouldIncrement) {
      try {
        localStorage.setItem(storageKey, '1');
      } catch {}
    }
  } catch (error) {
    visitorCountEl.textContent = '—';
    console.info('Visitor counter unavailable:', error.message);
  }
};

loadVisitorCount();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* =========================================
   NETLIFY CONTACT FORM
   ========================================= */
const contactForm = document.getElementById('contactForm');
const contactSubmit = document.getElementById('contactSubmit');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const submitText = contactSubmit?.querySelector('.submit-text');

    if (contactSubmit) contactSubmit.disabled = true;
    if (submitText) submitText.textContent = 'Sending...';

    if (formStatus) {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('/', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) throw new Error(`Form returned ${response.status}`);

      contactForm.reset();

      if (formStatus) {
        formStatus.textContent = '✓ Message sent successfully. Thank you!';
        formStatus.className = 'form-status success';
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'Unable to send the message. Please try again.';
        formStatus.className = 'form-status error';
      }
      console.error('Contact form error:', error);
    } finally {
      if (contactSubmit) contactSubmit.disabled = false;
      if (submitText) submitText.textContent = 'Send message';
    }
  });
}

/* =========================================
   BACK TO TOP
   ========================================= */
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  const toggleBackToTop = () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  });
}
