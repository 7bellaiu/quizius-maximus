<script setup>
import { reactive, onMounted } from 'vue';
import { firestoreDB } from '@/main';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import router from '@/router';
import QuestionIcon from '@/components/icons/QuestionIcon.vue';
import TrashCanIcon from '@/components/icons/TrashCanIcon.vue';
import PencilIcon from '@/components/icons/PencilIcon.vue';
import ExclamationIcon from '../icons/ExclamationIcon.vue';

const props = defineProps({
    moduleid: {
        type: String,
        required: true
    }
});

const form = reactive({
    shortname: '',
    longname: '',
    questions: []
});

const loadModuleData = async () => {
    try {
        // Lade Modul-Daten
        const moduleDoc = await getDoc(doc(firestoreDB, 'module', props.moduleid));
        if (moduleDoc.exists()) {
            form.shortname = moduleDoc.data().shortname;
            form.longname = moduleDoc.data().longname;
        }

        // Lade Fragen-Daten
        const questionnairesQuery = query(collection(firestoreDB, 'questionnaires'), where('moduleID', '==', props.moduleid));
        const questionnairesDoc = await getDocs(questionnairesQuery);

        form.questions = [];
        for (const questionnaireDoc of questionnairesDoc.docs) {
            const questionsDoc = await getDocs(collection(questionnaireDoc.ref, 'questions'));
            for (const questionDoc of questionsDoc.docs) {
                form.questions.push({
                    text: questionDoc.data().question,
                    answers: [
                        { text: questionDoc.data().option1 },
                        { text: questionDoc.data().option2 },
                        { text: questionDoc.data().option3 },
                        { text: questionDoc.data().option4 }
                    ],
                    correctAnswer: parseInt(questionDoc.data().correctAnswer.replace('option', '')) - 1,
                    explanation: questionDoc.data().explanation || '',
                    section: questionDoc.data().section
                });
            }
        }
    } catch (error) {
        console.error('Fehler beim Laden der Daten: ', error);
    }
};

onMounted(() => {
    loadModuleData();
});
</script>

<template>
    <h2 class="text-center mb-3">Fragenkatalog anzeigen</h2>
    <form class="m-2" @submit.prevent="">

        <!-- Kopfdaten: Modul -->
        <fieldset class="card border-info mb-5">
            <legend class="card-header bg-info bg-opacity-50 border-info">
                <h5>Modul</h5>
            </legend>
            <div class="card-body">
                <div class="input-group input-group mb-1">
                    <span class="input-group-text bg-info bg-opacity-25">Kürzel</span>
                    <input type="text" class="form-control" id="shortname" v-model="form.shortname" maxlength="40"
                        placeholder="Trage hier das Modulkürzel ein" disabled>
                </div>
                <div class="input-group input-group">
                    <span class="input-group-text bg-info bg-opacity-25">Name</span>
                    <input type="text" class="form-control" id="longname" v-model="form.longname" maxlength="120"
                        placeholder="Modulname" disabled>
                </div>
            </div>
        </fieldset>

        <!-- Bauchdaten -->
        <fieldset class="card border-info mb-3" v-for="(question, index) in form.questions" :key="index">
            <legend class="card-header bg-info bg-opacity-50 border-info">
                <h5>{{ index + 1 }}. Frage</h5>
            </legend>
            <!-- Lektion -->
            <div class="row col-md-4 card-body">
                <div class="input-group input-group-sm mb-1">
                    <span class="input-group-text bg-info bg-opacity-25">Lektion</span>
                    <div class="form-floating col-2">
                        <input type="text" class="form-control" :id="'section' + index" v-model="question.section"
                            min="0" max="99" required maxlength="2" pattern="\d{1,2}" placeholder="max. 2 Ziffern">
                        <label :for="'section' + index" class="form-label">(max. 2 Ziffern)</label>
                    </div>
                </div>
            </div>
            <!-- #. Frage -->
            <div class="row card-body">
                <legend><small>Fragestellung</small></legend>
                <div class="input-group mb-1">
                    <div class="input-group-text">
                        <QuestionIcon />
                    </div>
                    <textarea class="form-control" :id="'question' + index" v-model="question.text"
                        placeholder="Quizfrage (max. 512 Zeichen)" maxlength="512" disabled></textarea>
                </div>
            </div>
            <!-- Antwortoptionen -->
            <fieldset class="row card-body">
                <legend><small>Antwortmöglichkeiten</small></legend>
                <div class="input-group input-group mb-1" v-for="(answer, aIndex) in question.answers" :key="aIndex">
                    <div class="input-group-text">
                        {{ aIndex + 1 }}
                    </div>
                    <textarea class="form-control me-2" v-model="answer.text" :id="'answertext' + index + aIndex"
                        maxlength="512" disabled></textarea>
                    <div class="input-group-text">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" :name="'correctAnswer' + index"
                                :id="'answercheck' + index + aIndex" v-model="question.correctAnswer" :value="aIndex"
                                disabled>
                            <label class="form-check-label" :for="'answercheck' + index + aIndex">
                                korrekt
                            </label>
                        </div>
                    </div>
                </div>
            </fieldset>
            <!-- Erklärung -->
            <div class="row card-body">
                <legend><small>Erklärung</small></legend>
                <div class="input-group input-group-sm mb-1">
                    <div class="input-group-text">
                        <ExclamationIcon />
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" :id="'explanation' + index" v-model="question.explanation"
                            placeholder="Erklärung (max. 512 Zeichen)" maxlength="512" disabled></textarea>
                        <label :for="'explanation' + index" class="form-label">(max. 512 Zeichen)</label>
                    </div>
                </div>
            </div>
        </fieldset>

        <!-- Steuerung -->
        <div class="row align-items-center">
            <div class="col-12 d-flex justify-content-between">
                <router-link class="btn btn-outline-primary w-100 m-1" to="/questionnaires">
                    Zurück
                </router-link>
                <router-link class="btn btn-sm btn-warning w-100 m-1"
                    :to="{ name: 'questionnaire', params: { action: 'change', moduleid: props.moduleid } }"
                    title="Fragenkatalog bearbeiten">
                    <PencilIcon /> Katalog bearbeiten
                </router-link>
            </div>
        </div>
    </form>
</template>