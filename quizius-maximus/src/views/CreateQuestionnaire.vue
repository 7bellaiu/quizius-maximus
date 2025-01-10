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

    <div class="container mt-5">
        <form @submit.prevent="saveQuestionnaire">
            <!-- Kopfdaten -->
            <div class="mb-3">
                <label for="shortname" class="form-label">Modulkürzel</label>
                <input type="text" class="form-control" id="shortname" v-model="shortname" maxlength="120"
                    placeholder="Modulkürzel" required>
            </div>
            <div class="mb-3">
                <label for="longname" class="form-label">Modulname</label>
                <input type="text" class="form-control" id="longname" v-model="longname" maxlength="120"
                    placeholder="Modulname" required>
            </div>

            <!-- Bauchdaten -->
            <div v-for="(question, index) in form.questions" :key="index" class="mb-3">
                <label :for="'question' + index" class="form-label">{{ index + 1 }}. Frage</label>
                <textarea class="form-control" :id="'question' + index" v-model="question.text"
                    placeholder="Quizfrage (max. 300 Zeichen)" maxlength="300" required></textarea>
                <div class="row mt-2">
                    <div v-for="(answer, aIndex) in question.answers" :key="aIndex"
                        class="col-md-6 d-flex align-items-center mb-2">
                        <textarea class="form-control me-2" v-model="answer.text"
                            placeholder="Antwortmöglichkeit (max. 150 Zeichen)" maxlength="150" required></textarea>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" :name="'correctAnswer' + index"
                                :id="'answer' + index + aIndex" v-model="question.correctAnswer" :value="aIndex"
                                required>
                            <label class="form-check-label" :for="'answer' + index + aIndex">Antwort korrekt</label>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button type="button" class="btn btn-danger mt-2" @click="removeQuestion(index)">Frage entfernen</button>
                <button type="button" class="btn btn-success mt-2" @click="addQuestion">Frage hinzufügen</button>
            </div>
            <button type="submit" class="btn btn-primary">Speichern</button>
        </form>
    </div>
</template>