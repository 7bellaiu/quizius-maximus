<!-- TODO: Toast so reworken, dass text und farbe hier geregelt, Dauer und ein-/ausblenden in jeweiliger View/component regeln -->
<script setup>
import { ref } from 'vue';

// Props definieren
const props = defineProps({
    message: {
        type: String,
        required: true
    },
    variant: {
        type: String,
        default: "warning"
    }
});

// Reaktiver Zustand für die Sichtbarkeit
const isVisible = ref(false);

// Methode zum Triggern des Toast
const showToast = () => {
    isVisible.value = true;
    setTimeout(() => {
        isVisible.value = false;
    }, 3000); // Toast wird nach 3 Sekunden unsichtbar
};

// Methode mit defineExpose zugänglich machen
defineExpose({ showToast });
</script>

<template>
    <div v-if="isVisible" :class="[
        'toast',
        'align-items-center',
        `border-${props.variant}`,
        `text-${props.variant}`,
        'mt-3',
        'show',
        'w-100'
    ]" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                {{ props.message }}
            </div>
        </div>
    </div>
</template>
