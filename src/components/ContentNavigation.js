import Link from "next/link"

const NavigationCard = ({ direction, href, item, label }) => {
  if (!item) return null

  return (
    <Link
      href={href}
      className={`content-navigation-card content-navigation-card-${direction}`}
    >
      <span className="content-navigation-direction">
        {direction === "previous" ? "←" : "→"} {label}
      </span>
      <strong>{item.title}</strong>
      {item.description ? <span className="content-navigation-summary">{item.description}</span> : null}
    </Link>
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
      <h2 id="content-navigation-title">{title}</h2>
      <nav className="content-navigation-grid" aria-label="Content navigation">
        <NavigationCard
          direction="previous"
          href={previousHref}
          item={previous}
          label={previousLabel}
        />
        <NavigationCard
          direction="next"
          href={nextHref}
          item={next}
          label={nextLabel}
        />
      </nav>
    </section>
  )
}

export default ContentNavigation
