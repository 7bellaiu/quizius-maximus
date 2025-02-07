<script setup>
import { ref, onMounted, computed } from 'vue';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestoreDB } from "@/main";
import TrophyIcon from '@/components/icons/TrophyIcon.vue';
import { useRouter } from 'vue-router';
import PersonArmsUpIcon from '../icons/PersonArmsUpIcon.vue';
import EmojiTearIcon from '../icons/EmojiTearIcon.vue';
import PeopleIcon from '../icons/PeopleIcon.vue';

const props = defineProps({
    gameDocId: {
        type: String,
        required: true
    }
});


</script>

<template>
    <h2 class="text-center mb-3 mt-4">
        Warte auf Gegenspieler...
    </h2>

    <div class="d-flex justify-content-center mt-3">
        <router-link class="btn btn-outline-primary m-1" to="/activequizzes">Zurück</router-link>
        <button class="btn btn-primary m-1" @click="completeQuiz">Quiz abschließen</button>
    </div>
</template>