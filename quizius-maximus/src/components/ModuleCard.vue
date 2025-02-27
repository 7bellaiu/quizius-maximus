<script setup>
import FAQLink from './global/FAQLink.vue';
import PeopleIcon from './icons/PeopleIcon.vue';
import PersonIcon from './icons/PersonIcon.vue';

const props = defineProps({
    moduleid: {
        type: String,
        required: true
    },
    shortname: {
        type: String,
        required: true
    },
    longname: {
        type: String,
        required: true
    }
});
</script>

<template>
    <article class="card shadow-sm border-info">
        <div class="card-header text-bg-info bg-opacity-50 border-info">
            <h6>{{ props.shortname }}: {{ props.longname }}</h6>
        </div>
        <div class="card-body">
            <div class="row mb-1 align-items-center">
                <!-- Linker Bereich: 75% -->
                <div class="col-9">
                    <FAQLink text="Schnelles Quiz" />
                </div>
                <!-- Rechter Bereich: 25% -->
                <div class="col-3 d-flex justify-content-end">
                    <router-link class="btn btn-sm btn-outline-danger mx-1" title="Schnelles Quiz - kompetitiv"
                        :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'schnell_comp' } }">
                        <PersonIcon />
                    </router-link>
                    <router-link class="btn btn-sm btn-outline-success mx-1" title="Schnelles Quiz - kooperativ"
                        :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'schnell_coop' } }">
                        <PeopleIcon />
                    </router-link>
                </div>
            </div>
            <div class="row mb-1 align-items-center">
                <div class="col-9">
                    <FAQLink text="Themenbasiertes Quiz" />
                </div>
                <div class="col-3 d-flex justify-content-end">
                    <!-- Example single danger button -->
<!--                     <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-danger mx-1 dropdown-toggle"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            title="Themenbasiertes Quiz - kompetitiv">
                            <PersonIcon />
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                        </ul>
                    </div> -->
                    <router-link class="btn btn-sm btn-outline-danger mx-1" title="Themenbasiertes Quiz - kompetitiv"
                        :to="{ name: 'sectionselection', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'theme_comp' } }">
                        <PersonIcon />
                    </router-link>
                    <router-link type="button" class="btn btn-sm btn-outline-success mx-1"
                        title="Themenbasiertes Quiz - kooperativ"
                        :to="{ name: 'sectionselection', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'theme_coop' } }">
                        <PeopleIcon />
                    </router-link>
                </div>
            </div>
            <div class="row mb-1 align-items-center">
                <div class="col-9">
                    <FAQLink text="Prüfungssimulation" />
                </div>
                <div class="col-3 d-flex justify-content-end">
                    <router-link type="button" class="btn btn-sm btn-outline-danger mx-1"
                        title="Prüfungssimulation - kompetitiv"
                        :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'simul' } }">
                        <PersonIcon />
                    </router-link>
                    <button class="btn btn-sm btn-secondary mx-1" disabled>
                        <PeopleIcon />
                    </button>
                </div>
            </div>
            <div class="row mb-1 align-items-center">
                <div class="col-9">
                    <FAQLink text="Lernmodus" />
                </div>
                <div class="col-3 d-flex justify-content-end">
                    <button type="button" class="btn btn-sm btn-secondary mx-1" disabled>
                        <PersonIcon />
                    </button>
                    <router-link class="btn btn-sm btn-outline-success mx-1" title="Lernmodus - kooperativ"
                        :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'learn' } }">
                        <PeopleIcon />
                    </router-link>
                </div>
            </div>
        </div>
    </article>
</template>