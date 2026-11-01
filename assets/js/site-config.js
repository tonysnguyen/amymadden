/*
 * Site settings.
 *
 * formEndpoint: where the Contact form sends messages.
 *   Messages are forwarded by FormSubmit (https://formsubmit.co) to amymmadden@gmail.com.
 *   The first message sent triggers a one-time activation email from FormSubmit to that
 *   inbox; click its link and every message after that arrives normally.
 *   After activating, FormSubmit also offers a random alias address (it looks like
 *   https://formsubmit.co/ajax/8f3c…) that you can paste here to keep the email address
 *   out of the page source.
 *   Leave it empty ('') and the form only pretends to send.
 */
window.SITE_CONFIG = {
  formEndpoint: 'https://formsubmit.co/ajax/amymmadden@gmail.com'
};
