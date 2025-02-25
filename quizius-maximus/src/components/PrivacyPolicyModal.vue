<script setup lang="ts">
import PrivacyPolicy from './PrivacyPolicy.vue';

</script>

<template>
    <main>
        <!-- Modal -->
        <div class="modal modal-xl fade" id="privacyPolicyModal" data-bs-backdrop="static" data-bs-keyboard="false"
            tabindex="-1" aria-labelledby="privacyPolicyModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header text-bg-dark" data-bs-theme="dark">
                        <h1 class="modal-title fs-5" id="privacyPolicyModalLabel">Datenschutzerklärung</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" data-bs-theme="dark"></button>
                    </div>
                    <div class="modal-body">
                        <PrivacyPolicy />
                    </div>
                    <div class="modal-footer text-bg-dark">
                        <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal">Ich habe die
                            Datenschutzerklärung gelesen</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>