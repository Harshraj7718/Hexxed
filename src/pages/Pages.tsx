import { useCallback, type ReactNode } from 'react'
import { useBag } from '../home/useBag'
import { EMAIL, whatsappUrl } from '../contact'
import { Doodle } from './Doodle'
import { Founder } from '../home/sections/Founder'
import { Reveal } from '../home/motion'
import { Crew, Introducing, Standard } from '../home/sections/Story'
import { BagDrawer, Footer, Nav, OfferBar, Toast, WhatsAppButton } from '../home/sections/Chrome'
import '../home/home.css'
import './pages.css'

/** Header, footer and bag shared by every dedicated page. */
export function Shell({ children, chrome = true }: { children: (bag: ReturnType<typeof useBag>) => ReactNode; chrome?: boolean }) {
  const bag = useBag()
  const { setOpen } = bag
  const close = useCallback(() => setOpen(false), [setOpen])
  const checkout = () => bag.flash(bag.totals.count ? 'Prototype only — no payment processed' : 'Your bag is empty')
  return (
    <div className="page">
      {chrome && <OfferBar />}
      {chrome && <Nav count={bag.totals.count} onBag={() => setOpen(true)} />}
      {children(bag)}
      {chrome && <Footer />}
      <BagDrawer open={bag.open} cart={bag.cart} totals={bag.totals} onClose={close} onQty={bag.setQty} onCheckout={checkout} prepaid={bag.prepaid} onPrepaid={bag.setPrepaid} />
      <Toast message={bag.toast} />
      <WhatsAppButton showShop={chrome} />
    </div>
  )
}

function Head({ eyebrow, title, lede }: { eyebrow: string; title: ReactNode; lede?: string }) {
  return (
    <header className="pghead">
      <Reveal className="stack-14">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="h2" style={{ margin: 0 }}>{title}</h1>
        {lede && <p className="lede" style={{ maxWidth: 520 }}>{lede}</p>}
      </Reveal>
    </header>
  )
}

function FullStory() {
  return (
    <div className="fsw">
    <Doodle v="barber" className="fsw__l" />
    <Doodle v="faq" className="fsw__r" />
    <article className="fs">
      <Reveal as="div" className="fs__lead">
        <p>It never started as a business. <span className="hl">It started with a passion.</span></p>
      </Reveal>
      <Reveal className="fs__body">
        <p>For years, I struggled to find the right hair product in the Indian market. Everything I found was “one product for everyone”—no consideration for different hair types, no options for different hair styles, and definitely no real performance.</p>
        <p>Most products used harsh chemicals, felt cheap, and gave disappointing results. My hair deserved better—and so did every Indian man.</p>
        <p>When I looked outside India, I saw a completely different world. International brands were using clean ingredients, focusing on performance, and offering a huge range based on hair needs. But getting those products shipped to India was expensive—almost nobody could afford using them regularly.</p>
      </Reveal>
      <Reveal className="fs__turn">
        <p>That frustration turned into curiosity.</p>
        <p>Curiosity turned into experimentation.</p>
        <p>And experimentation turned into a mission.</p>
      </Reveal>
      <Reveal className="fs__body">
        <p>Because the problem wasn’t mine alone—almost every Indian man faces the same struggle.</p>
      </Reveal>
      <Reveal className="fs__born">
        <p>So HAXXED was born.</p>
        <p className="fs__not">Not to sell.<br />Not to follow trends.<br />But to create what didn’t exist in India.</p>
      </Reveal>
      <Reveal className="fs__body">
        <p>We spent 3+ years in R&amp;D for each product testing, failing, improving.. until we could match international quality, performance, and ingredient safety, at a price that makes sense for Indian consumers.</p>
      </Reveal>
      <Reveal className="fs__close">
        <p>Indian men deserve world class hair products.</p>
        <p>Made for our hair types, our styles, and our climate.</p>
        <p>This isn’t just hair styling.</p>
        <p className="fs__final">This is passion, science, and pride.<br /><span className="hl">Made in/for India.</span></p>
      </Reveal>
    </article>
    </div>
  )
}

export function StoryPage() {
  return (
    <Shell>
      {() => (
        <main>
          <Head eyebrow="Our story" title={<>Why we <span className="hl">exist.</span></>} />
          <FullStory />
          <Founder />
          <Introducing />
          <Standard />
          <Crew />
        </main>
      )}
    </Shell>
  )
}

const SHIPPING: [string, string[]][] = [
  ['Order processing & dispatch', ['All orders are processed and dispatched within 1–2 working days after order placement.']],
  ['Delivery timeline', ['Once dispatched, delivery typically takes 2–5 business days, depending on your location.', 'We ship all orders via air, ensuring faster transit across India.', 'Delivery timelines may vary slightly during peak seasons, sales, or due to unforeseen courier delays.']],
  ['Cash on Delivery (COD) orders', ['COD orders are dispatched only after confirmation.', 'A confirmation message will be sent to your registered mobile number via SMS or WhatsApp.', 'Orders will be shipped only after you reply to confirm your COD order.']],
  ['Shipping charges', ['We offer FREE SHIPPING all over India — no minimum order value required.']],
  ['Tracking & shipping updates', ['Once your order is shipped, you will receive tracking details via email.', 'You can use the tracking link to monitor your shipment status in real time.']],
  ['Delivery attempts & address accuracy', ['Please ensure your shipping address and contact details are correct at checkout.', 'If a delivery attempt fails due to an incorrect address or unavailability, re-shipping charges may apply.']],
  ['Damaged or lost shipments', ['In rare cases of transit damage or loss, please contact us within 48 hours of delivery.', 'We’ll investigate with our courier partner and arrange a replacement or resolution where applicable.']],
]

export function ShippingPage() {
  return (
    <Shell>
      {() => (
        <main>
          <Head eyebrow="Shopping info" title={<>Shipping <span className="hl">info.</span></>} lede="At HAXXED Grooming Co., we aim to get your order to you as quickly and smoothly as possible." />
          <div className="pgbody"><aside className="pgside"><Doodle v="parcel" /></aside>
          <div className="pglist">
            {SHIPPING.map(([t, ps], i) => (
              <Reveal key={t} delay={i * 40} className="pgrow"><h3>{t}</h3>{ps.map(x => <p key={x}>{x}</p>)}</Reveal>
            ))}
            <Reveal className="pgrow">
              <h3>Need help with shipping?</h3>
              <p>If you have any questions or need updates regarding your shipment:</p>
              <p>📧 Email us at: <a className="link-underline" href={'mailto:' + EMAIL}>{EMAIL}</a></p>
              <p>💬 <a className="link-underline" href={whatsappUrl('Hi HAXXED, I need help with my shipment.')} target="_blank" rel="noopener noreferrer">WhatsApp us</a> via the chat button at the corner of our website.</p>
              <p>Our support team will be happy to assist you.</p>
            </Reveal>
          </div>
          </div>
        </main>
      )}
    </Shell>
  )
}

const FAQ: { group: string; items: [string, string][] }[] = [
  { group: 'Product-related questions', items: [
    ['Are Haxxed Grooming Co. products made with natural ingredients?', 'Yes. Our products are crafted using a blend of natural clays, butters, and oils. We focus on clean formulations that style your hair effectively while keeping it healthy.'],
    ['Are your products suitable for Indian hair types?', 'Absolutely. Our formulations are specifically designed and tested for Indian hair textures, weather conditions, and daily styling needs.'],
    ['Do your products cause hair damage or hair fall?', 'No. Our products are non-harsh and free from harmful chemicals. They are designed to style without drying out your hair or damaging the scalp. However, hair fall can depend on multiple factors like genetics, diet, and lifestyle.'],
    ['Are your products safe for daily use?', 'Yes. All our products are gentle enough for everyday styling.'],
    ['Are your products tested on animals?', 'No. We are a cruelty-free brand and do not test our products on animals.'],
  ] },
  { group: 'Usage & application', items: [
    ['How do I use your hair styling products?', 'Take a small amount, rub it between your palms, and apply evenly to dry or slightly damp hair. Style as desired. You can add more product if needed.'],
    ['Will your products make my hair greasy or sticky?', 'No. Our matte products give a natural, non-greasy finish when used in the right quantity. And shine products are formulated to deliver a clean, healthy shine without making your hair greasy or oily. They provide a lightweight finish that looks natural, not heavy or sticky.'],
    ['How long does the hold last?', 'Our styling products provide long-lasting hold throughout the day. Re-styling is easy with your hands or a comb.'],
    ['Can I wash off the product easily?', 'Yes. All our products are water-washable and can be easily removed with a regular shampoo.'],
  ] },
  { group: 'Orders & payments', items: [
    ['What payment methods do you accept?', 'We accept prepaid orders via UPI, credit/debit cards, net banking, and Cash on Delivery (COD).'],
    ['Do you offer Cash on Delivery (COD)?', 'Yes. COD is available across India. COD orders are dispatched only after confirmation via SMS or WhatsApp.'],
  ] },
  { group: 'Shipping & delivery', items: [
    ['How long does it take to dispatch my order?', 'Orders are dispatched within 1–2 working days after order placement.'],
    ['How long does delivery take?', 'Delivery usually takes 2–5 business days after dispatch, depending on your location.'],
    ['Do you charge for shipping?', 'No. We offer free shipping all over India.'],
    ['How can I track my order?', 'Once shipped, you will receive tracking details via email.'],
  ] },
  { group: 'Returns, refunds & issues', items: [
    ['What is your return policy?', 'Due to hygiene reasons, opened or used products cannot be returned. If you receive a damaged or incorrect product, please contact us within 48 hours of delivery.'],
    ['What if my product arrives damaged?', 'Please email us or message us on WhatsApp within 48 hours with clear photos. We will arrange a replacement or resolution.'],
    ['Can I cancel my order?', 'Orders can be cancelled before dispatch. Once shipped, cancellations are not possible.'],
  ] },
  { group: 'Support & contact', items: [
    ['How can I contact Haxxed Grooming Co.?', 'You can email us at haxxedgroomingco@gmail.com or message us via the WhatsApp chat button at the corner of our website.'],
    ['What are your customer support hours?', 'Monday – Saturday, 10:00 AM – 7:00 PM (excluding Sundays and public holidays).'],
  ] },
]

export function FaqPage() {
  const starts = FAQ.map((_, i) => FAQ.slice(0, i).reduce((a, g) => a + g.items.length, 0))
  return (
    <Shell>
      {() => (
        <main>
          <Head eyebrow="FAQ" title={<>Frequently asked <span className="hl">questions.</span></>} />
          <div className="pgbody"><aside className="pgside"><Doodle v="faq" /></aside>
          <div className="pglist">
            {FAQ.map((g, gi) => (
              <section key={g.group} className="pggroup">
                <Reveal><h2 className="pggroup__t">{g.group}</h2></Reveal>
                {g.items.map(([q, a], qi) => (
                  <Reveal key={q}>
                    <details className="pgfaq"><summary><span><i>{starts[gi] + qi + 1}.</i> {q}</span></summary><p>{a}</p></details>
                  </Reveal>
                ))}
              </section>
            ))}
          </div>
          </div>
        </main>
      )}
    </Shell>
  )
}

export function ContactPage() {
  const biz = `mailto:${EMAIL}?subject=${encodeURIComponent('Business Enquiry – Haxxed Grooming Co.')}`
  return (
    <Shell>
      {() => (
        <main>
          <Head eyebrow="Contact" title={<>We’re here <span className="hl">to help.</span></>} lede="At Haxxed Grooming Co., customer satisfaction is our top priority. Whether you have a question about your order, need product guidance, or want to share feedback — we’d love to hear from you." />
          <div className="pgbody"><aside className="pgside"><Doodle v="mail" /></aside>
          <div className="pglist">
            <Reveal className="pgrow">
              <h3>Get in touch</h3>
              <p>📧 Email: <a className="link-underline" href={'mailto:' + EMAIL}>{EMAIL}</a> (We usually respond within 24 working hours)</p>
              <p>💬 WhatsApp support: <a className="link-underline" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">use the chat button</a> at the corner of our website to connect with our team instantly.</p>
            </Reveal>
            <Reveal className="pgrow">
              <h3>Order &amp; shipping queries</h3>
              <p>If your query is related to an existing order, please mention your Order ID in your message for faster assistance.</p>
            </Reveal>
            <Reveal className="pgrow">
              <h3>Business &amp; collaboration enquiries</h3>
              <p>For wholesale, collaborations, or business-related queries, please reach out to us via email with the subject line: “Business Enquiry – Haxxed Grooming Co.”</p>
              <p><a className="link-underline" href={biz}>Send a business enquiry →</a></p>
            </Reveal>
            <Reveal className="pgrow">
              <h3>Customer support timings</h3>
              <p>Monday – Saturday: 10:00 AM – 7:00 PM (Sundays &amp; public holidays excluded)</p>
            </Reveal>
            <Reveal className="pgrow">
              <h3>We’re always listening</h3>
              <p>Your feedback helps us improve. If you have suggestions, concerns, or reviews to share, feel free to drop us a message — we value every customer voice.</p>
            </Reveal>
          </div>
          </div>
        </main>
      )}
    </Shell>
  )
}
