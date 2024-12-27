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
        <div class="card shadow-sm border-primary border-opacity-25">
            <div class="card-header text-bg-primary border-primary border-opacity-25 bg-opacity-75">
                {{ props.shortname }}: {{ props.moduleid }}
            </div>
            <div class="card-body bg-primary bg-opacity-10">
                <h6 class="card-subtitle">{{ props.longname }}</h6>
                <p class="card-text">Hier könnte zusätzlich noch ein Beschreibungstext rein.</p>
                <div class="d-flex justify-content-center align-items-center">
                    <button type="button" class="btn btn-sm btn-outline-danger w-25 mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-success w-25 mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-people-fill" viewBox="0 0 16 16">
                            <path
                                d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>