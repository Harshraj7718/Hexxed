import { Shell } from './Pages'
import './pages.css'

const NECESSARY: [string, string, string][] = [
  ['_ab', 'Used in connection with access to admin.', '2y'],
  ['_secure_session_id', 'Used in connection with navigation through a storefront.', '24h'],
  ['_shopify_country', 'Used in connection with checkout.', 'session'],
  ['_shopify_m', 'Used for managing customer privacy settings.', '1y'],
  ['_shopify_tm', 'Used for managing customer privacy settings.', '30min'],
  ['_shopify_tw', 'Used for managing customer privacy settings.', '2w'],
  ['_storefront_u', 'Used to facilitate updating customer account information.', '1min'],
  ['_tracking_consent', 'Tracking preferences.', '1y'],
  ['c', 'Used in connection with checkout.', '1y'],
  ['cart', 'Used in connection with shopping cart.', '2w'],
  ['cart_currency', 'Used in connection with shopping cart.', '2w'],
  ['cart_sig', 'Used in connection with checkout.', '2w'],
  ['cart_ts', 'Used in connection with checkout.', '2w'],
  ['cart_ver', 'Used in connection with shopping cart.', '2w'],
  ['checkout', 'Used in connection with checkout.', '4w'],
  ['checkout_token', 'Used in connection with checkout.', '1y'],
  ['dynamic_checkout_shown_on_cart', 'Used in connection with checkout.', '30min'],
  ['hide_shopify_pay_for_checkout', 'Used in connection with checkout.', 'session'],
  ['keep_alive', 'Used in connection with buyer localization.', '2w'],
  ['master_device_id', 'Used in connection with merchant login.', '2y'],
  ['previous_step', 'Used in connection with checkout.', '1y'],
  ['remember_me', 'Used in connection with checkout.', '1y'],
  ['secure_customer_sig', 'Used in connection with customer login.', '20y'],
  ['shopify_pay', 'Used in connection with checkout.', '1y'],
  ['shopify_pay_redirect', 'Used in connection with checkout.', '30 minutes, 3w or 1y depending on value'],
  ['storefront_digest', 'Used in connection with customer login.', '2y'],
  ['tracked_start_checkout', 'Used in connection with checkout.', '1y'],
  ['checkout_one_experiment', 'Used in connection with checkout.', 'session'],
  ['checkout_session_lookup', 'Used in connection with checkout.', '3w'],
  ['checkout_session_token_<<token>>', 'Used in connection with checkout.', '3w'],
  ['identity-state', 'Used in connection with customer authentication.', '24h'],
  ['identity-state-<<token>>', 'Used in connection with customer authentication.', '24h'],
  ['identity_customer_account_number', 'Used in connection with customer authentication.', '12w'],
]

const ANALYTICS: [string, string, string][] = [
  ['_landing_page', 'Track landing pages.', '2w'],
  ['_orig_referrer', 'Track landing pages.', '2w'],
  ['_s', 'Shopify analytics.', '30min'],
  ['_shopify_d', 'Shopify analytics.', 'session'],
  ['_shopify_s', 'Shopify analytics.', '30min'],
  ['_shopify_sa_p', 'Shopify analytics relating to marketing & referrals.', '30min'],
  ['_shopify_sa_t', 'Shopify analytics relating to marketing & referrals.', '30min'],
  ['_shopify_y', 'Shopify analytics.', '1y'],
  ['_y', 'Shopify analytics.', '1y'],
  ['_shopify_evids', 'Shopify analytics.', 'session'],
  ['_shopify_ga', 'Shopify and Google Analytics.', 'session'],
  ['customer_auth_provider', 'Shopify analytics.', 'session'],
  ['customer_auth_session_created_at', 'Shopify analytics.', 'session'],
]

function CookieTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="lg-tablewrap">
      <table className="lg-table">
        <thead><tr><th>Name</th><th>Function</th><th>Duration</th></tr></thead>
        <tbody>{rows.map(([n, f, d]) => <tr key={n}><td><code>{n}</code></td><td>{f}</td><td>{d}</td></tr>)}</tbody>
      </table>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <Shell>
      {() => (
        <main className="lg">
          <header className="lg-head">
            <div className="eyebrow">Legal</div>
            <h1 className="h2" style={{ margin: 0 }}>Privacy <span className="hl">policy.</span></h1>
            <p className="lede">Last updated: 01/11/2026</p>
          </header>

          <article className="lg-body">
            <p>This Privacy Policy describes how haxxedgrooming.com (the “Site” or “we”) collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.</p>

            <h2>Contact</h2>
            <p>After reviewing this policy, if you have additional questions, want more information about our privacy practices, or would like to make a complaint, please contact us by e-mail at <a href="mailto:haxxedsupport@gmail.com">haxxedsupport@gmail.com</a> or by mail using the details provided below:</p>
            <p>India</p>

            <h2>Collecting Personal Information</h2>
            <p>When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. In this Privacy Policy, we refer to any information about an identifiable individual (including the information below) as “Personal Information”. See the list below for more information about what Personal Information we collect and why.</p>

            <h3>Device information</h3>
            <ul>
              <li><b>Purpose of collection:</b> to load the Site accurately for you, and to perform analytics on Site usage to optimize our Site.</li>
              <li><b>Source of collection:</b> Collected automatically when you access our Site using cookies, log files, web beacons, tags, or pixels.</li>
              <li><b>Disclosure for a business purpose:</b> shared with our processor Shopify.</li>
              <li><b>Personal Information collected:</b> version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site.</li>
            </ul>

            <h3>Order information</h3>
            <ul>
              <li><b>Purpose of collection:</b> to provide products or services to you to fulfill our contract, to process your payment information, arrange for shipping, and provide you with invoices and/or order confirmations, communicate with you, screen our orders for potential risk or fraud, and when in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
              <li><b>Source of collection:</b> collected from you.</li>
              <li><b>Disclosure for a business purpose:</b> shared with our processor Shopify.</li>
              <li><b>Personal Information collected:</b> name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.</li>
            </ul>

            <h3>Customer support information</h3>
            <ul>
              <li><b>Purpose of collection:</b> to provide customer support.</li>
              <li><b>Source of collection:</b> collected from you.</li>
            </ul>

            <h2>Sharing Personal Information</h2>
            <p>We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example:</p>
            <ul>
              <li>We use Shopify to power our online store. You can read more about how Shopify uses your Personal Information here: <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer">https://www.shopify.com/legal/privacy</a>.</li>
              <li>We may share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</li>
            </ul>

            <h2>Using Personal Information</h2>
            <p>We use your personal Information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.</p>

            <h2>Retention</h2>
            <p>When you place an order through the Site, we will retain your Personal Information for our records unless and until you ask us to erase this information.</p>

            <h2>Automatic decision-making</h2>
            <p>Our processor Shopify uses limited automated decision-making to prevent fraud that does not have a legal or otherwise significant effect on you.</p>
            <p>Services that include elements of automated decision-making include:</p>
            <ul>
              <li>Temporary blacklist of IP addresses associated with repeated failed transactions. This blacklist persists for a small number of hours.</li>
              <li>Temporary blacklist of credit cards associated with blacklisted IP addresses. This blacklist persists for a small number of days.</li>
            </ul>

            <h2>Cookies</h2>
            <p>A cookie is a small amount of information that’s downloaded to your computer or device when you visit our Site. We use a number of different cookies, including functional, performance, advertising, and social media or content cookies. Cookies make your browsing experience better by allowing the website to remember your actions and preferences (such as login and region selection). This means you don’t have to re-enter this information each time you return to the site or browse from one page to another. Cookies also provide information on how people use the website, for instance whether it’s their first time visiting or if they are a frequent visitor.</p>
            <p>We use the following cookies to optimize your experience on our Site and to provide our services.</p>

            <h3>Cookies necessary for the functioning of the store</h3>
            <CookieTable rows={NECESSARY} />
            <h3>Reporting and analytics</h3>
            <CookieTable rows={ANALYTICS} />

            <p>The length of time that a cookie remains on your computer or mobile device depends on whether it is a “persistent” or “session” cookie. Session cookies last until you stop browsing and persistent cookies last until they expire or are deleted. Most of the cookies we use are persistent and will expire between 30 minutes and two years from the date they are downloaded to your device.</p>
            <p>You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can negatively impact your user experience and parts of our website may no longer be fully accessible.</p>
            <p>Most browsers automatically accept cookies, but you can choose whether or not to accept cookies through your browser controls, often found in your browser’s “Tools” or “Preferences” menu. For more information on how to modify your browser settings or how to block, manage or filter cookies can be found in your browser’s help file or through such sites as: <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.</p>
            <p>Additionally, please note that blocking cookies may not completely prevent how we share information with third parties such as our advertising partners.</p>

            <h2>Do Not Track</h2>
            <p>Please note that because there is no consistent industry understanding of how to respond to “Do Not Track” signals, we do not alter our data collection and usage practices when we detect such a signal from your browser.</p>

            <h2>Changes</h2>
            <p>We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.</p>

            <h2>Complaints</h2>
            <p>As noted above, if you would like to make a complaint, please contact us by e-mail or by mail using the details provided under “Contact” above.</p>
            <p className="lg-date">Last updated: 01/11/2026</p>
          </article>
        </main>
      )}
    </Shell>
  )
}

export function RefundPage() {
  return (
    <Shell>
      {() => (
        <main className="lg">
          <header className="lg-head">
            <div className="eyebrow">Legal</div>
            <h1 className="h2" style={{ margin: 0 }}>Refund <span className="hl">policy.</span></h1>
          </header>
          <article className="lg-body">
            <p>No returns can be initiated once the product have been received.</p>
          </article>
        </main>
      )}
    </Shell>
  )
}

const TERMS: string[] = [
  'Haxxed reserves the right to change this website and these terms and conditions at any time. This information can be changed any time without notice.',
  'We are not giving any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on our website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.',
  'You may not post, distribute, or reproduce in any copyrighted material, trademarks, or other proprietary information without obtaining the prior written consent of the owner of such proprietary rights.',
  'Your use of any information or materials on Haxxed website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website meet your specific requirements.',
  'You understand that Haxxedgrooming.com has the right at all times to disclose any information as necessary to satisfy any law, regulation or valid governmental request. In addition, we can disclose any information about you to law enforcement or other government officials.',
  'com can send promotional activities on your email or by SMS on the given customer details. If the customer wishes to opt out of the same, kindly send an email to haxxedsupport@gmail.com or click on the unsubscribe link of the mailer received.',
  'We are not responsible or liable for any loss or damage of any sort incurred as the result of any such dealings or as the result of the presence of such advertisers on the Sites.',
  'It is possible that other users including hackers may post or transmit offensive or obscene materials on the Sites and that you may be involuntarily exposed to such offensive and obscene materials. Please take care when you select the type of information that you publicly disclose or share with others on the Sites.',
  'Haxxed website contains material which is owned by us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and condition',
  'Haxxed website may contain links to other web sites or you may be linked through other web sites. The Linked websites are for your convenience only and you access that website at your own risk. We are not responsible for the content of the Linked websites, whether or not Haxxedgrooming.com is AFFILIATED with sponsors of the sites.',
  'All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.',
  'Use of Haxxed website is governed by our Privacy Policy, which can be available at http://www.haxxedgrooming.com/terms-conditions/',
  'Unauthorized use of our website may give rise to a claim for damages and/or be a criminal offence.',
  'From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).',
  'You may not create a link to our website from another website or document without Haxxed\'s prior written consent.',
  'Accessing, browsing or otherwise using Haxxed website and any dispute arising out of such use of the website is subject to the laws of India or other regulatory authority.',
]

export function TermsPage() {
  return (
    <Shell>
      {() => (
        <main className="lg">
          <header className="lg-head">
            <div className="eyebrow">Legal</div>
            <h1 className="h2" style={{ margin: 0 }}>Terms of <span className="hl">service.</span></h1>
          </header>
          <article className="lg-body">
            <p>Welcome to the Haxxed website. Accessing, browsing or otherwise using the Haxxed website indicates that you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Haxxed's relationship with you in relation to this website.</p>
            <p>Haxxed refers to the owner of the website whose registered office is,<br /><b>Haxxed:</b><br />42/44, Thiyagappa chetty Street, korrukupet, Chennai 600021</p>
            <p>The use of this website is subject to the following terms of use:</p>
            <ul>{TERMS.map(t => <li key={t}>{t}</li>)}</ul>
            <p>You will be getting order related SMS and by clicking on "I Agree", you abide that you are fine to receive the SMS from Haxxedgrooming.com</p>
          </article>
        </main>
      )}
    </Shell>
  )
}
