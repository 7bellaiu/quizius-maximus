<script setup>
import { ref, watch } from 'vue';
import AnswerOptionButton from './AnswerOptionButton.vue';

// Input von Parent
const props = defineProps(['question']);
const emits = defineEmits(['selected']);

// Component State
const isSelected1 = ref(false);
const isSelected2 = ref(false);
const isSelected3 = ref(false);
const isSelected4 = ref(false);

// Interaktion
const handleSelected = (optionId, isCorrect) => {
    switch (optionId) {
        case 1: isSelected1.value = true; break;
        case 2: isSelected2.value = true; break;
        case 3: isSelected3.value = true; break;
        case 4: isSelected4.value = true; break;
        default: console.error("Ungültige Auswahl!", optionId); break;
    }
    emits('selected', isCorrect);
}

//State zurücksetzen, wenn neue Optionen übergeben werden
watch(() => props.question, () => {
    isSelected1.value = false;
    isSelected2.value = false;
    isSelected3.value = false;
    isSelected4.value = false;
});
</script>

<template>
    <div class="row row-cols-2 mx-2 mt-2">
        <!-- Option 1 -->
        <AnswerOptionButton :optionText="props.question.option1" :option-id="1" @selected="handleSelected"
            :display="isSelected1 || isSelected2 || isSelected3 || isSelected4"
            :is-correct="props.question.correctAnswer == 'option1'" />
        <!-- Option 2 -->
        <AnswerOptionButton :optionText="props.question.option2" :option-id="2" @selected="handleSelected"
            :display="isSelected1 || isSelected2 || isSelected3 || isSelected4"
            :is-correct="props.question.correctAnswer == 'option2'" />
        <AnswerOptionButton :optionText="props.question.option3" :option-id="3" @selected="handleSelected"
            :display="isSelected1 || isSelected2 || isSelected3 || isSelected4"
            :is-correct="props.question.correctAnswer == 'option3'" />
        <AnswerOptionButton :optionText="props.question.option4" :option-id="4" @selected="handleSelected"
            :display="isSelected1 || isSelected2 || isSelected3 || isSelected4"
            :is-correct="props.question.correctAnswer == 'option4'" />
    </div>
</template>