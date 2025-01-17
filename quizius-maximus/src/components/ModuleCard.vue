<script setup>
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
    <div class="col">
        <div class="card shadow-sm border-info">
            <div class="card-header text-bg-info bg-opacity-50 border-info">
                {{ props.shortname }}: {{ props.longname }}
            </div>
            <div class="card-body">
                <div class="row row-cols-2 mb-1">
                    <div class="col-6">
                        <small>Schnelles Quiz</small>
                    </div>
                    <div class="col">
                        <div class="btn-toolbar justify-content-end">
                            <router-link class="btn btn-sm btn-outline-danger mx-1"
                                :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'schnell' } }">
                                <PersonIcon />
                            </router-link>
                            <router-link type="button" class="btn btn-sm btn-outline-success mx-1" to="">
                                <PeopleIcon />
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-2 mb-1">
                    <div class="col-6">
                        <small>Themenbasiertes Quiz</small>
                    </div>
                    <div class="col">
                        <div class="btn-toolbar justify-content-end">
                            <router-link class="btn btn-sm btn-outline-danger mx-1"
                                :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'schnell' } }">
                                <PersonIcon />
                            </router-link>
                            <router-link type="button" class="btn btn-sm btn-outline-success mx-1" to="">
                                <PeopleIcon />
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-2 mb-1">
                    <div class="col-6">
                        <small>Prüfungssimulation</small>
                    </div>
                    <div class="col">
                        <div class="btn-toolbar justify-content-end">
                            <button class="btn btn-sm btn-outline-secondary mx-1" disabled>
                                <PersonIcon />
                            </button>
                            <router-link type="button" class="btn btn-sm btn-outline-success mx-1" to="">
                                <PeopleIcon />
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-2 mb-1">
                    <div class="col-6">
                        <small>Lernmodus</small>
                    </div>
                    <div class="col">
                        <div class="btn-toolbar justify-content-end">
                            <router-link class="btn btn-sm btn-outline-danger mx-1"
                                :to="{ name: 'game', params: { moduleId: props.moduleid, moduleShortname: props.shortname, moduleLongname: props.longname, gameMode: 'schnell' } }">
                                <PersonIcon />
                            </router-link>
                            <button type="button" class="btn btn-sm btn-outline-secondary mx-1" disabled>
                                <PeopleIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>