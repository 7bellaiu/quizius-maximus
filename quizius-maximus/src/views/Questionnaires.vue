<script setup>
import QuestionnairesCard from '@/components/questionnaires/QuestionnairesCard.vue';
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import router from '@/router';

const modules = ref([]);
const search = ref("");

onMounted(() => {
    /** check whether user is logged in when loading this view*/
    // Reicht im AppHeader aus
    // onAuthStateChanged(getAuth(), function (user) {
    //     if (!user) {
    //         router.push("/");
    //     }
    // });

    getDocs(collection(getFirestore(), 'module'))
        .then((moduleSnapshot) => {
            modules.value = moduleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
});

const filteredModules = computed(() => {
    return modules.value.filter(module => {
        const searchTerm = search.value.toLowerCase();
        return (
            module.shortname.toLowerCase().includes(searchTerm) ||
            module.longname.toLowerCase().includes(searchTerm)
        );
    });
});

// Erstellen
const createQuestionnaire = () => {
    router.push('/createquestionnaire');
};

// Löschen
const deleteQuestionnaire = async (moduleId) => {

    try {
        // Popup anzeigen
        if (!confirm('Der komplette Fragenkatalog zu diesem Modul wird gelöscht. Wirklich Fortfahren?')) {
            return;
        }

        const firestoreDB = getFirestore();

        // collection module löschen
        await deleteDoc(doc(firestoreDB, 'module', moduleId));

        // zugehörige questionnaire collection selektieren und löschen
        const questionnairesDoc = await getDocs(query(collection(firestoreDB, 'questionnaires'), where('moduleID', '==', moduleId)));

        await Promise.all(questionnairesDoc.docs.map(async (questionnaireDoc) => {
            const questionsDoc = await getDocs(collection(questionnaireDoc.ref, 'questions'));
            await Promise.all(questionsDoc.docs.map((questionDoc) => deleteDoc(questionDoc.ref)));
            await deleteDoc(questionnaireDoc.ref);
        }));

        alert('Fragenkatalog erfolgreich gelöscht!');
    } catch (error) {
        console.error('Fehler beim Löschen des Fragenkatalogs: ', error);
        alert('Fehler beim Löschen des Fragenkatalogs.');
    }

    // Modul aus der Ansicht entfernen ohne Seitenrefresh
    modules.value = modules.value.filter(module => module.id !== moduleId);
};


</script>

<template>
    <main>
        <!-- Kopfbereich -->
        <section class="pt-4 text-center container">
            <div class="row py-lg-3">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <h1 class="fw-light">Fragenkataloge</h1>
                    <div class="lead text-body-secondary py-3 d-flex align-items-center">
                        <input type="search" class="form-control me-2" v-model="search"
                            placeholder="Suche nach einem Modul ..."
                            list="datalistOptions" id="exampleDataList">
                        <datalist id="datalistOptions">
                            <option v-for="module in filteredModules.slice(0, 3)" :value="module.longname"></option>
                        </datalist>
                        <span class="btn btn-outline-success" @click="createQuestionnaire" title="Neues Modul anlegen">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </section>
        <!-- Liste der Module als Cards -->
        <section class="album container">
            <div class="row row-cols-1 row-cols-lg-2 row-cols-xxl-3 g-3">
                <QuestionnairesCard v-for="module in filteredModules" :moduleid="module.id"
                    :shortname="module.shortname" :longname="module.longname"
                    @delete-questionnaire="deleteQuestionnaire" />
            </div>
        </section>
    </main>
</template>