  <script setup>
  const props = defineProps({
    questionText: {
      type: String,
      required: true
    }
  });
</script>
  
<template>
  <div class="row row-cols-1 mx-2 mt-2">
    <div class="col">
      <div class="card border-primary bg-primary text-white">
        <div class="card-body">
          <p class="card-text">{{ questionText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

