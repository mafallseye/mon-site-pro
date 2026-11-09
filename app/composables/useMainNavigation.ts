/** Liens de navigation principale, partagés par le header et le footer. */
export function useMainNavigation() {
  const { t } = useI18n()
  const localePath = useLocalePath()

  return computed(() => [
    { label: t('navigation.home'), to: localePath('/') },
    { label: t('navigation.services'), to: localePath('/services') },
    { label: t('navigation.portfolio'), to: localePath('/realisations') },
    { label: t('navigation.process'), to: localePath('/process') },
    { label: t('navigation.about'), to: localePath('/a-propos') },
    { label: t('navigation.contact'), to: localePath('/contact') }
  ])
}
