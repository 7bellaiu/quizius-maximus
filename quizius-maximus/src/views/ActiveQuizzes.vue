<script setup>
import { ref, onMounted } from "vue";
import { firestoreDB } from "@/main";
import { collection, query, where, getDocs, or } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ActiveQuizCard from "@/components/ActiveQuizCard.vue";

const games = ref([]);
const userUID = ref(null);

const loadGames = async () => {
    if (userUID.value) {
        try {
            const gamesQuery = query(
                collection(firestoreDB, "games"),
                or(
                    where("player1UID", "==", userUID.value),
                    where("player2UID", "==", userUID.value)
                )
            );
            const gamesDoc = await getDocs(gamesQuery);
            games.value = gamesDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(game => game.player1Status !== 5); // TODO: validieren, ob UID in player1 oder player2 steht & dann filtern
        } catch (error) {
            console.error("Fehler beim Laden der Quizze: ", error);
        }
    }
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
                <div class="container">
                    <div class="row row-cols-1 row-cols-md-2 g-4">
                        <ActiveQuizCard v-for="game in games" :key="game.id" :game="game" :userUID="userUID" />
                    </div>
                </div>
            </article>
        </section>
    </main>
</template>