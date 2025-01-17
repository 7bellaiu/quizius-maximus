<script setup>
import { ref, computed } from "vue";
import DisplayQuestionnaireForm from '@/components/questionnaires/DisplayQuestionnaireForm.vue'
import EditQuestionnaireForm from '@/components/questionnaires/EditQuestionnaireForm.vue'
import CreateQuestionnaireForm from '@/components/questionnaires/CreateQuestionnaireForm.vue'

const props = defineProps({
    action: {
        type: String,
        required: true
    },
    moduleid: {
        type: String,
        required: false
    }
})

const toastRef = ref(null);
const toastMessage = ref("");
const toastVariant = ref("");

const displayQuestionnaire = computed(() => props.action === 'display');
const changeQuestionnaire = computed(() => props.action === 'change');
const createQuestionnaire = computed(() => props.action === 'create');
</script>

<template>
    <main class="pt-4 row justify-content-center">
        <section class="p-3 mt-3 mb-3 form-wrapper">
            <DisplayQuestionnaireForm v-if="displayQuestionnaire" :moduleid="props.moduleid" />
            <EditQuestionnaireForm v-else-if="changeQuestionnaire" :moduleid="props.moduleid" />
            <CreateQuestionnaireForm v-else-if="createQuestionnaire" />
        </section>
    </main>
</template>

<style scoped>
/* TODO: form-wrapper stattdessen als generellen wrapper für die gesamte App verwenden? */
.form-wrapper {
    width: 100%;
    max-width: 800px;
}
</style>