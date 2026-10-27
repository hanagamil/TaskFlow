<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-semibold text-highlighted">Dashboard</h1>
      <p class="mt-2 text-muted">A quick overview of your projects and tasks.</p>
    </div>

    <section aria-label="Dashboard summary" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <UCard>
        <p class="text-sm font-medium text-muted">Total Projects</p>
        <p class="mt-3 text-3xl font-semibold text-highlighted">—</p>
      </UCard>
      <UCard>
        <p class="text-sm font-medium text-muted">Open Tasks</p>
        <p class="mt-3 text-3xl font-semibold text-highlighted">—</p>
      </UCard>
      <UCard>
        <p class="text-sm font-medium text-muted">Overdue Tasks</p>
        <p class="mt-3 text-3xl font-semibold text-highlighted">—</p>
      </UCard>
      <UCard>
        <p class="text-sm font-medium text-muted">Upcoming Deadlines</p>
        <p class="mt-3 text-3xl font-semibold text-highlighted">—</p>
      </UCard>
    </section>
  </div>
</template>