<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestoreDB } from "@/main";
import PeopleIcon from '../icons/PeopleIcon.vue';
import PersonIcon from '../icons/PersonIcon.vue';

const props = defineProps({
    moduleId: {
        type: String,
        required: true,
    },
    moduleShortname: {
        type: String,
        required: true,
    },
    moduleLongname: {
        type: String,
        required: true
    },
    gameMode: {
        type: String,
        required: true
    },
});

const sections = ref([]);

const loadSections = async () => {
    try {
        // Lade Fragen-Daten
        const questionnairesQuery = query(collection(firestoreDB, 'questionnaires'), where('moduleID', '==', props.moduleId));
        const questionnairesSnapshot = await getDocs(questionnairesQuery);

        const sectionSet = new Set();

        for (const doc of questionnairesSnapshot.docs) {
            const questionsCollectionRef = collection(doc.ref, 'questions');
            const questionsSnapshot = await getDocs(questionsCollectionRef);
            questionsSnapshot.forEach(questionDoc => {
                const questionData = questionDoc.data();
                if (questionData.section) {
                    sectionSet.add(questionData.section); // Konvertiere section in eine Zahl
                }
            });
        }

        // Set in Array umwandeln, sortieren und in sections speichern
        sections.value = Array.from(sectionSet).sort((a, b) => a - b);
    } catch (error) {
        console.error("Fehler beim Laden der Lektionen: ", error);
    }
};

onMounted(() => {
    loadSections();
});
</script>

<template>
    <h2 class="text-center mb-3 mt-3 p-3">
        <PersonIcon v-if="props.gameMode === 'theme_comp'" class="me-3 text-danger" width="30" height="30" />
        <PeopleIcon v-if="props.gameMode === 'theme_coop'" class="me-3 text-success" width="30" height="30" />
        <span>Themenbasiertes Quiz</span><br>
        Lektionsauswahl
    </h2>

    <div class="container mt-3 mb-3">
        <div class="row justify-content-center">
            <!-- Komplettes Modul -->
            <div class="col-md-4 mb-3">
                <router-link :to="{
                    name: 'game', params: {
                        moduleId: props.moduleId, moduleShortname: props.moduleShortname,
                        moduleLongname: props.moduleLongname, gameMode: props.gameMode, section: 0
                    }
                }" class="text-dark text-decoration-none">
                    <div class="card border-info rounded h-100">
                        <div class="card-body bg-info bg-opacity-50 text-center rounded">
                            <h5>Komplettes Modul</h5>
                        </div>
                    </div>
                </router-link>
            </div>

            <!-- Lektionen -->
            <div v-for="section in sections" :key="section" class="col-md-4 mb-3">
                <router-link :to="{
                    name: 'game', params: {
                        moduleId: props.moduleId, moduleShortname: props.moduleShortname,
                        moduleLongname: props.moduleLongname, gameMode: props.gameMode, section: section
                    }
                }" class="text-dark text-decoration-none">
                    <div class="card border-info rounded h-100">
                        <div class="card-body bg-info bg-opacity-50 text-center rounded">
                            <h5>Lektion {{ section }}</h5>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>