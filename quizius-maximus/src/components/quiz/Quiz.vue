<script setup>
import AnswerOptions from '@/components/quiz/AnswerOptions.vue';
import Progress from '@/components/quiz/Progress.vue';
import Question from '@/components/quiz/Question.vue';
import { ref, computed } from 'vue';

// Zustand für Fragen und Optionen

// TODO: Werte dynamisieren
const props = defineProps(["questions", "currentQuestion", "totalQuestions", "gameMode"]);

// const currentQuestion = ref(1);
// const totalQuestions = 5;
// const questionText = ref('Was ist 2 + 2?');
// const answerOptions = ref([
//     { text: '3', correct: false, selected: false },
//     { text: '4', correct: true, selected: false },
//     { text: '5', correct: false, selected: false },
//     { text: '6', correct: false, selected: false }
// ]);

// Handhabung der Antwortwahl
// const handleAnswerSelected = (index) => {
//     const selectedOption = answerOptions.value[index];
//     // TODO: Verarbeitungslogik, um zu prüfen, ob die Antwort korrekt ist.
// };

// Nächste Frage laden
// const nextQuestion = () => {
//     currentQuestion.value += 1;
//     // TODO: Logik zum Laden der nächsten Frage
//     if (currentQuestion.value > totalQuestions) {
//         currentQuestion.value = 1; // Reset bei Ende
//     }
// };
</script>

<template>
    <section>
        <!-- Fortschritt -->
        <Progress :currentQuestion="props.currentQuestion" :totalQuestions="props.totalQuestions" :game-mode="props.gameMode" />

        <!-- Frage -->
        <!-- <Question :questionText="'PLACEHOLDER'" /> -->

        <!-- Antwortoptionen -->
        <!-- <AnswerOptions :options="['O1', 'O2', 'O3', 'O4']" @answerSelected="handleAnswerSelected" /> -->

        <!-- Button: "Nächste Frage" -->
        <!-- <div class="row row-cols-1 mx-2 mt-2">
            <div class="col w-100 d-flex justify-content-end">
                <button class="btn btn-secondary" @click="nextQuestion">Nächste Frage</button>
            </div>
        </div> -->
    </section>
</template>
