<script setup>
defineProps({
  tone: {
    type: String,
    default: "light", // "light" = white strokes/fills on navy · "navy" = navy on bone
  },
  opacity: {
    type: Number,
    default: 1,
  },
});

const TEETH = 7;
const toothWidth = 34;
const gap = 22;
const topWidth = TEETH * toothWidth + (TEETH - 1) * gap;
const archHeight = 210;
const toothHeight = 520;
const width = topWidth;
const height = archHeight + toothHeight;

function toothPath(i) {
  const x = i * (toothWidth + gap);
  const w = toothWidth;
  const tipR = w / 2;
  const top = archHeight - 40;
  const bottom = archHeight + toothHeight;
  return `M${x},${top} h${w} V${bottom - tipR} a${tipR},${tipR} 0 0 1 -${tipR},${tipR} a${tipR},${tipR} 0 0 1 -${tipR},-${tipR} Z`;
}
</script>

<template>
  <svg
    class="comb"
    :class="`comb--${tone}`"
    :style="{ opacity }"
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="xMidYMin slice"
    aria-hidden="true"
    focusable="false"
  >
    <path
      :d="`M0,${archHeight} A${width / 2},${archHeight} 0 0 1 ${width},${archHeight}`"
      fill="none"
      class="comb__arch"
    />
    <path v-for="i in TEETH" :key="i" :d="toothPath(i - 1)" class="comb__tooth" />
  </svg>
</template>

<style scoped>
.comb {
  display: block;
  width: 100%;
  height: 100%;
}

.comb--light .comb__tooth,
.comb--light .comb__arch {
  fill: none;
  stroke: currentColor;
}

.comb--light .comb__tooth {
  fill: var(--white);
  fill-opacity: 0.07;
  stroke: var(--white);
  stroke-opacity: 0.5;
  stroke-width: 1.5;
}

.comb--light .comb__arch {
  stroke: var(--white);
  stroke-opacity: 0.5;
  stroke-width: 1.5;
}

.comb--navy .comb__tooth {
  fill: var(--navy);
  fill-opacity: 0.06;
  stroke: var(--navy);
  stroke-opacity: 0.45;
  stroke-width: 1.5;
}

.comb--navy .comb__arch {
  stroke: var(--navy);
  stroke-opacity: 0.45;
  stroke-width: 1.5;
}

.comb--solid .comb__tooth {
  fill: var(--white);
  fill-opacity: 1;
  stroke: none;
}
</style>
