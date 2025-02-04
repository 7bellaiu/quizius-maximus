<script setup>
import ModuleCard from '@/components/ModuleCard.vue';
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import router from '@/router'

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
        <section class="pt-4 text-center container">
            <div class="row py-lg-3">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <h2 class="mb-3 mt-3 text-center">Module</h2>
                    <div class="lead text-body-secondary py-3 d-flex align-items-center">
                        <input type="search" class="form-control" v-model="search"
                            placeholder="Suche nach einem Modul für ein Quiz..." list="datalistOptions"
                            id="exampleDataList">
                        <datalist id="datalistOptions">
                            <option v-for="module in filteredModules.slice(0, 3)" :value="module.longname"></option>
                        </datalist>
                    </div>
                </div>
            </div>
        </section>
        <!-- Liste der Module als Cards -->
        <section class="album container">
            <div class="row row-cols-1 row-cols-lg-2 row-cols-xxl-3 g-3">
                <div class="col" v-for="module in filteredModules">
                    <ModuleCard :moduleid="module.id" :shortname="module.shortname" :longname="module.longname" />
                </div>
            </div>
        </section>
    </main>
</template>