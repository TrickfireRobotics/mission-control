<!-- Rover connection and app configuration -->
<script setup lang="ts">
import ConnectionSettings from '@/components/settings/ConnectionSettings.vue';
</script>

<template>
    <div class="settings-page">
        <header class="settings-header">
            <h1>Settings</h1>
        </header>

        <section class="settings-card settings-card--connection">
            <ConnectionSettings />
        </section>
    </div>
</template>

<style lang="scss" scoped>
.settings-page {
    height: calc(100vh - var(--nav-bar-size));
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 0.85rem 1.25rem;
    gap: 0.75rem;
}

.settings-header {
    h1 {
        font-size: 1.5rem;
        color: var(--white);
    }
}

.settings-card {
    background-color: var(--component-background);
    border: 1px solid var(--light-grey);
    border-top: 2px solid var(--tf-green-mid);
    border-radius: 4px;
    padding: 1.25rem 1.5rem;

    &--connection {
        border-top-color: var(--tf-green);
        width: min(100%, 48rem);
        align-self: flex-start;
    }
}
</style>
