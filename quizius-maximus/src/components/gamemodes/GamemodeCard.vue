<script setup>
import { computed } from 'vue';

const props = defineProps({
    moduleId: {
        type: String,
        required: true
    },
    moduleShortname: {
        type: String,
        required: true
    },
    moduleLongname: {
        type: String,
        required: true
    },
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

const displayGreen = computed(() => {
    return props.gamemodeType === "coop" && props.gamemodeIsPlayable;
});

const displayRed = computed(() => {
    return props.gamemodeType === "comp" && props.gamemodeIsPlayable;
});

const displayGray = computed(() => {
    return props.gamemodeIsPlayable !== true;
});

</script>

<template>
    <router-link class="btn p-0 my-1"
        :to="{ name: 'game', params: { moduleId: props.moduleId, moduleShortname: props.moduleShortname, moduleLongname: props.moduleLongname, gameMode: props.gamemodeTitle } }"
        :disabled="!props.gamemodeIsPlayable">
        <!-- <button type="button" class="btn p-0 my-1" @click="" :disabled="!props.gamemodeIsPlayable"> -->
        <div
            :class="{ 'card': true, 'border-danger bg-danger text-body-primary': displayGreen, 'border-danger bg-danger text-body-primary': displayRed, 'border-secondary bg-secondary bg-opacity-25 text-body-secondary': displayGray }">
            <div class="card-body">
                <h5 class="card-title">{{ props.gamemodeTitle }}</h5>
                <p class="card-text">
                    {{ props.gamemodeDescription }}
                </p>
                <p v-if="!props.gamemodeIsPlayable" class="btn btn-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-cone-striped" viewBox="0 0 16 16">
                        <path
                            d="m9.97 4.88.953 3.811C10.159 8.878 9.14 9 8 9s-2.158-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12m-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.275 3.9C6.8 3.965 7.382 4 8 4s1.2-.036 1.725-.098m4.396 8.613a.5.5 0 0 1 .037.96l-6 2a.5.5 0 0 1-.316 0l-6-2a.5.5 0 0 1 .037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257z">
                        </path>
                    </svg>
                    COMING SOON
                </p>
                <p v-else class="card-text"><small class="text-body-secondary"><strong>Modul:</strong> {{
                    props.moduleShortname
                }} - {{
                            props.moduleLongname }}</small></p>
            </div>
        </div>
    </router-link>
    <!-- </button> -->
</template>