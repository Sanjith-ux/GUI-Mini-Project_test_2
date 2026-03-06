<template>
  <div class="min-h-screen text-mist">
    <header class="px-6 pt-8 pb-4 sm:px-10">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.3em] text-citron/80">Cupertino Collection</p>
          <h1 class="text-3xl sm:text-4xl font-semibold">Apple Product Gallery</h1>
        </div>
        <button
          v-if="hasAccess"
          class="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-citron/80 hover:text-citron"
          @click="resetAccess"
        >
          Log out
        </button>
      </div>
    </header>

    <main class="px-6 pb-16 sm:px-10">
      <section v-if="!hasAccess" class="flex min-h-[70vh] items-center justify-center">
        <div class="glass fade-in grid w-full max-w-5xl gap-6 rounded-3xl p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 class="text-3xl sm:text-4xl font-semibold">Welcome to the Apple vault</h2>
            <p class="mt-4 text-base text-white/70">
              Sign in to unlock the product archive, or stay locked out and still explore the lineup.
              It is your call.
            </p>
            <form class="mt-8 space-y-4" @submit.prevent="grantAccess('Signed In')">
              <label class="block text-sm uppercase tracking-[0.2em] text-white/60">Apple ID</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="you@icloud.com"
                class="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-citron focus:outline-none"
              />
              <label class="block text-sm uppercase tracking-[0.2em] text-white/60">Password</label>
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-citron focus:outline-none"
              />
              <button
                type="submit"
                class="w-full rounded-2xl bg-citron px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-ink transition hover:shadow-glow"
              >
                Sign In
              </button>
            </form>
            <button
              class="mt-4 w-full rounded-2xl border border-white/20 px-5 py-3 text-sm uppercase tracking-[0.3em] text-white/70 transition hover:border-citron/80 hover:text-citron"
              @click="grantAccess('Stayed Locked Out')"
            >
              Stay Locked Out
            </button>
          </div>
          <div class="flex flex-col justify-between gap-6">
            <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-black/60 to-slate-950/90 p-6">
              <p class="text-sm uppercase tracking-[0.3em] text-white/50">Preview</p>
              <h3 class="mt-4 text-2xl font-semibold">Today&apos;s featured lineup</h3>
              <p class="mt-3 text-sm text-white/60">
                iPhone, MacBook Pro, iPad Air, AirPods Pro, and Apple Watch. Tap in to see the details
                for each product.
              </p>
            </div>
            <div class="rounded-3xl border border-white/10 bg-black/40 p-6">
              <p class="text-xs uppercase tracking-[0.3em] text-white/50">Status</p>
              <p class="mt-3 text-lg">{{ statusMessage }}</p>
              <p class="mt-2 text-sm text-white/60">We do not store any data. This is a visual demo.</p>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div class="space-y-6">
          <div class="glass rounded-3xl p-6 sm:p-8">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">Access</p>
                <h2 class="text-2xl sm:text-3xl font-semibold">{{ accessBadge }}</h2>
              </div>
              <div class="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-citron">
                {{ products.length }} products
              </div>
            </div>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <article
              v-for="product in products"
              :key="product.id"
              class="glass group flex flex-col overflow-hidden rounded-3xl p-5 transition hover:-translate-y-1 hover:border-citron/40"
              @click="selectProduct(product)"
            >
              <img
                :src="product.image"
                :alt="product.name"
                class="h-48 w-full rounded-2xl object-cover"
              />
              <div class="mt-4 flex items-center justify-between">
                <h3 class="text-lg font-semibold">{{ product.name }}</h3>
                <span class="text-xs uppercase tracking-[0.2em] text-white/50">{{ product.category }}</span>
              </div>
              <p class="mt-3 text-sm text-white/60">{{ product.tagline }}</p>
              <div class="mt-4 flex items-center justify-between">
                <span class="text-sm text-white/70">From {{ product.price }}</span>
                <span class="text-xs uppercase tracking-[0.2em] text-citron">View</span>
              </div>
            </article>
          </div>
        </div>

        <aside class="glass rounded-3xl p-6 sm:p-8">
          <div v-if="selected" class="fade-in space-y-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">Selected</p>
                <h2 class="mt-2 text-2xl font-semibold">{{ selected.name }}</h2>
                <p class="mt-2 text-sm text-white/60">{{ selected.tagline }}</p>
              </div>
              <span class="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                {{ selected.category }}
              </span>
            </div>
            <img :src="selected.image" :alt="selected.name" class="h-48 w-full rounded-2xl object-cover" />
            <ul class="space-y-3 text-sm text-white/70">
              <li v-for="detail in selected.details" :key="detail">• {{ detail }}</li>
            </ul>
            <div class="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-white/60">Starting at</p>
              <p class="mt-2 text-2xl font-semibold text-citron">{{ selected.price }}</p>
            </div>
          </div>

          <div v-else class="space-y-4 text-white/60">
            <p class="text-xs uppercase tracking-[0.3em]">No selection yet</p>
            <h3 class="text-2xl font-semibold text-white">Choose a product</h3>
            <p>Select any product card to reveal the details here.</p>
          </div>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import iphone from './assets/iphone.svg'
import macbook from './assets/macbook.svg'
import ipad from './assets/ipad.svg'
import airpods from './assets/airpods.svg'
import watch from './assets/watch.svg'

type Product = {
  id: number
  name: string
  category: string
  price: string
  tagline: string
  details: string[]
  image: string
}

const email = ref('')
const password = ref('')
const hasAccess = ref(false)
const accessLabel = ref('')

const products = ref<Product[]>([
  {
    id: 1,
    name: 'iPhone 15 Pro',
    category: 'iPhone',
    price: '$999',
    tagline: 'Titanium. Pro camera system. A17 Pro power.',
    details: ['6.1-inch Super Retina XDR display', 'A17 Pro chip with 6-core GPU', 'Pro camera system with 5x zoom'],
    image: iphone,
  },
  {
    id: 2,
    name: 'MacBook Pro 14"',
    category: 'Mac',
    price: '$1,999',
    tagline: 'M3 Pro performance in a compact powerhouse.',
    details: ['14.2-inch Liquid Retina XDR', 'M3 Pro chip', 'Up to 18 hours battery life'],
    image: macbook,
  },
  {
    id: 3,
    name: 'iPad Air',
    category: 'iPad',
    price: '$599',
    tagline: 'Slim, light, and ready for everything.',
    details: ['10.9-inch Liquid Retina display', 'M1 chip', 'Apple Pencil support'],
    image: ipad,
  },
  {
    id: 4,
    name: 'AirPods Pro',
    category: 'Audio',
    price: '$249',
    tagline: 'Active Noise Cancellation and spatial audio.',
    details: ['Adaptive Transparency', 'Personalized Spatial Audio', 'MagSafe charging case'],
    image: airpods,
  },
  {
    id: 5,
    name: 'Apple Watch Ultra',
    category: 'Watch',
    price: '$799',
    tagline: 'Adventure-ready with advanced health features.',
    details: ['49mm titanium case', 'Action button', 'Up to 36 hours battery life'],
    image: watch,
  },
])

const selected = ref<Product | null>(products.value[0])

const statusMessage = computed(() => {
  if (!accessLabel.value) return 'Awaiting your choice.'
  return `Last action: ${accessLabel.value}`
})

const accessBadge = computed(() => (accessLabel.value ? accessLabel.value : 'Guest Access'))

const grantAccess = (label: string) => {
  accessLabel.value = label
  hasAccess.value = true
}

const resetAccess = () => {
  hasAccess.value = false
  accessLabel.value = ''
  email.value = ''
  password.value = ''
  selected.value = products.value[0]
}

const selectProduct = (product: Product) => {
  selected.value = product
}
</script>
