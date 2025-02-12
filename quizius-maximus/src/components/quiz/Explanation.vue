<script setup>
const props = defineProps({
    explanationText: {
        type: String,
        required: true
    },
    isCorrectAnswer: {
        type: Boolean,
        required: true
    }
});
</script>

<template>
    <div class="row row-cols-1 mx-2 mt-2">
        <div class="col">
            <div class="accordion w-100" id="explanationAccordion">
                <div class="accordion-item mb-2">
                    <h2 class="accordion-header">
                        <button type="button" class="accordion-button collapsed bg-opacity-50"
                            :class="{ 'bg-danger': !isCorrectAnswer, 'bg-success': isCorrectAnswer }"
                            data-bs-toggle="collapse" data-bs-target="#collapseExplanationText">
                            <strong>
                                Erklärung anzeigen
                            </strong>
                        </button>
                    </h2>
                    <div id="collapseExplanationText" class="accordion-collapse collapse bg-opacity-25"
                        :class="{ 'bg-danger': !isCorrectAnswer, 'bg-success': isCorrectAnswer }">
                        <div class="accordion-body">
                            {{ explanationText }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>