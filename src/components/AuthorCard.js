import { iconForSocial } from "../lib/socialIcons"
import { withBasePath } from "../lib/site"

const AuthorCard = ({ siteSettings }) => {
  const links = [
    ...(siteSettings.socialLinks || []).map(item => ({
      label: item.name,
      href: item.url,
    })),
    siteSettings.email
      ? { label: "Email", href: `mailto:${siteSettings.email}` }
      : null,
  ].filter(item => item?.href)
  const portraitUrl = siteSettings.portraitUrl?.startsWith("http")
    ? siteSettings.portraitUrl
    : withBasePath(siteSettings.portraitUrl)

  return (
    <aside className="author-card" aria-labelledby="author-card-name">
      {portraitUrl ? (
        <img
          src={portraitUrl}
          alt={siteSettings.portraitAlt || siteSettings.name}
          className="author-card-avatar"
          width="64"
          height="64"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div className="author-card-body">
        <p className="author-card-label">Written by</p>
        <p id="author-card-name" className="author-card-name">
          {siteSettings.name}
        </p>
        {siteSettings.professionalTitle ? (
          <p className="author-card-bio">{siteSettings.professionalTitle}</p>
        ) : null}
      </div>
      {links.length ? (
        <div className="author-card-links">
          {links.map(item => {
            const Icon = iconForSocial(item.label)
            const isExternal = /^https?:/i.test(item.href)
            return (
              <a
                key={item.label}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="footer-credential-icon"
                aria-label={item.label}
                title={item.label}
              >
                <Icon size={16} strokeWidth={2.1} aria-hidden="true" />
              </a>
            )
          })}
        </div>
      ) : null}
    </aside>
  )
}

export default AuthorCard
