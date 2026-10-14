# ERP System — Website

Public website for **ERP System** (desktop business application).

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing / product overview |
| `privacy.html` | Privacy Policy (required for Google OAuth verification) |
| `terms.html` | Terms of Service |
| `styles.css` | Shared styling |

## Publish (GitHub Pages)

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / folder `/ (root)`
4. Save — site will be at:
   `https://naseem102.github.io/ERP-web/`

## Custom domain

In **Settings → Pages → Custom domain**, add your domain and follow DNS instructions (A / CNAME records). After HTTPS is active, use these URLs in Google Cloud OAuth consent:

- Application home page: `https://YOUR-DOMAIN/`
- Privacy Policy: `https://YOUR-DOMAIN/privacy.html`
- Terms of Service: `https://YOUR-DOMAIN/terms.html`

## Google OAuth console fields

When the domain is live, fill:

- **App name:** ERP System
- **User support email:** your Gmail / business email
- **Application home page:** site root URL
- **Privacy Policy URL:** `/privacy.html`
- **Terms of Service URL:** `/terms.html`
- **Authorized domains:** your domain (without `https://`)
- **Developer contact:** same support email

## Note

Contact email on the site is currently `kingofdevilkillr@gmail.com`. Change it in `index.html`, `privacy.html`, and `terms.html` if you use a business address.
