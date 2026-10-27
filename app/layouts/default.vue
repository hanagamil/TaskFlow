<script setup lang="ts">
import { ref } from 'vue'

const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)

const navigation = [
  { label: 'Dashboard', to: '/', icon: 'i-lucide-layout-dashboard' },
  { label: 'All Tasks', to: '/tasks', icon: 'i-lucide-check-square' },
  { label: 'Projects', to: '/projects', icon: 'i-lucide-folder-kanban' },
  { label: 'Settings', to: '/settings', icon: 'i-lucide-settings' }
]
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <aside
      class="fixed inset-y-0 left-0 z-30 hidden h-screen border-r border-default bg-elevated lg:flex lg:flex-col"
      :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
    >
      <div class="flex h-16 shrink-0 items-center border-b border-default px-4">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3 font-semibold text-highlighted">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <UIcon name="i-lucide-check-check" class="size-5" />
          </span>
          <span v-if="!isSidebarCollapsed" class="truncate">TaskFlow</span>
        </NuxtLink>
      </div>

      <nav id="desktop-navigation" aria-label="Main navigation" class="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
        <template v-for="item in navigation" :key="item.to">
          <UTooltip v-if="isSidebarCollapsed" :text="item.label" side="right">
            <NuxtLink
              :to="item.to"
              :aria-label="item.label"
              active-class="bg-primary/10 text-primary"
              class="flex h-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accented hover:text-highlighted"
            >
              <UIcon :name="item.icon" class="size-5" />
            </NuxtLink>
          </UTooltip>
          <NuxtLink
            v-else
            :to="item.to"
            active-class="bg-primary/10 text-primary"
            class="flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-accented hover:text-highlighted"
          >
            <UIcon :name="item.icon" class="size-5 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>
      </nav>

      <div class="mt-auto shrink-0 border-t border-default p-3">
        <UButton
          :icon="isSidebarCollapsed ? 'i-lucide-panel-right-open' : 'i-lucide-panel-left-close'"
          :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :aria-expanded="!isSidebarCollapsed"
          aria-controls="desktop-navigation"
          color="neutral"
          variant="ghost"
          block
          :class="isSidebarCollapsed ? 'justify-center' : 'justify-start'"
          @click="isSidebarCollapsed = !isSidebarCollapsed"
        >
          <span v-if="!isSidebarCollapsed">Collapse sidebar</span>
        </UButton>
      </div>
    </aside>

    <div
      class="min-h-screen transition-[margin-left] duration-200"
      :class="isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'"
    >
      <header class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-default bg-default/95 px-4 backdrop-blur lg:px-8">
        <UButton
          icon="i-lucide-menu"
          aria-label="Open navigation menu"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          @click="isMobileMenuOpen = true"
        />
        <span class="font-semibold text-highlighted lg:hidden">TaskFlow</span>
        <div class="ml-auto">
          <UColorModeButton />
        </div>
      </header>

      <main class="p-4 md:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <UDrawer v-model:open="isMobileMenuOpen" title="TaskFlow" direction="left">
      <template #body>
        <nav aria-label="Main navigation" class="space-y-1">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            active-class="bg-primary/10 text-primary"
            class="flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-accented hover:text-highlighted"
            @click="isMobileMenuOpen = false"
          >
            <UIcon :name="item.icon" class="size-5 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </template>
    </UDrawer>
  </div>
</template>