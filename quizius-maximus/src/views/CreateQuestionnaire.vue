<script setup>
import { reactive } from 'vue';
import { ref, computed } from 'vue';
import { firestoreDB } from '@/main';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

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

/* const saveQuestionnaire = () => {
  addDoc(collection(firestoreDB, 'module'), {
    shortname: shortname.value,
    longname: longname.value
    })
}; */

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
    } catch (error) {
        console.error('Fehler beim Speichern des Fragenkatalogs: ', error);
        alert('Fehler beim Speichern des Fragenkatalogs.');
    }
};

</script>

<template>
    <main>
        <!-- Kopfbereich -->
        <section class="py-4 text-center container">
            <div class="row py-lg-3">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <h1 class="fw-light">Fragenkatalog anlegen</h1>
                </div>
            </div>
        </section>
    </main>

    <div class="container mt-5 form-wrapper">
        <form @submit.prevent="saveQuestionnaire">
            <!-- Kopfdaten: Modul -->
            <fieldset class="mb-3">
                <legend>Modulkürzel und Modulname</legend>
                <div class="input-group">
                    <span class="input-group-text">Modulkürzel</span>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="shortname" v-model="shortname" maxlength="40"
                            placeholder="Trage hier das Modulkürzel ein" required>
                        <label for="shortname">(max. 40 Zeichen)</label>
                    </div>
                </div>
                <div class="input-group">
                    <span class="input-group-text">Modulkürzel</span>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="longname" v-model="longname" maxlength="120"
                            placeholder="Modulname" required>
                        <label for="longname" class="form-label">(max. 120 Zeichen)</label>
                    </div>
                </div>
            </fieldset>

            <!-- Bauchdaten: Fragen & Antworten -->
            <fieldset class="mb-2" v-for="(question, index) in form.questions" :key="index">
                <legend>{{ index + 1 }}. Frage</legend>
                <!-- #. Frage -->
                <div class="row">
                    <div class="input-group mb-1">
                        <span class="input-group-text">Frage</span>
                        <div class="form-floating">
                            <textarea class="form-control" :id="'question' + index" v-model="question.text"
                                placeholder="Quizfrage (max. 300 Zeichen)" maxlength="300" required></textarea>
                            <label :for="'question' + index" class="form-label">(max. 300 Zeichen)</label>
                        </div>
                        <span class="input-group-text">
                            <button type="button" class="btn btn-outline-danger" @click="removeQuestion(index)">
                                <!-- TODO: das Icon statt dem (-) verwenden? -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0">
                                    </path>
                                </svg>
                            </button>
                        </span>
                    </div>
                </div>
                <!-- Antwortoptionen -->
                <!-- TODO: Statt statisches Limit anzuzeigen dynamisch die Rest-Zeichen anzeigen? -->
                <div class="row">
                    <div class="input-group mb-1" v-for="(answer, aIndex) in question.answers" :key="aIndex">
                        <span class="input-group-text">Antwortmöglichkeit {{ aIndex + 1 }}</span>
                        <div class="form-floating">
                            <textarea class="form-control me-2" v-model="answer.text"
                                :id="'answertext' + index + aIndex" placeholder="Antwortmöglichkeit (max. 150 Zeichen)"
                                maxlength="150" required></textarea>
                            <label :for="'answertext' + index + aIndex" class="form-label">(max. 150 Zeichen)</label>
                        </div>
                        <div class="input-group-text">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" :name="'correctAnswer' + index"
                                    :id="'answercheck' + index + aIndex" v-model="question.correctAnswer"
                                    :value="aIndex" required>
                                <label class="form-check-label" :for="'answercheck' + index + aIndex">Antwort
                                    korrekt</label>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <div class="d-flex justify-content-between mt-3">
                <button type="button" @click="" class="btn btn-outline-warning m-1 p-2">
                    Abbrechen
                </button>
                <button type="submit" class="btn btn-primary w-50 m-1 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-floppy" viewBox="0 0 16 16">
                        <path d="M11 2H9v3h2z"></path>
                        <path
                            d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z">
                        </path>
                    </svg>
                    Fragenkatalog speichern
                </button>
                <button type="button" class="btn btn-success m-1 p-2" @click="addQuestion">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z">
                        </path>
                    </svg>
                    Frage hinzufügen
                </button>
            </div>
            <!-- Bauchdaten -->
            <!-- <div v-for="(question, index) in form.questions" :key="index" class="mb-3"> -->
            <!-- <label :for="'question' + index" class="form-label">{{ index + 1 }}. Frage</label> -->
            <!-- <textarea class="form-control" :id="'question' + index" v-model="question.text" -->
            <!-- placeholder="Quizfrage (max. 300 Zeichen)" maxlength="300" required></textarea> -->
            <!-- <div class="row mt-2"> -->
            <!-- <div v-for="(answer, aIndex) in question.answers" :key="aIndex" -->
            <!-- class="col-md-6 d-flex align-items-center mb-2"> -->
            <!-- <textarea class="form-control me-2" v-model="answer.text" -->
            <!-- placeholder="Antwortmöglichkeit (max. 150 Zeichen)" maxlength="150" required></textarea> -->
            <!-- <div class="form-check"> -->
            <!-- <input class="form-check-input" type="radio" :name="'correctAnswer' + index" -->
            <!-- :id="'answer' + index + aIndex" v-model="question.correctAnswer" :value="aIndex" -->
            <!-- required> -->
            <!-- <label class="form-check-label" :for="'answer' + index + aIndex">Antwort korrekt</label> -->
            <!-- </div> -->
            <!-- </div> -->
            <!-- </div> -->
            <!-- </div> -->
            <!-- <div> -->
            <!-- <button type="button" class="btn btn-danger mt-2" @click="removeQuestion(index)">Frage -->
            <!-- entfernen</button> -->
            <!-- <button type="button" class="btn btn-success mt-2" @click="addQuestion">Frage hinzufügen</button> -->
            <!-- </div> -->
            <!-- <button type="submit" class="btn btn-primary">Speichern</button> -->
        </form>
    </div>
</template>

<style scoped>
.form-wrapper {
    width: 100%;
    max-width: 800px;
}
</style>