<script setup lang="ts">
import { computed } from 'vue'

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: String.fromCodePoint(1575, 1604, 1593, 1585, 1576, 1610, 1577), value: 'ar' }
]

const appearanceOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const languagePreference = useCookie<'en' | 'ar'>('taskflow-language', {
  default: () => 'en',
  sameSite: 'lax'
})
const colorMode = useColorMode()

const appearancePreference = computed({
  get: () => colorMode.value === 'dark' ? 'dark' : 'light',
  set: (appearance: 'light' | 'dark') => {
    colorMode.preference = appearance
  }
})

useHead(() => ({
  htmlAttrs: {
    lang: languagePreference.value,
    dir: languagePreference.value === 'ar' ? 'rtl' : 'ltr'
  }
}))
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8">
    <header>
      <h1 class="text-2xl font-semibold text-highlighted">
        Settings
      </h1>
      <p class="mt-2 text-muted">
        Manage your account preferences and appearance.
      </p>
    </header>

    <div class="space-y-6">
      <UCard class="border border-default shadow-sm">
        <template #header>
          <div class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UIcon
                name="i-lucide-user-round"
                class="size-5"
                aria-hidden="true"
              />
            </span>
            <div>
              <h2 class="font-semibold text-highlighted">
                Account
              </h2>
              <p class="mt-1 text-sm text-muted">
                Your TaskFlow account information.
              </p>
            </div>
          </div>
        </template>

        <div class="flex flex-col gap-3 rounded-lg border border-default bg-elevated/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-medium text-highlighted">
              Email address
            </p>
            <p class="mt-1 text-sm text-muted">
              Account details are unavailable until authentication is set up.
            </p>
          </div>
          <UBadge
            color="neutral"
            variant="subtle"
            class="w-fit"
          >
            Not connected
          </UBadge>
        </div>
      </UCard>

      <UCard class="border border-default shadow-sm">
        <template #header>
          <div class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UIcon
                name="i-lucide-globe-2"
                class="size-5"
                aria-hidden="true"
              />
            </span>
            <div>
              <h2 class="font-semibold text-highlighted">
                Language
              </h2>
              <p class="mt-1 text-sm text-muted">
                Choose your preferred language.
              </p>
            </div>
          </div>
        </template>

        <div class="grid gap-4 sm:grid-cols-2 sm:items-center">
          <div>
            <label
              for="settings-language"
              class="text-sm font-medium text-highlighted"
            >
              Display language
            </label>
            <p
              id="settings-language-help"
              class="mt-1 text-sm text-muted"
            >
              Arabic selection prepares the page for right-to-left layout.
            </p>
          </div>
          <USelect
            id="settings-language"
            v-model="languagePreference"
            :items="languageOptions"
            aria-describedby="settings-language-help"
            variant="none"
            class="h-11 w-full rounded-lg border border-default bg-muted/50 px-3 text-sm text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
          />
        </div>
      </UCard>

      <UCard class="border border-default shadow-sm">
        <template #header>
          <div class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UIcon
                name="i-lucide-sun-moon"
                class="size-5"
                aria-hidden="true"
              />
            </span>
            <div>
              <h2 class="font-semibold text-highlighted">
                Appearance
              </h2>
              <p class="mt-1 text-sm text-muted">
                Choose how TaskFlow looks on this device.
              </p>
            </div>
          </div>
        </template>

        <div class="grid gap-4 sm:grid-cols-2 sm:items-center">
          <div>
            <label
              for="settings-appearance"
              class="text-sm font-medium text-highlighted"
            >
              Color theme
            </label>
            <p
              id="settings-appearance-help"
              class="mt-1 text-sm text-muted"
            >
              Your selection is saved by the color mode setting.
            </p>
          </div>
          <USelect
            id="settings-appearance"
            v-model="appearancePreference"
            :items="appearanceOptions"
            aria-describedby="settings-appearance-help"
            variant="none"
            class="h-11 w-full rounded-lg border border-default bg-muted/50 px-3 text-sm text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
          />
        </div>
      </UCard>

      <UCard class="border border-default shadow-sm">
        <template #header>
          <div class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated text-muted">
              <UIcon
                name="i-lucide-log-out"
                class="size-5"
                aria-hidden="true"
              />
            </span>
            <div>
              <h2 class="font-semibold text-highlighted">
                Logout
              </h2>
              <p class="mt-1 text-sm text-muted">
                Sign out of your TaskFlow account.
              </p>
            </div>
          </div>
        </template>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="max-w-xl text-sm text-muted">
            Logout will be available after authentication is implemented.
          </p>
          <UButton
            label="Log out"
            icon="i-lucide-log-out"
            color="neutral"
            variant="outline"
            disabled
            aria-describedby="settings-logout-help"
            class="shrink-0"
          />
          <span
            id="settings-logout-help"
            class="sr-only"
          >
            Logout is unavailable because authentication has not been set up.
          </span>
        </div>
      </UCard>
    </div>
  </div>
</template>
