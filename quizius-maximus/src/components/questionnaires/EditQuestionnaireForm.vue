<script setup>
import { reactive, onMounted } from 'vue';
import { firestoreDB } from '@/main';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import QuestionIcon from '@/components/icons/QuestionIcon.vue';
import TrashCanIcon from '@/components/icons/TrashCanIcon.vue';
import PencilIcon from '@/components/icons/PencilIcon.vue';
import PlusIcon from '../icons/PlusIcon.vue';
import DiskIcon from '../icons/DiskIcon.vue';
import router from '@/router';
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

const addQuestion = () => {
    form.questions.push({
        section: '',
        text: '',
        answers: [
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' }
        ],
        correctAnswer: null,
        explanation: ''
    });
};

const removeQuestion = (index) => {
    form.questions.splice(index, 1);
};

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
                    section: questionDoc.data().section,
                    text: questionDoc.data().question,
                    answers: [
                        { text: questionDoc.data().option1 },
                        { text: questionDoc.data().option2 },
                        { text: questionDoc.data().option3 },
                        { text: questionDoc.data().option4 }
                    ],
                    correctAnswer: parseInt(questionDoc.data().correctAnswer.replace('option', '')) - 1,
                    explanation: questionDoc.data().explanation || ''
                });
            }
        }
    } catch (error) {
        console.error('Fehler beim Laden der Daten: ', error);
    }
};

const saveQuestionnaire = async () => {
    try {
        // Überprüfung, ob mindestens 20 Fragen vorhanden sind
        if (form.questions.length < 20) {
            alert('Es müssen mindestens 20 Fragen gepflegt werden.');
            return;
        }

        // Aktualisiere Modul-Daten
        await updateDoc(doc(firestoreDB, 'module', props.moduleid), {
            shortname: form.shortname,
            longname: form.longname
        });

        // Abfrage der bestehenden Fragebögen in der Collection 'questionnaires'
        const questionnairesQuery = query(collection(firestoreDB, 'questionnaires'), where('moduleID', '==', props.moduleid));
        const questionnairesDoc = await getDocs(questionnairesQuery);

        // Lösche bestehende Fragen
        for (const questionnaireDoc of questionnairesDoc.docs) {
            const questionsDoc = await getDocs(collection(questionnaireDoc.ref, 'questions'));
            for (const questionDoc of questionsDoc.docs) {
                await deleteDoc(questionDoc.ref);
            }
            await deleteDoc(questionnaireDoc.ref);
        }

        // Speichere neuen Fragebogen
        const questionnaireDocRef = await addDoc(collection(firestoreDB, 'questionnaires'), {
            moduleID: props.moduleid
        });

        // Speichere neue Fragen
        const questionChanges = form.questions.map((question) => {
            return addDoc(collection(questionnaireDocRef, 'questions'), {
                section: question.section,
                question: question.text,
                option1: question.answers[0].text,
                option2: question.answers[1].text,
                option3: question.answers[2].text,
                option4: question.answers[3].text,
                correctAnswer: `option${question.correctAnswer + 1}`,
                explanation: question.explanation
            });
        });

        await Promise.all(questionChanges);
        alert('Fragenkatalog erfolgreich gespeichert!');
        router.push("/questionnaires");
    } catch (error) {
        console.error('Fehler beim Speichern des Fragenkatalogs: ', error);
        alert('Fehler beim Speichern des Fragenkatalogs.');
    }
};

onMounted(() => {
    loadModuleData();
});

// automatisch Höhe anhand des Inhalts anpassen
const resizeTextarea = (event) => {
    event.target.style.height = "auto"; // Höhe zurücksetzen
    event.target.style.height = event.target.scrollHeight + "px";
};

// Validierungsfunktion für Lektion
const validateSection = (event) => {
    const value = event.target.value;
    if (value < 1 || value > 99) {
        event.target.setCustomValidity("Bitte eine Zahl zwischen 1 und 99 eingeben.");
    } else {
        event.target.setCustomValidity("");
    }
};
</script>

<template>
    <h2 class="text-center mb-3">Fragenkatalog bearbeiten</h2>
    <form class="m-2" @submit.prevent="saveQuestionnaire">
        <!-- Kopfdaten: Modul -->
        <fieldset class="card border-info mb-5">
            <legend class="card-header bg-info bg-opacity-50 border-info">
                <h5>Modul</h5>
            </legend>
            <div class="card-body">
                <div class="input-group input-group-sm mb-1">
                    <span class="input-group-text bg-info bg-opacity-25">Kürzel</span>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="shortname" v-model="form.shortname" maxlength="40"
                            placeholder="Trage hier das Modulkürzel ein" required>
                        <label for="shortname">(max. 40 Zeichen)</label>
                    </div>
                </div>
                <div class="input-group input-group-sm">
                    <span class="input-group-text bg-info bg-opacity-25">Name</span>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="longname" v-model="form.longname" maxlength="120"
                            placeholder="Modulname" required>
                        <label for="longname" class="form-label">(max. 120 Zeichen)</label>
                    </div>
                </div>
            </div>
        </fieldset>

        <!-- Bauchdaten: Fragen & Antworten -->
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
                            required maxlength="2" pattern="^[1-9][0-9]?$" placeholder="(max. 2 Ziffern)" @input="validateSection">
                        <label :for="'section' + index" class="form-label">(max. 2 Ziffern)</label>
                    </div>
                </div>
            </div>
            <!-- #. Frage -->
            <div class="row card-body">
                <legend><small>Fragestellung</small></legend>
                <div class="input-group input-group-sm mb-1">
                    <div class="input-group-text">
                        <QuestionIcon />
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" :id="'question' + index" v-model="question.text"
                            placeholder="Quizfrage (max. 512 Zeichen)" maxlength="512" required
                            @input="resizeTextarea"></textarea>
                        <label :for="'question' + index" class="form-label">(max. 512 Zeichen)</label>
                    </div>
                </div>
            </div>
            <!-- Antwortoptionen -->
            <fieldset class="row card-body">
                <legend><small>Antwortmöglichkeiten</small></legend>
                <div class="input-group input-group-sm mb-1" v-for="(answer, aIndex) in question.answers" :key="aIndex">
                    <div class="input-group-text">
                        {{ aIndex + 1 }}
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control me-2" v-model="answer.text" :id="'answertext' + index + aIndex"
                            placeholder="Antwortmöglichkeit (max. 512 Zeichen)" maxlength="512" required
                            @input="resizeTextarea"></textarea>
                        <label :for="'answertext' + index + aIndex" class="form-label">(max. 512 Zeichen)</label>
                    </div>
                    <div class="input-group-text">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" :name="'correctAnswer' + index"
                                :id="'answercheck' + index + aIndex" v-model="question.correctAnswer" :value="aIndex"
                                required>
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
                            placeholder="Erklärung (max. 512 Zeichen)" maxlength="512" required
                            @input="resizeTextarea"></textarea>
                        <label :for="'explanation' + index" class="form-label">(max. 512 Zeichen)</label>
                    </div>
                </div>
            </div>
            <div class="card-footer bg-info bg-opacity-25">
                <button type="button" class="btn btn-danger w-100" @click="removeQuestion(index)">
                    <TrashCanIcon /> Frage
                </button>
            </div>
        </fieldset>

        <!-- Steuerung -->
        <div class="row align-items-center">
            <div class="col-12 d-flex justify-content-between">
                <router-link class="btn btn-warning w-100 m-1" to="/questionnaires">
                    Abbrechen
                </router-link>
                <button type="button" class="btn btn-success w-100 m-1" @click="addQuestion">
                    <PlusIcon /> Frage
                </button>
            </div>
            <div class="col-12 d-flex">
                <button type="submit" class="btn btn-primary w-100 m-1">
                    <DiskIcon /> Katalog
                </button>
            </div>
        </div>
    </form>
</template>