<script setup lang="ts"></script>

<template>
    <div class="not-impl">
        <span class="not-impl__label">Not Implemented</span>
        <p class="not-impl__desc">
            Controls reference, keybindings, and operational guide for rover use.
        </p>
    </div>
</template>

<style lang="scss" scoped>
.not-impl {
    height: calc(100vh - var(--nav-bar-size));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;

    &__label {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 1.6rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--dark-white);
        opacity: 0.35;
    }

    &__desc {
        font-family: 'Overpass', sans-serif;
        font-size: 0.9rem;
        color: var(--dark-white);
        opacity: 0.25;
    }
}
</style>
