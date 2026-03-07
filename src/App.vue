<template>
  <div class="min-h-screen text-mist">
    <header class="px-6 pt-8 pb-4 sm:px-10">
      <div class="flex flex-wrap items-center justify-between gap-4">
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
      <section v-if="!hasAccess" class="login-shell flex min-h-[75vh] items-center justify-center px-4 py-10">
        <div class="login-card fade-in w-full max-w-3xl rounded-[36px] p-10 text-mist shadow-2xl sm:p-14">
          <div class="flex items-center gap-5">
            <div class="login-icon h-16 w-16 rounded-2xl"></div>
            <div>
              <p class="text-xs uppercase tracking-[0.45em] text-white/60">Welcome to AppleHut</p>
              <h2 class="mt-2 text-3xl font-semibold text-white">Sign in with Apple ID</h2>
            </div>
          </div>

          <form class="mt-10 space-y-6" @submit.prevent="grantAccess('Signed In')">
            <div>
              <label class="block text-sm font-medium text-white/70">Email or Phone</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="name@icloud.com"
                class="mt-3 w-full rounded-2xl border border-white/15 bg-black/30 px-5 py-4 text-base text-white placeholder:text-white/40 focus:border-citron focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white/70">Password</label>
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="mt-3 w-full rounded-2xl border border-white/15 bg-black/30 px-5 py-4 text-base text-white placeholder:text-white/40 focus:border-citron focus:outline-none"
              />
            </div>

            <div class="flex flex-wrap items-center justify-between gap-4 text-sm text-white/60">
              <label class="flex items-center gap-3">
                <input type="checkbox" class="h-4 w-4 rounded border-white/30 text-citron" />
                Keep me signed in
              </label>
              <button type="button" class="font-semibold text-white">Forgot password?</button>
            </div>

            <button
              type="submit"
              class="mt-2 w-full rounded-2xl bg-citron px-5 py-4 text-base font-semibold text-ink shadow-lg transition hover:translate-y-[-1px]"
            >
              Sign In
            </button>
          </form>

          <div class="my-8 flex items-center gap-4 text-sm text-white/40">
            <span class="h-px flex-1 bg-white/15"></span>
            or
            <span class="h-px flex-1 bg-white/15"></span>
          </div>

          <div class="space-y-3">
            <button class="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-base font-medium text-white transition hover:border-citron/70">
              Continue with Face ID
            </button>
            <button class="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-base font-medium text-white transition hover:border-citron/70">
              Create Apple ID
            </button>
            <button
              class="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-base font-medium text-white transition hover:border-citron/70"
              @click="grantAccess('Stayed Locked Out')"
            >
              Stay Logged Out
            </button>
          </div>

          <p class="mt-8 text-sm text-white/60">
            New to Apple? Create an Apple ID to get started with iCloud, App Store, and more.
          </p>
        </div>
      </section>

      <section v-else class="space-y-10">
        <nav class="glass rounded-full px-4 py-2 sm:px-8">
          <ul class="flex flex-wrap items-center justify-center gap-4 text-sm uppercase tracking-[0.25em] text-white/70 sm:gap-8">
            <li>
              <button
                class="transition hover:text-citron"
                :class="currentPage === 'home' ? 'text-citron' : ''"
                @click="goHome"
              >
                Home
              </button>
            </li>
            <li v-for="item in navItems" :key="item">
              <button
                class="transition hover:text-citron"
                :class="currentCategory === item && currentPage === 'products' ? 'text-citron' : ''"
                @click="goToCategory(item)"
              >
                {{ item }}
              </button>
            </li>
          </ul>
        </nav>

        <div v-if="currentPage === 'home'" class="glass fade-in flex flex-col items-center gap-6 rounded-3xl p-10 sm:p-14">
          <h2 class="text-3xl font-semibold uppercase tracking-[0.3em] text-orange-400">iPhone 17 Pro Max</h2>
          <img
            :key="currentPage"
            :src="homeHero"
            alt="iPhone lineup"
            class="h-96 w-96 rounded-3xl object-cover shadow-2xl pop-in"
          />
        </div>

        <div v-else class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="space-y-6">
            <div class="glass rounded-3xl p-6 sm:p-8">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.3em] text-white/60">Category</p>
                  <h2 class="text-2xl sm:text-3xl font-semibold">{{ currentCategory }}</h2>
                </div>
                <div class="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-citron">
                  {{ currentList.length }} options
                </div>
              </div>
            </div>

            <div class="grid gap-6 sm:grid-cols-2">
              <article
                v-for="product in currentList"
                :key="product.id"
                class="glass group flex flex-col overflow-hidden rounded-3xl p-5 transition hover:-translate-y-1 hover:border-citron/40"
                @click="selectProduct(product)"
              >
                <img :src="product.image" :alt="product.name" class="h-44 w-full rounded-2xl object-cover" />
                <div class="mt-4 flex items-center justify-between">
                  <h3 class="text-lg font-semibold">{{ product.name }}</h3>
                  <span class="text-xs uppercase tracking-[0.2em] text-white/50">{{ product.category }}</span>
                </div>
                <p class="mt-3 text-sm text-white/60">{{ product.tagline }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-sm text-white/70">From {{ formatPrice(product.basePrice) }}</span>
                  <span class="text-xs uppercase tracking-[0.2em] text-citron">View</span>
                </div>
              </article>
            </div>
          </div>

          <aside ref="detailSection" class="glass rounded-3xl p-6 sm:p-8">
            <div v-if="selected" :key="selected.id" class="fade-in space-y-6 pop-in">
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
              <img :src="selectedImage" :alt="selected.name" class="h-48 w-full rounded-2xl object-cover" />
              <ul class="space-y-3 text-sm text-white/70">
                <li v-for="detail in selected.details" :key="detail">• {{ detail }}</li>
              </ul>
              <div class="space-y-3">
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">Color</p>
                <div class="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
                  <button
                    v-for="color in selected.colors"
                    :key="color"
                    class="rounded-full border px-3 py-2 transition hover:-translate-y-0.5 hover:border-citron/70 hover:text-citron"
                    :class="selectedColor === color ? 'border-citron text-citron' : 'border-white/10 text-white/70'"
                    @click="selectedColor = color"
                  >
                    {{ color }}
                  </button>
                </div>
              </div>
              <div v-if="hasStorageOptions" class="space-y-3">
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">Storage</p>
                <div class="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
                  <button
                    v-for="(option, index) in selected.storageOptions"
                    :key="option.size"
                    class="rounded-full border px-3 py-2 transition hover:-translate-y-0.5 hover:border-citron/70 hover:text-citron"
                    :class="selectedStorageIndex === index ? 'border-citron text-citron' : 'border-white/10 text-white/70'"
                    @click="selectedStorageIndex = index"
                  >
                    {{ option.size }}GB
                  </button>
                </div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">Starting at</p>
                <p class="mt-2 text-2xl font-semibold text-citron">{{ selectedPrice }}</p>
              </div>
              <div class="space-y-3">
                <p class="text-xs uppercase tracking-[0.3em] text-white/60">Card Options</p>
                <div class="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
                  <span class="rounded-full border border-white/10 px-3 py-2 text-white/70">Visa</span>
                  <span class="rounded-full border border-white/10 px-3 py-2 text-white/70">Mastercard</span>
                  <span class="rounded-full border border-white/10 px-3 py-2 text-white/70">Amex</span>
                </div>
              </div>
              <div class="flex flex-wrap gap-3">
                <button class="rounded-full bg-citron px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-ink">
                  Add to Cart
                </button>
                <button class="rounded-full border border-white/20 px-5 py-3 text-xs uppercase tracking-[0.3em] text-white/70">
                  Hold Order
                </button>
              </div>
            </div>

            <div v-else class="space-y-4 text-white/60">
              <p class="text-xs uppercase tracking-[0.3em]">No selection yet</p>
              <h3 class="text-2xl font-semibold text-white">Choose a product</h3>
              <p>Select any product card to reveal the details here.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import iphone from './assets/iphone 17 pro max.webp'
import homeHero from './assets/iPhone-17-and-17-Pro-colors-here-are-all-the-official-hues.jpg'
import macbook from './assets/macbook.svg'
import ipad from './assets/ipad.svg'
import airpods from './assets/airpods.svg'
import watch from './assets/watch.svg'
import iphone17CosmicOrange from '/Users/sanjithab/Desktop/GUI Mini Project_test_2/src/assets/iPhone_17_Pro_Max_Cosmic_Orange_PDP_Image_Position_1_Cosmic_Orange_newavif.avif'
import iphone17DeepBlue from '/Users/sanjithab/Desktop/GUI Mini Project_test_2/src/assets/iPhone_17_Pro_Max_Deep_Blue_new.webp'
import iphone17Silver from '/Users/sanjithab/Desktop/GUI Mini Project_test_2/src/assets/iPhone_17_Pro_Max_Silver_new.webp'
import colorBlack from './assets/color-black.svg'
import colorSilver from './assets/color-silver.svg'
import colorGold from './assets/color-gold.svg'
import colorBlue from './assets/color-blue.svg'
import colorPink from './assets/color-pink.svg'
import colorGreen from './assets/color-green.svg'
import colorPurple from './assets/color-purple.svg'
import colorWhite from './assets/color-white.svg'

type Product = {
  id: number
  name: string
  category: string
  basePrice: number
  tagline: string
  details: string[]
  image: string
  colors: string[]
  storageOptions: { size: number; add: number }[]
}

type Category = 'iPhone' | 'Mac' | 'iPad' | 'Watch' | 'AirPods'

const navItems: Category[] = ['iPhone', 'Mac', 'iPad', 'Watch', 'AirPods']

const email = ref('')
const password = ref('')
const hasAccess = ref(false)
const accessLabel = ref('')

const currentPage = ref<'home' | 'products'>('home')
const currentCategory = ref<Category>('iPhone')

const storageOptions = [
  { size: 128, add: 0 },
  { size: 256, add: 120 },
  { size: 512, add: 240 },
]

const iphoneVariants = ref<Product[]>([
  {
    id: 101,
    name: 'iPhone 17 Por Max',
    category: 'iPhone 17',
    basePrice: 149,
    tagline: 'Classic 4.7-inch Retina HD with Touch ID.',
    details: ['4.7-inch Retina HD display', 'A9 chip with M9 motion coprocessor', '12MP rear camera'],
    image: iphone,
    colors: ['Cosmic Orange', 'Deep Blue', 'Silver'],
    storageOptions,
  },
  {
    id: 102,
    name: 'iPhone  17 Pro',
    category: 'iPhone 17',
    basePrice: 179,
    tagline: 'Bigger 5.5-inch screen with optical image stabilization.',
    details: ['5.5-inch Retina HD display', 'Optical image stabilization', 'Fast LTE connectivity'],
    image: iphone,
    colors: ['Space Gray', 'Silver', 'Gold'],
    storageOptions,
  },
  {
    id: 103,
    name: 'iPhone 17',
    category: 'iPhone 17',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
  {
    id: 104,
    name: 'iPhone Air',
    category: 'iPhone Air',
    basePrice: 199,
    tagline: 'Stereo speakers and water resistance.',
    details: ['Water resistant (IP67)', 'Stereo speakers', '12MP camera'],
    image: iphone,
    colors: ['Jet Black', 'Black', 'Silver', 'Gold'],
    storageOptions,
  },
   {
    id: 105,
    name: 'iPhone 16 Pro Max',
    category: 'iPhone 16',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
   {
    id: 106,
    name: 'iPhone 16 Pro ',
    category: 'iPhone 16',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
   {
    id: 107,
    name: 'iPhone 16',
    category: 'iPhone 16',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
   {
    id: 108,
    name: 'iPhone 15 Pro Max',
    category: 'iPhone 15',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
   {
    id: 109,
    name: 'iPhone 15 Pro',
    category: 'iPhone 15',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
   {
    id: 110,
    name: 'iPhone 15 ',
    category: 'iPhone 15',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
   {
    id: 111,
    name: 'iPhone 14 Pro Max',
    category: 'iPhone 14',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
   {
    id: 112,
    name: 'iPhone 14 Pro',
    category: 'iPhone 14',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
   {
    id: 113,
    name: 'iPhone 14',
    category: 'iPhone 14',
    basePrice: 129,
    tagline: 'Compact power with the A9 chip.',
    details: ['4-inch Retina display', 'A9 chip', 'Apple Pay with Touch ID'],
    image: iphone,
    colors: ['Silver', 'Space Gray', 'Rose Gold'],
    storageOptions,
  },
])

const catalog = ref<Record<Category, Product[]>>({
  iPhone: iphoneVariants.value,
  Mac: [
    {
      id: 201,
      name: 'MacBook Pro 14"',
      category: 'Mac',
      basePrice: 1999,
      tagline: 'M3 Pro performance in a compact powerhouse.',
      details: ['14.2-inch Liquid Retina XDR', 'M3 Pro chip', 'Up to 18 hours battery life'],
      image: macbook,
      colors: ['Space Black', 'Silver'],
      storageOptions: [
        { size: 512, add: 0 },
        { size: 1000, add: 200 },
        { size: 2000, add: 500 },
      ],
    },
    {
      id: 202,
      name: 'MacBook Air 13"',
      category: 'Mac',
      basePrice: 1099,
      tagline: 'Ultra-light with all-day battery.',
      details: ['13.6-inch Liquid Retina', 'M3 chip', 'Up to 18 hours battery life'],
      image: macbook,
      colors: ['Midnight', 'Starlight', 'Space Gray', 'Silver'],
      storageOptions: [
        { size: 256, add: 0 },
        { size: 512, add: 200 },
        { size: 1000, add: 400 },
      ],
    },
    {
      id: 203,
      name: 'iMac 24"',
      category: 'Mac',
      basePrice: 1299,
      tagline: 'All-in-one with vibrant 4.5K display.',
      details: ['24-inch 4.5K Retina', 'M3 chip', 'Studio-quality mics'],
      image: macbook,
      colors: ['Blue', 'Green', 'Pink', 'Silver'],
      storageOptions: [
        { size: 256, add: 0 },
        { size: 512, add: 200 },
        { size: 1000, add: 400 },
      ],
    },
  ],
  iPad: [
    {
      id: 301,
      name: 'iPad Air',
      category: 'iPad',
      basePrice: 599,
      tagline: 'Slim, light, and ready for everything.',
      details: ['10.9-inch Liquid Retina display', 'M1 chip', 'Apple Pencil support'],
      image: ipad,
      colors: ['Space Gray', 'Blue', 'Pink', 'Starlight'],
      storageOptions: [
        { size: 128, add: 0 },
        { size: 256, add: 100 },
        { size: 512, add: 200 },
      ],
    },
    {
      id: 302,
      name: 'iPad Pro 11"',
      category: 'iPad',
      basePrice: 799,
      tagline: 'Pro power in a portable size.',
      details: ['11-inch Liquid Retina', 'M4 chip', 'ProMotion display'],
      image: ipad,
      colors: ['Space Black', 'Silver'],
      storageOptions: [
        { size: 128, add: 0 },
        { size: 256, add: 120 },
        { size: 512, add: 240 },
      ],
    },
    {
      id: 303,
      name: 'iPad mini',
      category: 'iPad',
      basePrice: 499,
      tagline: 'Small size. Big capability.',
      details: ['8.3-inch Liquid Retina', 'A15 Bionic', 'USB-C'],
      image: ipad,
      colors: ['Purple', 'Starlight', 'Pink', 'Space Gray'],
      storageOptions: [
        { size: 64, add: 0 },
        { size: 128, add: 100 },
        { size: 256, add: 200 },
      ],
    },
  ],
  Watch: [
    {
      id: 401,
      name: 'Apple Watch Ultra',
      category: 'Watch',
      basePrice: 799,
      tagline: 'Adventure-ready with advanced health features.',
      details: ['49mm titanium case', 'Action button', 'Up to 36 hours battery life'],
      image: watch,
      colors: ['Natural', 'Black'],
      storageOptions: [
        { size: 32, add: 0 },
        { size: 64, add: 80 },
        { size: 128, add: 160 },
      ],
    },
    {
      id: 402,
      name: 'Apple Watch Series 9',
      category: 'Watch',
      basePrice: 399,
      tagline: 'Powerful sensors and a brighter display.',
      details: ['S9 SiP', 'Double Tap gesture', 'All-day battery'],
      image: watch,
      colors: ['Midnight', 'Starlight', 'Silver'],
      storageOptions: [
        { size: 32, add: 0 },
        { size: 64, add: 80 },
        { size: 128, add: 160 },
      ],
    },
    {
      id: 403,
      name: 'Apple Watch SE',
      category: 'Watch',
      basePrice: 249,
      tagline: 'Essential features at a great value.',
      details: ['Crash Detection', 'Sleep tracking', 'Swimproof'],
      image: watch,
      colors: ['Midnight', 'Starlight', 'Silver'],
      storageOptions: [
        { size: 32, add: 0 },
        { size: 64, add: 80 },
        { size: 128, add: 160 },
      ],
    },
  ],
  AirPods: [
    {
      id: 501,
      name: 'AirPods Pro',
      category: 'AirPods',
      basePrice: 249,
      tagline: 'Active Noise Cancellation and spatial audio.',
      details: ['Adaptive Transparency', 'Personalized Spatial Audio', 'MagSafe charging case'],
      image: airpods,
      colors: ['White'],
      storageOptions: [
        { size: 0, add: 0 },
        { size: 0, add: 0 },
        { size: 0, add: 0 },
      ],
    },
    {
      id: 502,
      name: 'AirPods (3rd Gen)',
      category: 'AirPods',
      basePrice: 179,
      tagline: 'Immersive sound with spatial audio.',
      details: ['Spatial Audio', 'Sweat and water resistant', 'Lightning charging'],
      image: airpods,
      colors: ['White'],
      storageOptions: [
        { size: 0, add: 0 },
        { size: 0, add: 0 },
        { size: 0, add: 0 },
      ],
    },
    {
      id: 503,
      name: 'AirPods Max',
      category: 'AirPods',
      basePrice: 549,
      tagline: 'High-fidelity audio with premium comfort.',
      details: ['Active Noise Cancellation', 'Dynamic drivers', 'Digital Crown'],
      image: airpods,
      colors: ['Space Gray', 'Silver', 'Green', 'Sky Blue', 'Pink'],
      storageOptions: [
        { size: 0, add: 0 },
        { size: 0, add: 0 },
        { size: 0, add: 0 },
      ],
    },
  ],
})

const selected = ref<Product | null>(iphoneVariants.value[0])
const detailSection = ref<HTMLElement | null>(null)
const selectedStorageIndex = ref(0)
const selectedColor = ref(iphoneVariants.value[0]?.colors[0] ?? '')

const currentList = computed(() => catalog.value[currentCategory.value])
const hasStorageOptions = computed(() => {
  if (!selected.value) return false
  return selected.value.storageOptions.some((option) => option.size > 0)
})
const selectedPrice = computed(() => {
  if (!selected.value) return '$0'
  const option = selected.value.storageOptions[selectedStorageIndex.value]
  const add = option ? option.add : 0
  return formatPrice(selected.value.basePrice + add)
})

const colorImageMap: Record<string, string> = {
  'Space Gray': colorBlack,
  Black: colorBlack,
  'Jet Black': colorBlack,
  'Space Black': colorBlack,
  Midnight: colorBlack,
  Silver: colorSilver,
  Starlight: colorSilver,
  Natural: colorSilver,
  Gold: colorGold,
  'Rose Gold': colorGold,
  Blue: colorBlue,
  'Sky Blue': colorBlue,
  Pink: colorPink,
  Green: colorGreen,
  Purple: colorPurple,
  White: colorWhite,
}

const selectedImage = computed(() => {
  if (!selected.value) return iphone
  const isIphone17Max =
    selected.value.category === 'iPhone 17' &&
    selected.value.name.toLowerCase().includes('max')
  if (isIphone17Max) {
    if (selectedColor.value === 'Cosmic Orange') return iphone17CosmicOrange
    if (selectedColor.value === 'Deep Blue') return iphone17DeepBlue
    if (selectedColor.value === 'Silver') return iphone17Silver
  }
  return colorImageMap[selectedColor.value] ?? selected.value.image
})

const grantAccess = (label: string) => {
  accessLabel.value = label
  hasAccess.value = true
  currentPage.value = 'home'
}

const resetAccess = () => {
  hasAccess.value = false
  accessLabel.value = ''
  email.value = ''
  password.value = ''
  currentPage.value = 'home'
  currentCategory.value = 'iPhone'
  selected.value = iphoneVariants.value[0]
  selectedStorageIndex.value = 0
  selectedColor.value = iphoneVariants.value[0]?.colors[0] ?? ''
}

const selectProduct = (product: Product) => {
  selected.value = product
  selectedStorageIndex.value = 0
  selectedColor.value = product.colors[0] ?? ''
  detailSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const goHome = () => {
  currentPage.value = 'home'
}

const goToCategory = (category: Category) => {
  currentCategory.value = category
  currentPage.value = 'products'
  selected.value = catalog.value[category][0] ?? null
  selectedStorageIndex.value = 0
  selectedColor.value = selected.value?.colors[0] ?? ''
}

const formatPrice = (value: number) => `$${value.toLocaleString()}`
</script>
