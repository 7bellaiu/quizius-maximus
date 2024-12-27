<script setup>
import { ref } from "vue";
import DisplayProfileForm from "@/components/authentication/DisplayProfileForm.vue";
import ChangeUsernameForm from "@/components/authentication/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/authentication/ChangePasswordForm.vue";


const toastRef = ref(null);
const toastMessage = ref("");
const toastVariant = ref("");

const displayData = ref(true);
const changePassword = ref(false);
const changeUsername = ref(false);

const handleChangePassword = () => {
    displayData.value = false;
    changeUsername.value = false;
    changePassword.value = true;
}

const handleChangeUsername = () => {
    displayData.value = false;
    changeUsername.value = true;
    changePassword.value = false;
}

const handleCancelEmit = (message) => {
    displayData.value = true;
    changeUsername.value = false;
    changePassword.value = false;
    toastMessage.value = message;
    toastVariant.value = "warning"
    triggerToast();
}

const handleSuccessEmit = (message) => {
    displayData.value = true;
    changePassword.value = false;
    changeUsername.value = false
    toastMessage.value = message;
    toastVariant.value = "success";
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
        <section class="row justify-content-center">
            <article class="p-3 mt-3 mb-3 form-wrapper">
                <h2 class="mb-3 text-center">Mein Profil</h2>
                <DisplayProfileForm v-if="displayData" />
                <ChangePasswordForm v-else-if="changePassword" @success="handleSuccessEmit"
                    @cancel="handleCancelEmit" />
                <ChangeUsernameForm v-else-if="changeUsername" @success="handleSuccessEmit"
                    @cancel="handleCancelEmit" />
                <div v-if="!changeUsername && !changePassword" class="d-flex justify-content-between mt-3">
                    <button @click="handleChangePassword" class="btn btn-secondary" :disabled="changePassword">Passwort
                        ändern</button>
                    <button @click="handleChangeUsername" class="btn btn-primary"
                        :disabled="changeUsername">Benutzername
                        ändern</button>
                </div>
                <Toast ref="toastRef" :message="toastMessage" :variant="toastVariant" />
            </article>
        </section>
    </main>
</template>

<style scoped>
.form-wrapper {
    width: 100%;
    max-width: 400px;
}
</style>