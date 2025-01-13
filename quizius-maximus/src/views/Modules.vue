<script setup>
import ModuleCard from '@/components/ModuleCard.vue';
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const modules = ref([]);
const search = ref("");

onMounted(() => {
    /** check whether user is logged in when loading this view*/
    onAuthStateChanged(getAuth(), function (user) {
        if (!user) {
            router.push("/");
        }
    });

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
</script>

<template>
    <main>
        <!-- Kopfbereich -->
        <section class="py-4 text-center container">
            <div class="row py-lg-3">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <h1 class="fw-light">Module</h1>
                    <p class="lead text-body-secondary py-3">
                        <input type="search" class="form-control" v-model="search"
                            placeholder="Suche nach einem Modul für ein Quiz..." list="datalistOptions"
                            id="exampleDataList">
                        <!-- TODO: Testen mit mehr als 2 bzw. 3 und mehr Modulen -->
                        <datalist id="datalistOptions">
                            <option v-for="module in filteredModules.slice(0, 3)"
                                :value="module.shortname + ': ' + module.longname"></option>
                        </datalist>
                    </p>
                    <p class="lead text-body-secondary">
                        <span class="btn btn-outline-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-person-fill" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6">
                                </path>
                            </svg>
                        </span>
                        führt zur Auswahl
                        <span class="text-danger"> kompetitiver </span>
                        Spielmodi
                    </p>
                    <p class="lead text-body-secondary">
                        <span class="btn btn-outline-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-people-fill" viewBox="0 0 16 16">
                                <path
                                    d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5">
                                </path>
                            </svg>
                        </span>
                        führt zur Auswahl
                        <span class="text-success">
                            kooperativer
                        </span>
                        Spielmodi
                    </p>
                </div>
            </div>
        </section>
        <!-- Liste der Module als Cards -->
        <section class="album py-3 container">
            <div class="row row-cols-1 row-cols-lg-2 row-cols-xxl-3 g-3">
                <ModuleCard v-for="module in filteredModules" :moduleid="module.id" :shortname="module.shortname"
                    :longname="module.longname" />
            </div>
        </section>
    </main>
</template>