<script setup>
import { ref, watch } from 'vue';

const props = defineProps(["optionId", "optionText", "display", "isCorrect"]);
const emits = defineEmits(["selected"])

const isSelected = ref(false);

//Nach Selektion Option hervorheben und Selektion an Parent melden
const handleClick = () => {
    if (!props.display) {
        isSelected.value = true;
        emits("selected", props.optionId, props.isCorrect);
    }
}

//Selektion zurücksetzen, wenn neue Option übergeben
watch(() => props.optionText, () => {
    isSelected.value = false;
});
</script>

<template>
    <div class="col my-1">
        <div class="col w-100 h-100">
            <button type="button" class="btn p-0 m-0 w-100 h-100" :class="{
                'btn-outline-primary': !isSelected,
                'btn-outline-success': isCorrect && isSelected,
                'btn-outline-danger': !isCorrect && isSelected
            }" @click="handleClick">
                <div class="card w-100 h-100" :class="{
                    'border-primary': !isSelected,
                    'border-success text-success': isCorrect && isSelected,
                    'bg-danger text-white': !isCorrect && isSelected
                }">
                    <div class="card-body">
                        <p class="card-text">{{ optionText }}</p>
                    </div>
                </div>
            </button>
        </div>
    </div>
</template>