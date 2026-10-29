export const EMAIL = 'haxxedgroomingco@gmail.com'
/** WhatsApp number in international format without + or spaces, e.g. '919876543210'. Empty opens WhatsApp's contact picker. */
export const WHATSAPP_NUMBER = ''
export const whatsappUrl = (text = 'Hi HAXXED, I have a question.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
export const INSTAGRAM_HANDLE = 'haxxedgroomingco'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`
export const YOUTUBE_URL = 'https://www.youtube.com/@haxxedgroomingco'
export const SUPPORT = {
  email: 'haxxedsupport@gmail.com',
  phones: [['9080055713', '+919080055713'], ['9944496155', '+919944496155']] as [string, string][],
  hours: 'Lines open from 11am – 6pm, Monday to Saturday',
  address: '42/44 Thiyagappa chetty street, korrukupet, Chennai 600021.',
}
