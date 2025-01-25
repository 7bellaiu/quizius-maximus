<script setup>
import AnswerOptions from '@/components/quiz/AnswerOptions.vue';
import Progress from '@/components/quiz/Progress.vue';
import Question from '@/components/quiz/Question.vue';
import { computed, ref } from 'vue';

const props = defineProps(["questions", "currentQuestion", "totalQuestions", "gameMode"]);
const isAnswered = ref(false); // Flag, um zu wissen, ob der Spieler bereits geantwortet hat 
const isAnswerCorrect = ref(false);

const questionText = computed(() => props.questions[props.currentQuestion]?.question || "Keine Frage gefunden");
const answerOptionsPreClick = computed(() => {
    const q = props.questions[props.currentQuestion];
    const options = [
        { text: q?.option1, selected: false, correct: q?.correctAnswer === 'option1' },
        { text: q?.option2, selected: false, correct: q?.correctAnswer === 'option2' },
        { text: q?.option3, selected: false, correct: q?.correctAnswer === 'option3' },
        { text: q?.option4, selected: false, correct: q?.correctAnswer === 'option4' }
    ];
    return options;
});

const answerOptionsPostClick = ref([]);

const handleAnswer = (index) => {
    const q = props.questions[props.currentQuestion];
    answerOptionsPostClick.value = [
        { text: q?.option1, selected: index == 0, correct: q?.correctAnswer === 'option1' },
        { text: q?.option2, selected: index == 1, correct: q?.correctAnswer === 'option2' },
        { text: q?.option3, selected: index == 2, correct: q?.correctAnswer === 'option3' },
        { text: q?.option4, selected: index == 3, correct: q?.correctAnswer === 'option4' }
    ];

    isAnswered.value = true;
}
</script>

<template>
    <section>
        <!-- Fortschritt -->
        <Progress :currentQuestion="props.currentQuestion" :totalQuestions="props.totalQuestions"
            :game-mode="props.gameMode" />

        <!-- Frage -->
        <Question v-if="questionText" :questionText="questionText" />

        <!-- Antwortoptionen -->
        <AnswerOptions v-if="answerOptionsPreClick.length > 0 && !isAnswered" :options="answerOptionsPreClick"
            :display="false" @answer-selected="handleAnswer" />
        <AnswerOptions v-else-if="answerOptionsPostClick.length > 0 && isAnswered" :options="answerOptionsPostClick"
            :display="true" />
    </section>
</template>