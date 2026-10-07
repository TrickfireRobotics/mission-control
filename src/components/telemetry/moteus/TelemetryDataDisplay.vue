<script lang="ts" setup>
export interface TelemetryDataDisplayProps {
    /** Human-readable label (e.g. "Velocity"). */
    itemName: string;
    /** Raw identifier key used for the checkbox callback. */
    itemIdentifier: string;
    isSelected: boolean;
    value: string;
    shouldRecordData: boolean;
    shouldShowCheckBox: boolean;
    showAllFeatures: boolean;
}

const props = defineProps<TelemetryDataDisplayProps>();
const emit = defineEmits(['checkboxClicked']);
</script>

<template>
    <div v-if="props.isSelected" class="data-item">
        <div class="data-label">
            <input
                v-if="props.showAllFeatures"
                v-show="props.shouldShowCheckBox"
                :checked="props.shouldRecordData"
                class="record-checkbox"
                type="checkbox"
                title="Include this value when recording to CSV"
                @click="emit('checkboxClicked', props.itemIdentifier)"
            />
            <span class="label-text">{{ props.itemName }}</span>
        </div>
        <span class="data-value" :class="{ 'data-value--na': props.value === 'N/A' }">
            {{ props.value }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
.data-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.3rem;
    padding: 0.25rem 0.4rem;
    background: var(--component-background);
    border-radius: 3px;
    border-left: 2px solid var(--light-grey);
    min-width: 0;
}

.data-label {
    display: flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
    flex-shrink: 1;
}

.label-text {
    font-size: 0.75rem;
    color: var(--dark-white);
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.record-checkbox {
    flex-shrink: 0;
    accent-color: var(--tf-green);
    width: 12px;
    height: 12px;
}

.data-value {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--tf-green);
    letter-spacing: 0.03em;
    white-space: nowrap;
    flex-shrink: 0;

    &--na {
        color: var(--dark-white);
        opacity: 0.35;
        font-weight: 400;
    }
}
</style>
