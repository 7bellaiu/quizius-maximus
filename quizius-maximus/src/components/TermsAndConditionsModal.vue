<script setup lang="ts">
import TermsAndConditions from './TermsAndConditions.vue';

</script>

<template>
    <!-- Modal -->
    <div class="modal modal-xl fade" id="termsConditionsModal" data-bs-backdrop="static" data-bs-keyboard="false"
        tabindex="-1" aria-labelledby="termsConditionsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header text-bg-dark" data-bs-theme="dark">
                    <h1 class="modal-title fs-5" id="termsConditionsModalLabel">Nutzungsbedingungen</h1>
                    <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close" data-bs-theme="dark"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <TermsAndConditions />
                    </div>
                </div>
                <div class="modal-footer text-bg-dark" data-bs-theme="dark">
                    <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal">Ich habe
                        die
                        Nutzungsbedingung gelesen</button>
                </div>
            </div>
        </div>
    </div>
</template>