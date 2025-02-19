<script setup>
import { ref, onMounted, computed } from 'vue';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestoreDB } from "@/main";
import { useRouter } from 'vue-router';
import HourglassSplitIcon from '../icons/HourglassSplitIcon.vue';
import InfoIcon from '../icons/InfoIcon.vue';

const props = defineProps({
    gameDocId: {
        type: String,
        required: true
    }
});

const router = useRouter();

// Quiz löschen
const deleteQuiz = async () => {
    // Popup anzeigen
    if (!confirm('Dieses Quiz wird gelöscht. Wirklich Fortfahren?')) {
        return;
    };

    const gameDocRef = doc(firestoreDB, "games", props.gameDocId);

    try {
        // Unterkollektion "questions" löschen
        const subcollectionRef = collection(gameDocRef, "questions");
        const subcollectionSnapshot = await getDocs(subcollectionRef);

        const deletePromises = subcollectionSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        // Hauptdokument löschen
        await deleteDoc(gameDocRef);

        alert('Quiz erfolgreich gelöscht!');
        router.push('/activequizzes');
    } catch (error) {
        console.error("Fehler beim Löschen des Quiz:", error);
        alert('Fehler beim Löschen des Quiz. Bitte versuche es erneut.');
    }
};
</script>

<template>
    <div class="container">
        <h2 class="text-center mt-3 p-3">
            <HourglassSplitIcon class="me-3 text-primary" width="30" height="30" />
            <span>Suche Gegenspieler </span>
            <div class="spinner-grow text-primary spinner-grow-sm" role="status"
                style="width: 0.5rem; height: 0.5rem; animation-duration: 1s; animation-delay: 0s;"></div>
            <div class="spinner-grow text-primary spinner-grow-sm" role="status"
                style="width: 0.5rem; height: 0.5rem; animation-duration: 1s; animation-delay: 0.33s;"></div>
            <div class="spinner-grow text-primary spinner-grow-sm" role="status"
                style="width: 0.5rem; height: 0.5rem; animation-duration: 1s; animation-delay: 0.66s;"></div>
        </h2>
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-0 rounded">
                    <div class="card-body bg-info bg-opacity-50 text-bg-info rounded text-center pb-1">
                        <p><span class="text-decoration-underline">Kleiner Tipp:</span> <br>
                            Du möchtest das Quiz doch nicht spielen oder findest über längere Zeit keinen
                            Gegenspieler?<br>
                            Dann kannst du einfach auf "Quiz löschen" klicken!</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-center mt-5">
            <router-link class="btn btn-outline-primary m-1" to="/activequizzes">Zurück</router-link>
            <button class="btn btn-outline-danger m-1" @click="deleteQuiz">Quiz löschen</button>
        </div>
        <div class="mt-5"></div>
    </div>
</template>