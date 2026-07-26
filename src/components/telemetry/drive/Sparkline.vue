<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        values: number[];
        color?: string;
        height?: number;
        min?: number;
        max?: number;
    }>(),
    {
        color: 'var(--tf-green)',
        height: 28,
    },
);

const W = 120;

/** Normalise values → SVG polyline point string. Returns '' when < 2 samples. */
const polyPoints = computed(() => {
    const v = props.values;
    if (v.length < 2) return '';

    const min = props.min ?? Math.min(...v);
    const max = props.max ?? Math.max(...v);
    const range = max - min || 1; // avoid division by zero when all values identical

    const pad = 2; // vertical padding in px
    const drawH = props.height - pad * 2;

    return v
        .map((val, i) => {
            const x = (i / (v.length - 1)) * W;
            const normalized = Math.min(1, Math.max(0, (val - min) / range));
            const y = pad + drawH - normalized * drawH;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');
});
</script>

<template>
    <svg
        class="sparkline"
        :viewBox="`0 0 ${W} ${height}`"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <polyline
            v-if="polyPoints"
            :points="polyPoints"
            fill="none"
            :stroke="color"
            stroke-width="1.5"
            stroke-linejoin="round"
            stroke-linecap="round"
        />
    </svg>
</template>

<style scoped>
.sparkline {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
