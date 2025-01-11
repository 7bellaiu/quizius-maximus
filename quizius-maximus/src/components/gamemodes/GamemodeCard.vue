<script setup>
import { computed } from 'vue';

const props = defineProps({
    gamemodeTitle: {
        type: String,
        required: true
    },
    gamemodeDescription: {
        type: String,
        required: true
    },
    gamemodeType: {
        type: String,
        required: true
    },
    gamemodeIsPlayable: {
        type: Boolean,
        required: true
    }
});

const displayGreen =  computed(() => { 
    return props.gamemodeType === "coop" && props.gamemodeIsPlayable;
 });

const displayRed =  computed(() => { 
    return props.gamemodeType === "comp" && props.gamemodeIsPlayable;
 });

const displayGray =  computed(() => { 
    return props.gamemodeIsPlayable !== true;
 });

</script>

<template>
    <button type="button" class="btn w-75 p-0 my-1" 
        @click="displayContactForm = false">
        <!-- <div :class="`card ${{ cardColor }}`"> -->
        <div :class="{ 'card': true, 'border-danger bg-danger text-white': displayGreen, 'border-danger bg-danger text-white': displayRed, 'border-secondary bg-secondary bg-opacity-25 text-secondary': displayGray }">
            <div class="card-body">
                <h5 class="card-title">{{ props.gamemodeTitle }}</h5>
                <p class="card-text">
                    {{ props.gamemodeDescription }}
                </p>
            </div>
        </div>
    </button>
</template>