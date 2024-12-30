<script setup>
import ContactForm from "../components/ContactForm.vue";
import { ref } from "vue";

const displayContactForm = ref(false);



</script>

<template>
    <main>
        <section class="album py-3 container">
            <h2 class="text-center">Wie können wir dir helfen?</h2>
            <div class="row row-cols-2 justify-content-center">
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" :class="{'btn-primary': !displayContactForm, 'btn-outline-primary': displayContactForm}" class="btn w-50" @click="displayContactForm = false">
                        FAQ
                    </button>
                    <button type="button" :class="{'btn-primary': displayContactForm, 'btn-outline-primary': !displayContactForm}" class="btn w-50"
                        @click="displayContactForm = true">Kontaktanfrage</button>
                </div>
            </div>

            <div class="row row-cols-1 justify-content-center" v-if="!displayContactForm">
                <h2 class="text-center mt-5">FAQ</h2>
                <details>
                    <summary>FAQ Frage 1</summary> Antworttext zu Frage 1
                </details>
            </div>

            <div class="row row-cols-1 justify-content-center" v-if="displayContactForm">
                <h2 class="text-center mt-5">Kontaktanfrage</h2>
                <ContactForm />
            </div>
        </section>
    </main>
</template>