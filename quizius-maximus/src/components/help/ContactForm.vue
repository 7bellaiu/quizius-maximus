<!-- TODO: in help-Ornder verschieben -->
<script setup>
import { ref, computed } from 'vue';
import { firestoreDB } from '@/main';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const email = ref("");
const REQUEST_TYPES = ["Login", "Verbesserungsvorschlag", "Account löschen" ,"Sonstiges Anliegen"];
const requestType = ref(REQUEST_TYPES[0]);
const message = ref("");
const toastRef = ref(null);
const toastMessage = ref("");
const toastVariant = ref("");

//communication with parent
const emit = defineEmits(["success", "cancel"])

const disableSubmitButton = computed(() => !email.value.trim() || !message.value.trim());

const handleContact = () => {
    //Validierung: Keine leeren Nachrichten
    if (!message.value.trim() || message.value.trim().length < 50) {
        toastMessage.value = "Bitte erkläre dein Anliegen detaillierter."
        toastVariant.value = "warning";
        triggerToast();
        return;
    }


    // Dokument in Collection erstellen
    addDoc(collection(firestoreDB, 'supportRequests'), {
        requestEmail: email.value,
        requestType: requestType.value,
        requestMessage: message.value,
        requestTimestamp: serverTimestamp()
    })
        .then((docRef) => {
            emit("success", "Deine Anfrage wurde erfolgreich gesendet!");
        })
        .catch((error) => {
            toastMessage.value = "Beim Versenden deiner Anfrage ist ein Fehler aufgetreten!";
            toastVariant.value = "danger";
            console.error("Fehler beim Absenden der Supportanfrage: ", error);
        });
};

const triggerToast = () => {
    if (toastRef.value) {
        toastRef.value.showToast();
    }
};
</script>

<template>
    <form @submit.prevent="handleContact">
        <div class="input-group mb-2">
            <div class="input-group-text" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-envelope" viewBox="0 0 16 16">
                    <path
                        d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                </svg>
            </div>
            <input type="email" class="form-control" id="email" placeholder="Deine E-Mail-Adresse für die Kommunikation"
                aria-label="E-Mail" data-ddg-inputtype="credentials.email" v-model="email" required />
        </div>
        <div class="input-group mb-2">
            <div class="input-group-text" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-envelope" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path
                        d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
                </svg>
            </div>
            <div class="form-floating">
                <select class="form-select" id="requestTypeSelect" aria-label="Auswahl der Art der Supportanfrage"
                    v-model="requestType">
                    <option :value="REQUEST_TYPES[0]">{{ REQUEST_TYPES[0] }}</option>
                    <option :value="REQUEST_TYPES[1]">{{ REQUEST_TYPES[1] }}</option>
                    <option :value="REQUEST_TYPES[2]">{{ REQUEST_TYPES[2] }}</option>
                    <option :value="REQUEST_TYPES[3]">{{ REQUEST_TYPES[3] }}</option>
                </select>
                <label for="requestTypeSelect">Was beschreibt dein Anliegen am ehesten?</label>
            </div>
        </div>
        <div class="input-group mb-2">
            <div class="input-group-text" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-envelope" viewBox="0 0 16 16">
                    <path
                        d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    <path
                        d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                </svg>
            </div>
            <textarea type="text" class="form-control" id="message"
                placeholder="Beschreibe hier dein Anliegen möglichst detailliert (mind. 50 Zeichen)"
                aria-label="Anfragetext" rows="4" v-model="message" required />
        </div>

        <div class="d-flex justify-content-between mt-3">
            <button type="button" @click="emit('cancel', 'Kontaktanfrage abgebrochen!');"
                class="btn btn-outline-danger">Abbrechen</button>
            <button type="submit" class="btn btn-primary w-50" :disabled="disableSubmitButton">Anfrage senden</button>
        </div>
    </form>
    <!-- Erfolgs-/Fehlermeldung -->
    <div class="d-flex justify-content-center mt-3">
        <Toast ref="toastRef" :message="toastMessage" :variant="toastVariant" />
    </div>
</template>