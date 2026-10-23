<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import TCGdex from '@tcgdex/sdk'
const tcgdex = new TCGdex('it')

const pokemonImageUrl = ref<string | null>('')
// L'API restituisce anche `pricing`, che i tipi dell'SDK non dichiarano
type RandomCard = Awaited<ReturnType<typeof tcgdex.random.card>> & {
  pricing?: { cardmarket?: { trend?: number | null } | null }
}
const randomCard = ref<RandomCard | null>(null)

// Si cerca una carta con immagine e prezzo, con un limite per non ciclare all'infinito
const MAX_ATTEMPTS = 5

const getImageUrl = async (attempt = 1): Promise<void> => {
  if (localStorage.getItem('@tcgdex-cache/https://api.tcgdex.net/v2/it/random/card'))
    localStorage.removeItem('@tcgdex-cache/https://api.tcgdex.net/v2/it/random/card')
  const card = (await tcgdex.random.card().catch(() => null)) as RandomCard | null
  if (!card) return
  randomCard.value = card
  if (card.getImageURL('high', 'png') == 'undefined/high.png' || !card.pricing?.cardmarket) {
    if (localStorage.getItem('@tcgdex-cache/https://api.tcgdex.net/v2/it/random/card'))
      localStorage.removeItem('@tcgdex-cache/https://api.tcgdex.net/v2/it/random/card')
    if (attempt < MAX_ATTEMPTS) await getImageUrl(attempt + 1)
    return
  }
  pokemonImageUrl.value = card.getImageURL('high', 'png')
}

onBeforeMount(async () => {
  await getImageUrl()
})
</script>
<template>
  <div v-motion-slide-right v-if="randomCard" class="card card-side bg-base-100 shadow-s w-full">
    <div class="card-body" :submit-attrs="{ style: { height: '75vh' } }">
      <div class="grid md:grid-cols-4 gap-4 w-full">
        <div v-if="pokemonImageUrl" v-motion-pop class="md:col-start-1 md:col-end-3">
          <div class="hover-3d mx-auto w-full mt-12">
            <!-- content -->
            <figure class="w-75 rounded-2xl mx-auto">
              <img :src="pokemonImageUrl" />
            </figure>
            <!-- 8 empty divs needed for the 3D effect -->
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="md:col-start-3 md:col-end-5 rounded-box">
          <ul class="list bg-base-100 rounded-box shadow-lg mx-auto w-full block">
            <li class="p-4 pb-2 tracking-wide bg-neutral rounded-tr-box rounded-tl-box">
              <h1 class="text-4xl text-left mb-4">
                {{ randomCard?.name }}
                <span class="text-lg"
                  ><em
                    ># {{ randomCard?.localId }}/{{ randomCard?.set.cardCount.official }}</em
                  ></span
                >
              </h1>
            </li>

            <li class="list-row">
              <div class="grid md:grid-cols-6">
                <div class="md:col-start-1 md:col-end-4">
                  <div class="text-2xl font-thin opacity-30 tabular-nums">Espansione</div>
                </div>
                <div class="md:col-start-4 md:col-end-7">
                  <div class="list-col-grow mx-auto">
                    <div v-if="!randomCard?.set.logo" class="list-col-grow">
                      <span class="text-xl mt-1 block">{{ randomCard?.set.name }}</span>
                    </div>
                    <img v-else :src="randomCard?.set.logo + '.png'" class="w-48" />
                  </div>
                </div>
              </div>
            </li>

            <li class="list-row">
              <div class="grid md:grid-cols-6">
                <div class="md:col-start-1 md:col-end-4">
                  <div class="text-2xl font-thin opacity-30 tabular-nums">Rarità</div>
                </div>
                <div class="md:col-start-4 md:col-end-7">
                  <div class="list-col-grow">
                    <span class="text-lg block mt-1">
                      {{ randomCard?.rarity }}
                    </span>
                  </div>
                </div>
              </div>
            </li>

            <li class="list-row">
              <div class="grid md:grid-cols-6">
                <div class="md:col-start-1 md:col-end-4">
                  <div class="text-2xl font-thin opacity-30 tabular-nums">Tipo</div>
                </div>
                <div class="md:col-start-4 md:col-end-7">
                  <div class="list-col-grow">
                    <span class="text-lg block mt-1">
                      {{ randomCard?.types?.join('/') || 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>
            </li>

            <li class="list-row">
              <div class="grid md:grid-cols-6">
                <div class="md:col-start-1 md:col-end-4">
                  <div class="text-2xl font-thin opacity-30 tabular-nums">Stage</div>
                </div>
                <div class="md:col-start-4 md:col-end-7">
                  <div class="list-col-grow">
                    <span class="text-lg block mt-1">
                      {{ randomCard?.stage }}
                    </span>
                  </div>
                </div>
              </div>
            </li>

            <li class="list-row">
              <div class="grid md:grid-cols-6">
                <div class="md:col-start-1 md:col-end-4">
                  <div class="text-2xl font-thin opacity-30 tabular-nums">Illustratore</div>
                </div>
                <div class="md:col-start-4 md:col-end-7">
                  <div class="list-col-grow">
                    <span class="text-lg block mt-1" v-if="randomCard?.illustrator">
                      {{
                        randomCard?.illustrator
                          .split(' ')
                          .map(
                            (name: string) =>
                              name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
                          )
                          .join(' ')
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </li>

            <li class="list-row">
              <div class="grid md:grid-cols-6">
                <div class="md:col-start-1 md:col-end-4">
                  <div class="text-2xl font-thin opacity-30 tabular-nums">Prezzo</div>
                </div>
                <div class="md:col-start-4 md:col-end-7">
                  <div class="list-col-grow">
                    <span class="text-lg block mt-1" v-if="randomCard?.pricing?.cardmarket">
                      {{
                        randomCard?.pricing?.cardmarket?.trend
                          ? '€ ' + randomCard.pricing.cardmarket.trend.toFixed(2)
                          : 'N/A'
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
