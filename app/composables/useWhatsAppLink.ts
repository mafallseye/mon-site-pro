/**
 * Lien « Écrire sur WhatsApp » construit depuis NUXT_PUBLIC_CONTACT_WHATSAPP
 * (numéro international, chiffres seuls ou avec espaces/+ : ils sont retirés).
 * Renvoie une chaîne vide si le numéro n'est pas configuré.
 */
export function useWhatsAppLink() {
  const config = useRuntimeConfig()
  return computed(() => {
    const digits = String(config.public.contactWhatsapp || '').replace(/\D/gu, '')
    return digits ? `https://wa.me/${digits}` : ''
  })
}
