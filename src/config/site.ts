/**
 * ──────────────────────────────────────────────────────────────
 *  HIZARC — WEBSITE SETTINGS
 *  Everything you'll want to change lives in this one file.
 *  Save the file and the site updates everywhere automatically.
 * ──────────────────────────────────────────────────────────────
 */

export const site = {
  name: 'HIZARC',
  tagline: 'IT & Software Solutions',
  /** Your live domain — used for Google / social-share tags. */
  url: 'https://hizarc.com',

  contact: {
    /** Enquiries from the website form go to all of these. */
    emails: ['shainal@hizarc.com', 'antony@hizarc.com'],
    /** Shown in this order. `label` tells visitors which language that line speaks. */
    phones: [
      { number: '+971 52 137 4423', label: 'English', lang: 'en' },
      { number: '+971 50 323 2421', label: 'العربية', lang: 'ar' },
    ],
    /** WhatsApp number — digits only, country code first, no "+" or spaces */
    whatsapp: '971521374423',
    address: 'Business Bay, Dubai, United Arab Emirates',
    /** The same address and hours as shown on the Arabic version of the site */
    addressAr: 'الخليج التجاري، دبي، الإمارات العربية المتحدة',
    hours: 'Mon – Fri · 9:00 – 18:00 (GST)',
    hoursAr: 'الاثنين – الجمعة · 9:00 – 18:00 (بتوقيت الخليج)',
    mapUrl: 'https://maps.google.com/?q=Business+Bay,+Dubai',
  },

  /**
   * GOOGLE FORM — where every enquiry is delivered.
   * Paste your link between the quotes. Two options (see README.md):
   *
   *  1. Quick:  your normal form link (…/viewform)
   *             → the Google Form is shown inside the Contact section.
   *
   *  2. Best:   a "pre-filled link" where you typed the words
   *             name, email, phone, message
   *             into the matching questions
   *             → visitors use HIZARC's own branded form and every answer
   *               lands in your Google Form / Google Sheet.
   *
   * While this is empty, enquiries open the visitor's email app instead.
   */
  // "Client Enquiry Form" — pre-filled link: name / email / phone / message questions
  googleFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSeOniymp0hxHUQMjZQG32IAAxAWyFb22Oy6y7Yh1ObG--CEug/viewform?usp=pp_url&entry.153551140=name&entry.601117649=email&entry.721595140=phone&entry.160737682=message',

  /** Leave a link empty ('') to hide that icon. */
  social: {
    linkedin: '',
    instagram: '',
    x: '',
    facebook: '',
  },
} as const

export const whatsappLink = (text = 'Hi HIZARC, I would like to discuss a project.') =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`

export const telLink = (number: string) => `tel:${number.replace(/[^\d+]/g, '')}`
export const mailLink = (email: string) => `mailto:${email}`

/** The first number / email is the main one (used by single "Call" or "Email" buttons). */
export const phoneLink = telLink(site.contact.phones[0].number)
export const emailLink = mailLink(site.contact.emails[0])
