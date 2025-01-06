<script setup>
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
        <div class="card shadow-sm border-primary">
            <div class="card-header text-bg-primary border-primary">
                {{ props.shortname }}: {{ props.moduleid }}
            </div>
            <div class="card-body bg-primary bg-opacity-10">
                <h6 class="card-subtitle">{{ props.longname }}</h6>
                <p class="card-text">Hier könnte zusätzlich noch ein Beschreibungstext rein.</p>
                <div class="d-flex justify-content-center align-items-center">
                    <button type="button" class="btn btn-sm btn-outline-warning w-25 mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path
                                d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                        </svg>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger w-25 mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-dash-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>