<script setup>
import AnswerOptions from '@/components/quiz/AnswerOptions.vue';
import Progress from '@/components/quiz/Progress.vue';
import Question from '@/components/quiz/Question.vue';
import { ref, computed } from 'vue';

const props = defineProps(["questions", "currentQuestion", "totalQuestions", "gameMode"]);

const questionText = computed(() => props.questions[props.currentQuestion]?.question || "Keine Frage gefunden");
const answerOptions = computed(() => {
    const q = props.questions[props.currentQuestion];
    const options = [
        { text: q?.option1, selected: false, correct: q?.correctAnswer === 'option1' },
        { text: q?.option2, selected: false, correct: q?.correctAnswer === 'option2' },
        { text: q?.option3, selected: false, correct: q?.correctAnswer === 'option3' },
        { text: q?.option4, selected: false, correct: q?.correctAnswer === 'option4' }
    ];
    return options;
});

// Handhabung der Antwortwahl
const handleAnswerSelected = (index) => {
    const selectedOption = answerOptions.value[index];
    // TODO: Verarbeitungslogik, um zu prüfen, ob die Antwort korrekt ist.
};
</script>

<template>
    <section>
        <!-- Fortschritt -->
        <Progress :currentQuestion="props.currentQuestion" :totalQuestions="props.totalQuestions"
            :game-mode="props.gameMode" />

        <!-- Frage -->
        <Question v-if="questionText" :questionText="questionText" />

        <!-- Antwortoptionen -->
        <AnswerOptions v-if="answerOptions.length > 0" :options="answerOptions" />
    </section>
</template>
