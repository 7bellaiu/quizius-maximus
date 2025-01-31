<script setup>
import AnswerOptions from '@/components/quiz/AnswerOptions.vue';
import Progress from '@/components/quiz/Progress.vue';
import Question from '@/components/quiz/Question.vue';
import { computed, onMounted, ref } from 'vue';

// const props = defineProps(["questions", "currentQuestion", "totalQuestions", "gameMode"]);
const props = defineProps(["questions", "gameModeLongtext"]);
const emits = defineEmits(["finished"]);

// Quiz state
const playerScore = ref(0);
const currentQuestionIndex = ref(0);
const hasNextQuestion = ref(true);
const isCurrentQuestionAnswered = ref(false);
const isLastQuestionAnswered = ref(false);

// Quiz interaction
const handleNextQuestion = () => {
    currentQuestionIndex.value++;
    isCurrentQuestionAnswered.value = false;

    if (currentQuestionIndex.value == props.questions?.length - 1) {
        hasNextQuestion.value = false;
    }
}
const handleSelected = (isCorrect) => {
    if (isCorrect) {
        playerScore.value++;
    }

    if (!hasNextQuestion.value) {
        isLastQuestionAnswered.value = true;
    } else {
        isCurrentQuestionAnswered.value = true;
    }
}
</script>

<template>
    <section>
        <!-- Fortschritt -->
        <Progress :currentQuestion="currentQuestionIndex" :totalQuestions="props.questions?.length"
            :game-mode="props.gameModeLongtext" />

        <!-- Frage -->
        <Question v-if="props.questions[currentQuestionIndex]?.question"
            :questionText="props.questions[currentQuestionIndex].question" />

        <!-- Antwortoptionen -->
        <AnswerOptions v-if="props.questions[currentQuestionIndex]" :question="props.questions[currentQuestionIndex]"
            @selected="handleSelected" />

        <!-- Button -->
        <div class="row mx-2 mt-2">
            <div class="col d-flex justify-content-end">
                <button class="btn btn-outline-secondary my-1 w-25" v-if="hasNextQuestion && isCurrentQuestionAnswered"
                    @click="handleNextQuestion">Nächste
                    Frage</button>
                <button class="btn btn-outline-warning my-1 w-25" v-if="isLastQuestionAnswered">Quiz
                    beenden</button>
            </div>
        </div>
        <!-- Score -->
        <div v-if="isLastQuestionAnswered">{{ playerScore }}</div>
    </section>
</template>