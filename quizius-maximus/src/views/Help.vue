<script setup>
import ContactForm from "../components/help/ContactForm.vue";
import FAQ from "@/components/help/FAQ.vue";
import router from '@/router'
import { ref } from "vue";

const displayContactForm = ref(false);
const toastRef = ref(null);
const toastMessage = ref("");
const toastVariant = ref("");


const handleContactCancel = (message) => {
    displayContactForm.value = false;
    toastMessage.value = message;
    toastVariant.value = 'warning';
    triggerToast();
}

const handleContactSuccess = (message) => {
    displayContactForm.value = false;
    toastMessage.value = message;
    toastVariant.value = 'success';
    triggerToast();
}

const triggerToast = () => {
    if (toastRef.value) {
        toastRef.value.showToast();
    }
};
</script>

<template>
    <main>
        <section class="album mt-3 py-3 container">
            <article class="row justify-content-center">
                <h2 class="text-center mb-3">Wie können wir dir helfen?</h2>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <!-- FAQ Card innerhalb des Buttons -->
                    <button type="button" class="btn w-50 p-0" @click="displayContactForm = false">
                        <div :class="{
                            'card': true,
                            'border-info': displayContactForm,
                            'bg-info bg-opacity-50': !displayContactForm
                        }" class="m-0 h-100">
                            <div class="card-body">
                                <h6 class="card-title">FAQs</h6>
                                <p class="card-text">
                                    Klicke hier für Antworten auf die meistgestellten Fragen!</p>
                            </div>
                        </div>
                    </button>

                    <!-- Kontaktanfrage Card innerhalb des Buttons -->
                    <button type="button" class="btn w-50 p-0" @click="displayContactForm = true">
                        <div :class="{
                            'card': true,
                            'border-info': !displayContactForm,
                            'bg-info bg-opacity-50': displayContactForm
                        }" class="m-0 h-100">
                            <div class="card-body">
                                <h6 class="card-title">Kontaktformular</h6>
                                <p class="card-text">Keine Antwort gefunden? Dann klicke hier, um uns zu kontaktieren.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </article>

            <!-- Toast-Bereich -->
            <div class="row row-cols-1 justify-content-center">
                <div class="d-flex justify-content-center">
                    <Toast ref="toastRef" :message="toastMessage" :variant="toastVariant" />
                </div>
            </div>

            <!-- FAQ-Bereich -->
            <article class="row row-cols-1 justify-content-center mb-5" v-if="!displayContactForm">
                <h3 class="text-center mt-5 mb-3">FAQs</h3>
                <div class="d-flex justify-content-center">
                    <FAQ />
                </div>
            </article>

            <!-- Kontaktformular-Bereich -->
            <article class="row row-cols-1 justify-content-center mb-5" v-if="displayContactForm">
                <h3 class="text-center mt-5 mb-3">Kontaktformular</h3>
                <ContactForm @cancel="handleContactCancel" @success="handleContactSuccess" />
            </article>
        </section>
    </main>
</template>

<style scoped>
.card {
    transition: background-color 0.3s ease, border-color 0.3s ease;
}
</style>
