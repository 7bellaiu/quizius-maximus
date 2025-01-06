<script setup>
import { reactive } from 'vue';

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

function addQuestion() {
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
}

function removeQuestion(index) {
  form.questions.splice(index, 1);
}

function saveQuestionnaire() {
  console.log('Form submitted:', form);
  // TO DO: Logik zum Speichern des Formulars hinzufügen
}
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
        <label for="moduleShortname" class="form-label">Modulkürzel</label>
        <input type="text" class="form-control" id="moduleShortname" v-model="form.moduleShortname" maxlength="120" placeholder="Modulkürzel">
      </div>
      <div class="mb-3">
        <label for="moduleLongname" class="form-label">Modulname</label>
        <input type="text" class="form-control" id="moduleLongname" v-model="form.moduleLongname" maxlength="120" placeholder="Modulname">
      </div>

      <!-- Bauchdaten -->
      <div v-for="(question, index) in form.questions" :key="index" class="mb-3">
        <label :for="'question' + index" class="form-label">{{ index + 1 }}. Frage</label>
        <textarea class="form-control" :id="'question' + index" v-model="question.text" placeholder="Quizfrage (max. 300 Zeichen)"></textarea>
        <div class="row mt-2">
          <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="col-md-6 d-flex align-items-center mb-2">
            <textarea class="form-control me-2" v-model="answer.text" placeholder="Antwortmöglichkeit"></textarea>
            <div class="form-check">
              <input class="form-check-input" type="radio" :name="'correctAnswer' + index" :id="'answer' + index + aIndex" v-model="question.correctAnswer" :value="aIndex">
              <label class="form-check-label" :for="'answer' + index + aIndex">Antwort korrekt</label>
            </div>
          </div>
        </div>

        <button type="button" class="btn btn-danger mt-2" @click="removeQuestion(index)">Frage entfernen</button>
        <button type="button" class="btn btn-success mt-2" @click="addQuestion">Frage hinzufügen</button>
      </div>

      <button type="submit" class="btn btn-primary">Speichern</button>
    </form>
  </div>
</template>