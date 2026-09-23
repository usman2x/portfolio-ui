import React from "react"

const HomeProof = ({ homeContent }) => {
  const stats = Array.isArray(homeContent?.proofStats)
    ? homeContent.proofStats
    : []
  const companies = Array.isArray(homeContent?.proofCompanies)
    ? homeContent.proofCompanies
    : []

  if (!stats.length && !companies.length) return null

  return (
    <section
      className="container home-proof"
      aria-label={homeContent.proofTitle || undefined}
    >
      {stats.length ? (
        <dl className="home-proof-stats">
          {stats.map(stat => (
            <div key={`${stat.value}-${stat.label}`} className="home-proof-stat">
              <dt className="home-proof-label">{stat.label}</dt>
              <dd className="home-proof-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {companies.length ? (
        <div className="home-proof-companies">
          {homeContent.proofTitle ? (
            <p className="home-proof-title">{homeContent.proofTitle}</p>
          ) : null}
          <ul className="home-proof-company-list">
            {companies.map(company => (
              <li key={company}>{company}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

export default HomeProof
