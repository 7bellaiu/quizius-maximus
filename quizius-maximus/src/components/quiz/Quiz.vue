<script setup>
import AnswerOptions from '@/components/quiz/AnswerOptions.vue';
import Progress from '@/components/quiz/Progress.vue';
import Question from '@/components/quiz/Question.vue';
import { ref } from 'vue';
import Explanation from './Explanation.vue';

// const props = defineProps(["questions", "currentQuestion", "totalQuestions", "gameMode"]);
const props = defineProps(["questions", "gameModeLongtext", "isExplanationDisplayed"]);
const emits = defineEmits(["finished"]);

// Quiz state
const playerScore = ref(0);
const currentQuestionIndex = ref(0);
const hasNextQuestion = ref(true);
const isCurrentQuestionAnswered = ref(false);
const isLastQuestionAnswered = ref(false);
const displayExplanation = ref(false);
const isExplanationGreen = ref(false);
const DEMO_TEXT_EXPLANATION = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore explicabo rerum sed obcaecati iste quo nihil, alias exercitationem in suscipit?";

// Quiz interaction
const handleNextQuestion = () => {
    displayExplanation.value = false;
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

    isExplanationGreen.value = isCorrect;
    displayExplanation.value = true;

    if (!hasNextQuestion.value) {
        isLastQuestionAnswered.value = true;
    } else {
        isCurrentQuestionAnswered.value = true;
    }
}
const handleFinished = () => {
    emits("finished", playerScore.value);
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

        <!-- Erklaerung -->
        <Explanation v-if="isExplanationDisplayed && displayExplanation" :explanation-text="DEMO_TEXT_EXPLANATION"
            :is-correct-answer="isExplanationGreen" />

        <!-- Button -->
        <div class="row mx-2 mt-2">
            <div class="col d-flex justify-content-end">
                <button class="btn btn-outline-secondary my-1 w-25" v-if="hasNextQuestion && isCurrentQuestionAnswered"
                    @click="handleNextQuestion">Nächste
                    Frage</button>
                <button class="btn btn-outline-warning my-1 w-25" v-if="isLastQuestionAnswered"
                    @click="handleFinished">Quiz
                    beenden</button>
            </div>
        </div>
    </section>
</template>