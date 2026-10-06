import Link from "next/link"

// Previous / next at the end of a detail page: the article row pattern (ArticleRow) with a
// plain-text direction label in place of the meta column (STYLEGUIDE.md, "Cards in use").
const NavigationRow = ({ direction, href, item, label }) => {
  if (!item) return null

  return (
    <li>
      <Link
        href={href}
        className={`home-article-row content-navigation-row content-navigation-${direction}`}
      >
        <span className="content-navigation-direction">{label}</span>
        <div className="home-article-body">
          <h3 className="home-article-title">{item.title}</h3>
          {item.description ? (
            <p className="home-article-summary">{item.description}</p>
          ) : null}
        </div>
        <span className="home-article-arrow" aria-hidden="true">
          {direction === "previous" ? "←" : "→"}
        </span>
      </Link>
    </li>
  )
}

const ContentNavigation = ({
  previous,
  next,
  previousHref,
  nextHref,
  previousLabel,
  nextLabel,
  title = "Continue exploring",
}) => {
  if (!previous && !next) return null

  return (
    <section className="content-navigation" aria-labelledby="content-navigation-title">
      <h2 id="content-navigation-title" className="landing-section-title">
        {title}
      </h2>
      <nav aria-label={title}>
        <ul className="home-articles-list">
          <NavigationRow direction="previous" href={previousHref} item={previous} label={previousLabel} />
          <NavigationRow direction="next" href={nextHref} item={next} label={nextLabel} />
        </ul>
      </nav>
    </section>
  )
}

export default ContentNavigation
