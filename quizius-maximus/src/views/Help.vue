<script setup>
import ContactForm from "../components/ContactForm.vue";
import FAQ from "../components/FAQ.vue"

import { ref } from "vue";

const displayContactForm = ref(false);
</script>

<template>
    <main>
        <section class="album py-3 container">
            <h2 class="text-center">Wie können wir dir helfen?</h2>
            <div class="row justify-content-center">
                <div class="btn-group" role="group" aria-label="Basic example">
                    <!-- FAQ Card innerhalb des Buttons -->
                    <button type="button" class="btn w-50 p-0" @click="displayContactForm = false">
                        <div :class="{
                            'card': true,
                            'border-primary': displayContactForm,
                            'bg-primary text-white': !displayContactForm
                        }" class="m-0">
                            <div class="card-body">
                                <h5 class="card-title">FAQ</h5>
                                <p class="card-text">
                                    Klicke hier und finde zu den meist gestellten Fragen direkt eine Antwort!</p>
                            </div>
                        </div>
                    </button>

                    <!-- Kontaktanfrage Card innerhalb des Buttons -->
                    <button type="button" class="btn w-50 p-0" @click="displayContactForm = true">
                        <div :class="{
                            'card': true,
                            'border-primary': !displayContactForm,
                            'bg-primary text-white': displayContactForm
                        }" class="m-0">
                            <div class="card-body">
                                <h5 class="card-title">Kontaktanfrage</h5>
                                <p class="card-text">Keine Antwort gefunden? Dann klicke hier, um uns zu kontaktieren.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- FAQ-Bereich -->
            <div class="row row-cols-1 justify-content-center" v-if="!displayContactForm">
                <h2 class="text-center">FAQ</h2>
                <section class="d-flex justify-content-center">
                    <FAQ />
                </section>
            </div>

            <!-- Kontaktformular-Bereich -->
            <div class="row row-cols-1 justify-content-center" v-else>
                <h2 class="text-center mt-5">Kontaktanfrage</h2>
                <ContactForm />
            </div>
        </section>
    </main>
</template>

<style scoped>
/* Zusätzliche Styles, um den Button-Inhalt zu formatieren */
.card {
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.card-body {
    padding: 20px;
}
</style>
