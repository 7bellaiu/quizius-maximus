<script setup>
import TrashCanIcon from '../icons/TrashCanIcon.vue';
import PencilIcon from '../icons/PencilIcon.vue';
import EyeIcon from '../icons/EyeIcon.vue';

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

const emit = defineEmits(['delete-questionnaire']);
</script>

<template>
    <article class="card shadow-sm border-info">
        <div class="card-header text-bg-info bg-opacity-50 border-info">
            {{ props.shortname }}: {{ props.longname }}
        </div>
        <div class="card-body">
            <div class="row mb-2 align-items-center">
                <div class="col-2">
                    <router-link class="btn btn-sm btn-outline-primary w-100 mx-2"
                        :to="{ name: 'questionnaire', params: { action: 'display', moduleid: props.moduleid } }"
                        title="Fragenkatalog anzeigen">
                        <EyeIcon />
                    </router-link>
                </div>
                <div class="col-10">
                    <div class="lead">
                        Fragenkatalog anzeigen
                    </div>
                </div>
            </div>
            <div class="row mb-2 align-items-center">
                <div class="col-2">
                    <router-link class="btn btn-sm btn-outline-warning w-100 mx-2"
                        :to="{ name: 'questionnaire', params: { action: 'change', moduleid: props.moduleid } }"
                        title="Fragenkatalog bearbeiten">
                        <PencilIcon />
                    </router-link>
                </div>
                <div class="col-10">
                    <div class="lead">
                        Fragenkatalog bearbeiten
                    </div>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col-2">
                    <button type="button" class="btn btn-sm btn-outline-danger w-100 mx-2"
                        @click="emit('delete-questionnaire', props.moduleid)" title="Fragenkatalog löschen"> <!-- TODO: Wenn Fragenkatalog in games in einem dok mit player1Status <> 5 && player2Status <> 5 ist, dann kann Fragenkatalog nicht geloescht werden. -->
                        <TrashCanIcon />
                    </button>
                </div>
                <div class="col-10">
                    <div class="lead">
                        Fragenkatalog löschen
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>