<script setup lang="ts">
import DiskIcon from '../icons/DiskIcon.vue';
import EyeIcon from '../icons/EyeIcon.vue';
import PencilIcon from '../icons/PencilIcon.vue';
import PeopleIcon from '../icons/PeopleIcon.vue';
import PersonIcon from '../icons/PersonIcon.vue';
import PlusIcon from '../icons/PlusIcon.vue';
import TrashCanIcon from '../icons/TrashCanIcon.vue';

</script>

<template>
    <div class="accordion-item mb-2">
        <h2 class="accordion-header">
            <button type="button" class="accordion-button bg-info bg-opacity-50" data-bs-toggle="collapse"
                data-bs-target="#collapseLegend">
                <strong>
                    Welche Bedeutung haben die Icons und Buttons von Quizius Maximus?
                </strong>
            </button>
        </h2>
        <div id="collapseLegend" class="accordion-collapse collapse bg-info bg-opacity-25">
            <div class="accordion-body">
                <div class="container">
                    <!-- comp -->
                    <div class="row mb-2">
                        <div class="col-3 col-md-1">
                            <button class="btn btn-outline-danger w-100">
                                <PersonIcon />
                            </button>
                        </div>
                        <div class="col-9 col-md-11 d-flex align-items-center">
                            <p class="mb-0">
                                kompetitiv (gegeneinander, 1 vs. 1)
                            </p>
                        </div>
                    </div>
                    <!-- coop -->
                    <div class="row mb-2">
                        <div class="col-3 col-md-1">
                            <button class="btn btn-outline-success w-100">
                                <PeopleIcon />
                            </button>
                        </div>
                        <div class="col-9 col-md-11 d-flex align-items-center">
                            <p class="mb-0">
                                kooperativ (miteinander)
                            </p>
                        </div>
                    </div>
                    <!-- kein comp -->
                    <div class="row mb-2">
                        <div class="col-3 col-md-1">
                            <button class="btn btn-secondary w-100" disabled>
                                <PersonIcon />
                            </button>
                        </div>
                        <div class="col-9 col-md-11 d-flex align-items-center">
                            <p class="mb-0">
                                hier gibt es <strong>keinen</strong> kompetitiven Spielmodus (gegeneinander)
                            </p>
                        </div>
                    </div>
                    <!-- kein coop -->
                    <div class="row mb-2">
                        <div class="col-3 col-md-1">
                            <button class="btn btn-secondary w-100" disabled>
                                <PeopleIcon />
                            </button>
                        </div>
                        <div class="col-9 col-md-11 d-flex align-items-center">
                            <p class="mb-0">
                                hier gibt es <strong>keinen</strong> kooperativen Spielmodus (miteinander)
                            </p>
                        </div>
                    </div>
                    <!-- create FK -->
                    <div class="row mb-2">
                        <div class="col-3 col-md-1">
                            <button class="btn btn-outline-success w-100">
                                <PlusIcon />
                            </button>
                        </div>
                        <div class="col-9 col-md-11 d-flex align-items-center">
                            <p class="mb-0">
                                Erstellung eines neuen Fragenkatalogs
                            </p>
                        </div>
                    </div>
                    <!-- display FK -->
                    <div class="row mb-2">
                        <div class="col-3 col-md-1">
                            <button class="btn btn-outline-primary w-100">
                                <EyeIcon />
                            </button>
                        </div>
                        <div class="col-9 col-md-11 d-flex align-items-center">
                            <p class="mb-0">
                                Fragenkatalog anzeigen
                            </p>
                        </div>
                    </div>
                    <!-- change FK -->
                    <div class="row mb-2">
                        <div class="col-3 col-md-1">
                            <button class="btn btn-outline-warning w-100">
                                <PencilIcon />
                            </button>
                        </div>
                        <div class="col-9 col-md-11 d-flex align-items-center">
                            <p class="mb-0">
                                Fragenkatalog bearbeiten
                            </p>
                        </div>
                    </div>
                    <!-- delete FK -->
                    <div class="row mb-2">
                        <div class="col-3 col-md-1">
                            <button class="btn btn-outline-danger w-100">
                                <TrashCanIcon />
                            </button>
                        </div>
                        <div class="col-9 col-md-11 d-flex align-items-center">
                            <p class="mb-0">
                                Frage oder Fragenkatalog löschen
                            </p>
                        </div>
                    </div>
                    <!-- save FK -->
                    <div class="row mb-2">
                        <div class="col-3 col-md-1">
                            <button class="btn btn-outline-primary w-100">
                                <DiskIcon />
                            </button>
                        </div>
                        <div class="col-9 col-md-11 d-flex align-items-center">
                            <p class="mb-0">
                                Fragenkatalog speichern
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
