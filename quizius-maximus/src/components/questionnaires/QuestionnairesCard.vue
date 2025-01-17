<script setup>
import { useRouter } from 'vue-router';
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

const router = useRouter();

const navigateToEdit = () => {
    router.push({ name: 'editquestionnaire', params: { moduleid: props.moduleid } });
};

const navigateToDisplay = () => {
    router.push({ name: 'displayquestionnaire', params: { moduleid: props.moduleid } });
}
</script>

<template>
    <div class="col">
        <div class="card shadow-sm border-info">
            <div class="card-header text-bg-info bg-opacity-50 border-info">
                {{ props.shortname }}: {{ props.longname }}
            </div>
            <div class="card-body">
                <div class="row row-cols-2 mb-1">
                    <div class="col-2">
                        <button type="button" class="btn btn-sm btn-outline-primary w-100 mx-2"
                            @click="navigateToDisplay">
                            <EyeIcon />
                        </button>
                    </div>
                    <div class="col-9">
                        <small>Fragenkatalog anzeigen</small>
                    </div>
                </div>
                <div class="row row-cols-2 mb-1">
                    <div class="col-2">
                        <button type="button" class="btn btn-sm btn-outline-warning w-100 mx-2" @click="navigateToEdit">
                            <PencilIcon />
                        </button>
                    </div>
                    <div class="col-9">
                        <small>Fragenkatalog bearbeiten</small>
                    </div>
                </div>
                <div class="row row-cols-2 mb-1">
                    <div class="col-2">
                        <button type="button" class="btn btn-sm btn-outline-danger w-100 mx-2"
                            @click="emit('delete-questionnaire', props.moduleid)">
                            <TrashCanIcon />
                        </button>
                    </div>
                    <div class="col-9">
                        <small>Fragenkatalog löschen</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>