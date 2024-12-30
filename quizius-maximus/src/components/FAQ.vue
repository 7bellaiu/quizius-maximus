<script setup>

</script>

<template>
    <div class="accordion w-100" id="faqAccordion">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                    aria-expanded="true" aria-controls="collapseOne">
                    Die am häufigsten gestellte Frage ist natürlich diese hier.
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                    <strong>Die am häufigsten gestellte Frage ist natürlich diese hier. </strong>
                    Diese Antwort wird standardmäßig angezeigt, bis das Collapse-Plugin die entsprechenden Klassen
                    hinzufügt,
                    die wir verwenden, um jedes Element zu stylen. Diese Klassen steuern das gesamte
                    Erscheinungsbild sowie das Ein- und Ausblenden über CSS-Übergänge. Du kannst dies mit
                    benutzerdefiniertem CSS oder durch Überschreiben unserer Standard-Variablen anpassen. Es ist
                    auch erwähnenswert, dass nahezu jedes HTML innerhalb des <code>.accordion-body</code> platziert
                    werden kann, obwohl die Übergänge den Überlauf (Overflow) einschränken.
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Die zweithäufigste Frage ist diese.
                </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                    <strong>Die zweithäufigste Frage ist diese.</strong>
                    Es ist standardmäßig ausgeblendet, bis das Collapse-Plugin die entsprechenden Klassen hinzufügt,
                    die wir verwenden, um jedes Element zu stylen. Diese Klassen steuern das gesamte
                    Erscheinungsbild sowie das Ein- und Ausblenden über CSS-Übergänge. Du kannst dies mit
                    benutzerdefiniertem CSS oder durch Überschreiben unserer Standard-Variablen anpassen. Es ist
                    auch erwähnenswert, dass nahezu jedes HTML innerhalb des <code>.accordion-body</code> platziert
                    werden kann, obwohl die Übergänge den Überlauf (Overflow) einschränken.
                </div>
            </div>
        </div>
    </div>
</template>