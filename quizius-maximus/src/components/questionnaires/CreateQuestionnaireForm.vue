<script setup>
import { reactive } from 'vue';
import { firestoreDB } from '@/main';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import router from '@/router';
import TrashCanIcon from '@/components/icons/TrashCanIcon.vue'
import PlusIcon from '../icons/PlusIcon.vue';
import DiskIcon from '../icons/DiskIcon.vue';
import QuestionIcon from '../icons/QuestionIcon.vue';


const form = reactive({
    moduleShortname: '',
    moduleLongname: '',
    questions: [
        {
            text: '',
            answers: [
                { text: '' },
                { text: '' },
                { text: '' },
                { text: '' }
            ],
            correctAnswer: null
        }
    ]
});

const addQuestion = () => {
    form.questions.push({
        text: '',
        answers: [
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' }
        ],
        correctAnswer: null
    });
};

const removeQuestion = (index) => {
    form.questions.splice(index, 1);
};

const saveQuestionnaire = async () => {
    try {
        // 1. Überprüfung auf ein bereits existierendes Modul mit gleichen Modulkürzel
        if (!(await getDocs(query(collection(firestoreDB, 'module'), where('shortname', '==', shortname.value)))).empty) {
            alert('Dieses Modulkürzel existiert bereits. Bitte ein anderes Kürzel vergeben.');
            return;
        }

        // 2. Speichern in der Collection module
        const moduleDoc = await addDoc(collection(firestoreDB, 'module'), {
            shortname: shortname.value,
            longname: longname.value
        });

        // 3. Speichern in der Collection questionnaires
        const questionnaireDoc = await addDoc(collection(firestoreDB, 'questionnaires'), {
            moduleID: moduleDoc.id
        });

        // 4. Speichern der Fragen als Subcollection questions
        const questionDoc = form.questions.map((question, index) => {
            return addDoc(collection(questionnaireDoc, 'questions'), {
                question: question.text,
                option1: question.answers[0].text,
                option2: question.answers[1].text,
                option3: question.answers[2].text,
                option4: question.answers[3].text,
                correctAnswer: `option${question.correctAnswer + 1}`
            });
        });

        await Promise.all(questionDoc);
        alert('Fragenkatalog erfolgreich gespeichert!');
        router.push("/questionnaires");
    } catch (error) {
        console.error('Fehler beim Speichern des Fragenkatalogs: ', error);
        alert('Fehler beim Speichern des Fragenkatalogs.');
    }
};

const handleCancel = () => {
    router.push("/questionnaires");
}

// automatisch Höhe anhand des Inhalts anpassen
const resizeTextarea = (event) => {
    event.target.style.height = "auto"; // Höhe zurücksetzen
    event.target.style.height = event.target.scrollHeight + "px";
}
</script>

<template>
    <main>
        <section class="row justify-content-center">
            <article class="p-3 mt-3 mb-3 form-wrapper">
                <h2 class="text-center">Neuer Fragenkatalog</h2>
            </article>
        </section>
        <!-- Kopfbereich: Modul -->
        <form class="m-2" @submit.prevent="saveQuestionnaire">
            <!-- Kopfdaten: Modul -->
            <fieldset class="card border-info mb-5">
                <legend class="card-header bg-info bg-opacity-50 border-info"><strong>Modul</strong></legend>
                <div class="card-body">
                    <div class="input-group input-group-sm mb-1">
                        <span class="input-group-text bg-info bg-opacity-25">Kürzel</span>
                        <div class="form-floating">
                            <input type="text" class="form-control" id="shortname" v-model="shortname" maxlength="40"
                                placeholder="Trage hier das Modulkürzel ein" required>
                            <label for="shortname">(max. 40 Zeichen)</label>
                        </div>
                    </div>
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-info bg-opacity-25">Name</span>
                        <div class="form-floating">
                            <input type="text" class="form-control" id="longname" v-model="longname" maxlength="120"
                                placeholder="Modulname" required>
                            <label for="longname" class="form-label">(max. 120 Zeichen)</label>
                        </div>
                    </div>
                </div>
            </fieldset>

            <!-- Bauchdaten: Fragen & Antworten -->
            <fieldset class="card border-info mb-3" v-for="(question, index) in form.questions" :key="index">
                <legend class="card-header bg-info bg-opacity-50 border-info">
                    <strong>{{ index + 1 }}. Frage</strong>
                </legend>
                <!-- #. Frage -->
                <div class="row card-body">
                    <legend><small>Fragestellung</small></legend>
                    <div class="input-group input-group-sm mb-1">
                        <div class="input-group-text">
                            <QuestionIcon />
                        </div>
                        <div class="form-floating">
                            <textarea class="form-control" :id="'question' + index" v-model="question.text"
                                placeholder="Quizfrage (max. 300 Zeichen)" maxlength="300" required
                                @input="resizeTextarea"></textarea>
                            <label :for="'question' + index" class="form-label">(max. 300 Zeichen)</label>
                        </div>
                    </div>
                </div>
                <!-- Antwortoptionen -->
                <!-- TODO: Statt statisches Limit anzuzeigen dynamisch die Rest-Zeichen anzeigen? -->
                <fieldset class="row card-body">
                    <legend><small>Antwortmöglichkeiten</small></legend>
                    <div class="input-group input-group-sm mb-1" v-for="(answer, aIndex) in question.answers"
                        :key="aIndex">
                        <div class="input-group-text">
                            {{ aIndex + 1 }}
                        </div>
                        <div class="form-floating">
                            <textarea class="form-control me-2" v-model="answer.text"
                                :id="'answertext' + index + aIndex" placeholder="Antwortmöglichkeit (max. 150 Zeichen)"
                                maxlength="150" required @input="resizeTextarea"></textarea>
                            <label :for="'answertext' + index + aIndex" class="form-label">(max. 150
                                Zeichen)</label>
                        </div>
                        <div class="input-group-text">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" :name="'correctAnswer' + index"
                                    :id="'answercheck' + index + aIndex" v-model="question.correctAnswer"
                                    :value="aIndex" required>
                                <label class="form-check-label" :for="'answercheck' + index + aIndex">
                                    korrekt
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div class="card-footer bg-info bg-opacity-25">
                    <button type="button" class="btn btn-danger w-100" @click="removeQuestion(index)">
                        <TrashCanIcon /> Frage löschen
                    </button>
                </div>
            </fieldset>

            <!-- Steuerung -->
            <div class="row align-items-center">
                <div class="col-12 d-flex justify-content-between">
                    <button type="button" @click="handleCancel" class="btn btn-warning w-100 m-1">
                        Abbrechen
                    </button>
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
    </main>
</template>

<style scoped>
.form-wrapper {
    width: 100%;
    max-width: 700px;
}
</style>