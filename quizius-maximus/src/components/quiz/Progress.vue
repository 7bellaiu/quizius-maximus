  <script setup>
  const props = defineProps({
    currentQuestion: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    gameMode: {
      type: String,
      required: true
    }
  });
</script>
  
<template>
  <div class="row row-cols-1 mx-2 my-2">
    <div class="col text-center text-body-secondary">
      <p>
        <strong>{{ gameMode }}</strong>
        <br />
        <small>Frage {{ currentQuestion + 1 }} von {{ totalQuestions }}</small>
      </p>
    </div>
  </div>
</template>

