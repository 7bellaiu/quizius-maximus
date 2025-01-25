<script setup>
const emits = defineEmits(['answerSelected']);
const props = defineProps({
    options: {
        type: Array,
        required: true
    },
    display: {
        type: Boolean,
        required: true
    }
});

const selectAnswer = (index) => {
    // Option markieren
    const selectedOption = props.options[index];
    props.options.forEach(option => option.selected = false); // Reset alle Optionen
    selectedOption.selected = true;

    // Emit der gewählten Antwort
    emits('answerSelected', index);
};
</script>

<template>
    <div class="row row-cols-2 mx-2 mt-2">
        <div v-for="(option, index) in options" :key="index" class="col">
            <!-- Nicht-klickbar nach Spieler-Auswahl -->
            <div v-if="props.display" class="btn p-0 my-1 w-100" :class="{
                'btn-outline-primary': !option.selected,
                'btn-outline-success': option.correct && option.selected,
                'btn-outline-danger': !option.correct && option.selected
            }">
                <div class="card" :class="{
                    'border-primary': !option.selected,
                    'border-success text-success': option.correct && option.selected,
                    'bg-danger text-white': !option.correct && option.selected
                }">
                    <div class="card-body">
                        <p class="card-text">{{ option.text }}</p>
                    </div>
                </div>
            </div>

            <!-- klickbar vor Spieler-Auswahl -->
            <button v-else type="button" class="btn p-0 my-1 w-100" :class="{
                'btn-outline-primary': !option.selected,
                'btn-outline-success': option.correct && option.selected,
                'btn-outline-danger': !option.correct && option.selected
            }" @click="selectAnswer(index)">
                <div class="card" :class="{
                    'border-primary': !option.selected,
                    'border-success text-success': option.correct && option.selected,
                    'bg-danger text-white': !option.correct && option.selected
                }">
                    <div class="card-body">
                        <p class="card-text">{{ option.text }}</p>
                    </div>
                </div>
            </button>
        </div>
    </div>
</template>