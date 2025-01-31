<script setup>
import { ref, onMounted } from "vue";
import { firestoreDB } from "@/main";
import { collection, query, where, getDocs, or } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';
import ActiveQuizCard from "@/components/ActiveQuizCard.vue";

const games = ref([]);
const userUID = ref(null);
const router = useRouter();

const loadGames = () => {
    if (userUID.value) {
        // Alle Spiele laden, bei denen der aktuelle User in player1 oder p layer2 steht
        const gamesQuery = query(
            collection(firestoreDB, "games"),
            or(
                where("player1UID", "==", userUID.value),
                where("player2UID", "==", userUID.value)
            )
        );

        getDocs(gamesQuery)
            .then((gamesDoc) => {
                games.value = gamesDoc.docs.map(doc => {
                    const gameData = doc.data();
                    if (!gameData.player2Username) {
                        gameData.player2Username = "Unbekannter Spieler"; 
                    }
                    return { id: doc.id, ...gameData };
                }).filter(game => { // nur Spiele mit Spielstatus ungleich 5 anzeigen
                    if (game.player1UID === userUID.value && game.player1Status === 5) {
                        return false;
                    }
                    if (game.player2UID === userUID.value && game.player2Status === 5) {
                        return false;
                    }
                    return true;
                });
            })
            .catch((error) => {
                console.error("Fehler beim Laden der Quizze: ", error);
            });
    }
};

const showResult = (game) => {
    router.push({
        name: 'result',
        params: {
            gameMode: game.gameMode,
            moduleShortname: game.moduleShortname,
            moduleLongname: game.moduleLongname,
            gameId: game.id
        }
    });
};

onMounted(() => {
    onAuthStateChanged(getAuth(), (user) => {
        if (user) {
            userUID.value = user.uid;
            loadGames();
        }
    });
});
</script>

<template>
    <main>
        <section class="album py-3 container">
            <article class="row justify-content-center">
                <h2 class="text-center">Meine Quizze</h2>
                <div class="container mt-5">
                    <div class="row row-cols-1 row-cols-md-2 g-4">
                        <ActiveQuizCard v-for="game in games" :key="game.id" :game="game" :userUID="userUID" />
                    </div>
                </div>
            </article>
        </section>
    </main>
</template>