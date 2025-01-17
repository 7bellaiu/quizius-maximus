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
            {{ props.shortname }}: {{ props.longname }}
        </div>
        <div class="card-body">
            <div class="row row-cols-2 mb-1">
                <div class="col-6">
                    <FAQLink text="Schnelles Quiz" />
                </div>
                <div class="col">
                    <div class="btn-toolbar justify-content-end">
                        <router-link class="btn btn-sm btn-outline-danger mx-1" title="Schnelles Quiz - kompetitiv"
                            :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'schnell_coop' } }">
                            <PersonIcon />
                        </router-link>
                        <router-link class="btn btn-sm btn-outline-success mx-1" title="Schnelles Quiz - kompetitiv"
                            :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'schnell_comp' } }">
                            <PeopleIcon />
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="row row-cols-2 mb-1">
                <div class="col-6">
                    <FAQLink text="Themenbasiertes Quiz" />
                </div>
                <div class="col">
                    <div class="btn-toolbar justify-content-end">
                        <router-link class="btn btn-sm btn-outline-danger mx-1"
                            title="Themenbasiertes Quiz - kompetitiv"
                            :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'theme_coop' } }">
                            <PersonIcon />
                        </router-link>
                        <router-link type="button" class="btn btn-sm btn-outline-success mx-1"
                            title="Themenbasiertes Quiz - kompetitiv"
                            :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'theme_comp' } }">
                            <PeopleIcon />
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="row row-cols-2 mb-1">
                <div class="col-6">
                    <FAQLink text="Prüfungssimulation" />
                </div>
                <div class="col">
                    <div class="btn-toolbar justify-content-end">
                        <button class="btn btn-sm btn-secondary mx-1" disabled>
                            <PersonIcon />
                        </button>
                        <router-link type="button" class="btn btn-sm btn-outline-success mx-1"
                            title="Prüfungssimulation - kompetitiv"
                            :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'simul_comp' } }">
                            <PeopleIcon />
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="row row-cols-2 mb-1">
                <div class="col-6">
                    <FAQLink text="Lernmodus" />
                </div>
                <div class="col">
                    <div class="btn-toolbar justify-content-end">
                        <router-link class="btn btn-sm btn-outline-danger mx-1" title="Lernmodus - kooperativ"
                            :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'learn_coop' } }">
                            <PersonIcon />
                        </router-link>
                        <button type="button" class="btn btn-sm btn-secondary mx-1" disabled>
                            <PeopleIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>