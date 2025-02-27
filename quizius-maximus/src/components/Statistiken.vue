<script setup>
import { ref, onMounted } from "vue";
import { firestoreDB } from "@/main";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PeopleIcon from "@/components/icons/PeopleIcon.vue";
import PersonIcon from "@/components/icons/PersonIcon.vue";
import PersonCircleIcon from "@/components/icons/PersonCircleIcon.vue";

const coopCorrectAnswers = ref(0);
const coopFalseAnswers = ref(0);
const compCorrectAnswers = ref(0);
const compFalseAnswers = ref(0);

const leaderboard = ref([]);

// Funktion, um Benutzerdaten zu sammeln
const collectUserData = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        return {
            userUID: user.uid,
            userUsername: user.displayName || "Unbekannter Spieler"
        };
    } else {
        console.error("Kein Benutzer eingeloggt");
        return null;
    }
};

const fetchStatistics = async () => {
    const statisticsQuery = collection(firestoreDB, "statistics");
    const querySnapshot = await getDocs(statisticsQuery);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Setze die Werte auf 0, bevor die Daten abgerufen werden
    coopCorrectAnswers.value = 0;
    coopFalseAnswers.value = 0;
    compCorrectAnswers.value = 0;
    compFalseAnswers.value = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (currentUser && data.userUID === currentUser.uid) {
            coopCorrectAnswers.value = data.coopCorrectAnswers;
            coopFalseAnswers.value = data.coopFalseAnswers;
            compCorrectAnswers.value = data.compCorrectAnswers;
            compFalseAnswers.value = data.compFalseAnswers;
        }
    });

    // Berechne die Rangliste
    const leaderboardData = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const totalCorrectAnswers = data.coopCorrectAnswers + data.compCorrectAnswers;
        leaderboardData.push({ username: data.username || "Unbekannter Spieler", totalCorrectAnswers });
    });

    // Sortiere die Rangliste nach der Anzahl der richtigen Antworten und wähle die Top 5 aus
    leaderboard.value = leaderboardData
        .sort((a, b) => b.totalCorrectAnswers - a.totalCorrectAnswers)
        .slice(0, 5);
};

onMounted(() => {
    onAuthStateChanged(getAuth(), (user) => {
        if (user) {
            fetchStatistics();
        }
    });
});
</script>

<template>
    <main>
        <!-- Statistik -->
        <div class="row justify-content-center">
            <div class="col-md-4 mb-3">
                <div class="card border-info h-100">
                    <div class="card-header bg-info bg-opacity-50 text-bg-info">
                        <h4 class="text-center">Statistik</h4>
                    </div>
                    <div class="card-body">
                        <p>
                            <PeopleIcon class="text-success me-2" /><strong>Kooperativ:</strong>
                        </p>
                        <div class="d-flex justify-content-between">
                            <p class="text-success">Richtige Fragen: {{ coopCorrectAnswers }}</p>
                            <p class="text-danger">Falsche Fragen: {{ coopFalseAnswers }}</p>
                        </div>
                        <div class="progress" style="height: 30px;">
                            <div class="progress-bar bg-success" role="progressbar"
                                :style="{ width: coopCorrectAnswers + coopFalseAnswers === 0 ? '0%' : coopCorrectAnswers / (coopCorrectAnswers + coopFalseAnswers) * 100 + '%' }"
                                aria-valuenow="coopCorrectAnswers" aria-valuemin="0" aria-valuemax="100">{{
                                    coopCorrectAnswers + coopFalseAnswers === 0 ? '0' : (coopCorrectAnswers / (coopCorrectAnswers + coopFalseAnswers) * 100).toFixed(1) }}%
                            </div>
                            <div class="progress-bar bg-danger" role="progressbar"
                                :style="{ width: coopCorrectAnswers + coopFalseAnswers === 0 ? '0%' : coopFalseAnswers / (coopCorrectAnswers + coopFalseAnswers) * 100 + '%' }"
                                aria-valuenow="coopFalseAnswers" aria-valuemin="0" aria-valuemax="100">{{
                                    coopCorrectAnswers + coopFalseAnswers === 0 ? '0' : (coopFalseAnswers / (coopCorrectAnswers + coopFalseAnswers) * 100).toFixed(1) }}%
                            </div>
                        </div>
                        <br>
                        <p>
                            <PersonIcon class="text-danger me-2" /><strong>Kompetitiv:</strong>
                        </p>
                        <div class="d-flex justify-content-between">
                            <p class="text-success">Richtige Fragen: {{ compCorrectAnswers }}</p>
                            <p class="text-danger">Falsche Fragen: {{ compFalseAnswers }}</p>
                        </div>
                        <div class="progress" style="height: 30px;">
                            <div class="progress-bar bg-success" role="progressbar"
                                :style="{ width: compCorrectAnswers + compFalseAnswers === 0 ? '0%' : compCorrectAnswers / (compCorrectAnswers + compFalseAnswers) * 100 + '%' }"
                                aria-valuenow="compCorrectAnswers" aria-valuemin="0" aria-valuemax="100">{{
                                    compCorrectAnswers + compFalseAnswers === 0 ? '0' : (compCorrectAnswers / (compCorrectAnswers + compFalseAnswers) * 100).toFixed(1) }}%
                            </div>
                            <div class="progress-bar bg-danger" role="progressbar"
                                :style="{ width: compCorrectAnswers + compFalseAnswers === 0 ? '0%' : compFalseAnswers / (compCorrectAnswers + compFalseAnswers) * 100 + '%' }"
                                aria-valuenow="compFalseAnswers" aria-valuemin="0" aria-valuemax="100">{{
                                    compCorrectAnswers + compFalseAnswers === 0 ? '0' : (compFalseAnswers / (compCorrectAnswers + compFalseAnswers) * 100).toFixed(1) }}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card border-info h-100">
                    <div class="card-header bg-info bg-opacity-50 text-bg-info">
                        <h4 class="text-center">Rangliste - Top 5</h4>
                    </div>
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Benutzername</th>
                                    <th scope="col">Punktzahl</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(user, index) in leaderboard" :key="user.username">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>
                                        <PersonCircleIcon class="text-secondary me-2" />{{ user.username }}
                                    </td>
                                    <td>{{ user.totalCorrectAnswers }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>