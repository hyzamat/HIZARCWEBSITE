import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { site } from './config/site'
import { services } from './data/content'
import { en } from './i18n/en'

/** Used at build time by scripts/prerender.mjs */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export { site }

/** schema.org data so Google understands who HIZARC is, where it is and what it offers. */
export function structuredData() {
  const url = site.url.replace(/\/$/, '')
  const sameAs = Object.values(site.social).filter(Boolean)

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${url}/#organization`,
      name: site.name,
      description:
        'Dubai-based IT company providing custom web applications, software development, websites, IT services & support, online marketing, custom game development, infrastructure design and cyber security.',
      url: `${url}/`,
      logo: `${url}/icon-512.png`,
      image: `${url}/og-image.png`,
      email: site.contact.emails[0],
      telephone: site.contact.phones[0].number.replace(/\s/g, ''),
      contactPoint: site.contact.phones.map((p) => ({
        '@type': 'ContactPoint',
        telephone: p.number.replace(/\s/g, ''),
        contactType: 'customer service',
        areaServed: 'AE',
        availableLanguage: p.lang === 'ar' ? 'Arabic' : 'English',
      })),
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.contact.address.split(',')[0],
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        addressCountry: 'AE',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 25.2048, longitude: 55.2708 },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      areaServed: en.dubai.regions.filter((r) => r !== 'Worldwide').map((name) => ({ '@type': 'Country', name })),
      knowsLanguage: ['en', 'ar'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'IT & Software Services',
        itemListElement: services.map(({ id }) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: en.services.items[id].title, description: en.services.items[id].description },
        })),
      },
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: en.faq.items.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}
