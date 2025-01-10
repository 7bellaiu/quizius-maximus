<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { firestoreDB } from '@/main';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

const route = useRoute();
const moduleid = route.params.moduleid;

const form = reactive({
  shortname: '',
  longname: '',
  questions: []
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

const loadModuleData = async () => {
  try {
    // Lade Modul-Daten
    const moduleDoc = await getDoc(doc(firestoreDB, 'module', moduleid));
    if (moduleDoc.exists()) {
      form.shortname = moduleDoc.data().shortname;
      form.longname = moduleDoc.data().longname;
    }

    // Lade Fragen-Daten
    const questionnairesQuery = query(collection(firestoreDB, 'questionnaires'), where('moduleID', '==', moduleid));
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
          correctAnswer: parseInt(questionDoc.data().correctAnswer.replace('option', '')) - 1
        });
      }
    }
  } catch (error) {
    console.error('Fehler beim Laden der Daten: ', error);
  }
};

const saveQuestionnaire = async () => {
  try {
    // Aktualisiere Modul-Daten
    await updateDoc(doc(firestoreDB, 'module', moduleid), {
      shortname: form.shortname,
      longname: form.longname
    });

    // Abfrage der bestehenden Fragebögen in der Collection 'questionnaires'
    const questionnairesQuery = query(collection(firestoreDB, 'questionnaires'), where('moduleID', '==', moduleid));
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
      moduleID: moduleid
    });

    // Speichere neue Fragen
    const questionChanges = form.questions.map((question) => {
      return addDoc(collection(questionnaireDocRef, 'questions'), {
        question: question.text,
        option1: question.answers[0].text,
        option2: question.answers[1].text,
        option3: question.answers[2].text,
        option4: question.answers[3].text,
        correctAnswer: `option${question.correctAnswer + 1}`
      });
    });

    await Promise.all(questionChanges);

    alert('Fragenkatalog erfolgreich gespeichert!');
  } catch (error) {
    console.error('Fehler beim Speichern des Fragenkatalogs: ', error);
    alert('Fehler beim Speichern des Fragenkatalogs.');
  }
};

onMounted(() => {
  loadModuleData();
});
</script>

<template>
  <main>
    <!-- Kopfbereich -->
    <section class="py-4 text-center container">
      <div class="row py-lg-3">
        <div class="col-lg-6 col-md-8 mx-auto">
          <h1 class="fw-light">Fragenkatalog bearbeiten</h1>
        </div>
      </div>
    </section>
  </main>

  <div class="container mt-5">
    <form @submit.prevent="saveQuestionnaire">
      <!-- Kopfdaten -->
      <div class="mb-3">
        <label for="shortname" class="form-label">Modulkürzel</label>
        <input type="text" class="form-control" id="shortname" v-model="form.shortname" maxlength="120"
          placeholder="Modulkürzel" required>
      </div>
      <div class="mb-3">
        <label for="longname" class="form-label">Modulname</label>
        <input type="text" class="form-control" id="longname" v-model="form.longname" maxlength="120"
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
                :id="'answer' + index + aIndex" v-model="question.correctAnswer" :value="aIndex" required>
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