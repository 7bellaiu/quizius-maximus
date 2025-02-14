<script setup>
import QuestionnairesCard from '@/components/questionnaires/QuestionnairesCard.vue';
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import router from '@/router';
import PlusIcon from '@/components/icons/PlusIcon.vue';

const modules = ref([]);
const search = ref("");

onMounted(() => {
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
        <section class="p-3 text-center container">
            <div class="row py-lg-3">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <h2 class="text-center">Fragenkataloge</h2>
                    <div class="lead text-body-secondary py-3 d-flex align-items-center">
                        <input type="search" class="form-control me-2" v-model="search"
                            placeholder="Suche nach einem Modul ..." list="datalistOptions" id="exampleDataList">
                        <datalist id="datalistOptions">
                            <option v-for="module in filteredModules.slice(0, 3)" :value="module.longname"></option>
                        </datalist>
                        <router-link type="button" class="btn btn-outline-success"
                            :to="{ name: 'questionnaire', params: { action: 'create', moduleid: 0 } }"
                            title="Neues Modul anlegen">
                            <PlusIcon />
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
        <!-- Liste der Module als Cards -->
        <section class="album container">
            <div class="row row-cols-1 row-cols-lg-2 row-cols-xxl-3 g-3 mb-5">
                <div class="col" v-for="module in filteredModules">
                    <QuestionnairesCard :moduleid="module.id" :shortname="module.shortname" :longname="module.longname"
                        @delete-questionnaire="deleteQuestionnaire" />
                </div>
            </div>
        </section>
    </main>
</template>