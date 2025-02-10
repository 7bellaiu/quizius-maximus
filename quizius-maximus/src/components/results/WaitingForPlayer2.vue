<script setup>
import { ref, onMounted, computed } from 'vue';
import { doc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestoreDB } from "@/main";
import { useRouter } from 'vue-router';
import HourglassSplitIcon from '../icons/HourglassSplitIcon.vue';

const props = defineProps({
    gameDocId: {
        type: String,
        required: true
    }
});

const router = useRouter();

// Quiz löschen
const deleteQuiz = () => {
    // Popup anzeigen
    if (!confirm('Dieses Quiz wird gelöscht. Wirklich Fortfahren?')) {
        return;
    };

    const gameDoc = doc(firestoreDB, "games", props.gameDocId);
    deleteDoc(gameDoc)
        .then(() => {
            alert('Quiz erfolgreich gelöscht!');
            router.push('/activequizzes');
        })
        .catch((error) => {
            console.error("Fehler beim Löschen des Quiz:", error);
            alert('Fehler beim Löschen des Quiz. Bitte versuche es erneut.');
        });
};

</script>

<template>
    <h2 class="text-center mb-3 mt-4">
        <HourglassSplitIcon class="me-3 text-primary" width="30" height="30" />
        <span>Suche Gegenspieler...</span>
    </h2>
    <div class="row justify-content-center">
        <div class="col-md-4 mb-3 mt-3">
            <div class="card border-info">
                <div class="card-body bg-info bg-opacity-50 text-bg-info text-center">
                    Du findest keinen Gegenspieler oder möchtest das Quiz doch nicht spielen?
                    Dann kannst du ganz einfach auf "Quiz löschen" klicken!
                </div>
            </div>
        </div>
    </div>

    <div class="d-flex justify-content-center mt-3">
        <router-link class="btn btn-outline-primary m-1" to="/activequizzes">Zurück</router-link>
        <button class="btn btn-outline-danger m-1" @click="deleteQuiz">Quiz löschen</button>
    </div>
</template>