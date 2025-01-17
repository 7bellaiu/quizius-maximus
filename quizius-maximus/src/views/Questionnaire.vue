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
    <main>
        <section class="row justify-content-center">
            <article class="p-3 mt-3 mb-3 form-wrapper">
                <h2 class="mb-3 text-center">Fragenkatalog</h2>
                <DisplayQuestionnaireForm v-if="displayQuestionnaire" />
                <EditQuestionnaireForm v-else-if="changeQuestionnaire" @success="handleSuccessEmit" @cancel="handleCancelEmit" />
                <CreateQuestionnaireForm v-else-if="createQuestionnaire" @success="handleSuccessEmit" @cancel="handleCancelEmit" />
                <!-- <div v-if="!changeUsername && !changePassword" class="d-flex justify-content-between mt-3">
                    <button @click="" class="btn btn-secondary">Passwort
                        ändern</button>
                    <button @click="" class="btn btn-primary" :disabled="changeUsername">Benutzername
                        ändern</button>
                </div>
                <Toast ref="toastRef" :message="toastMessage" :variant="toastVariant" /> -->
            </article>
        </section>
    </main>
</template>

<style scoped>
.form-wrapper {
    width: 100%;
    max-width: 800px;
}
</style>