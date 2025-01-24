<!-- TODO: Icons in Text einbinden und Text-Struktur ggfs. anpassen -->
<script setup>
import { ref } from 'vue';
import FAQLegend from './FAQLegend.vue';

const FAQ_CONTENT = ref([
    {
        // TODO: Hier die Icons einbauen -> KI fragen
        question: "Was ist ein schnelles Quiz?"
        , answer1: "Hier kannst du dein Wissen im 1 vs. 1 (kompetitiv     ) oder gemeinsam mit deinen Komiliton:innen (kooperativ       ) in 5 zufälligen Fragen unter Beweis stellen, wenn mal nur ein kurzer Zeit-Slot zur Verfügung steht."
        , answer2: "Einfach das gewünschte Modul auswählen und schon kann es losgehen!"
    },
    {
        question: "Was ist ein themenbasiertes Quiz?"
        , answer1: "Hier kannst du dir wertvolles Wissen entweder zu kompletten Modulen oder einzelnen Lektionen der Module allein (komperativ     ) oder gemeinsam mit deinen Komiliton:innen (kooperativ       ) aneignen."
        , answer2: "Einfach das gewünschte Modul oder die gewünschte Lektion auswählen und schon kann es losgehen!"
    },
    {
        question: "Was ist der Lernmodus?"
        , answer1: "Hier kannst du dir in gemeinsamen Lern-Sessions mit deinen Komiliton:innen wertvolles Wissen entweder zu kompletten Modulen oder einzelnen Lektionen der Module ohne Zeitdruck aneignen."
        , answer2: "Einfach das gewünschte Modul auswählen und schon kann es losgehen!"
    },
    {
        question: "Was ist ein schnelles Quiz?"
        , answer1: "Hier kannst du testen, ob du bereit bist für die Klausur. Wer von euch hat mehr von den 20 gestellten Fragen richtig beantwortet und somit die bessere Note erzielt? Schaffst du die 50%-Hürde?"
        , answer2: "Einfach das gewünschte Modul auswählen und schon kann es losgehen!"
    },
    {
        question: "Was sind kooperative Spielmodi?"
        , answer1: "Hier kannst du dir in drei verschiedenen Spielmodi gemeinsam mit Komiliton:innen Wissen aneignen."
        , answer2: "Zur Auswahl stehen dabei: Schnelles Quiz, Themenbasiertes Quiz und Lernmodus"
    },
    {
        question: "Was sind kompetitive Spielmodi?"
        , answer1: "Hier kannst du in in drei verschiedenen Spielmodi gegen deine Komiliton:innen antreten im 1 gegen 1."
        , answer2: "Zur Auswahl stehen dabei: Schnelles Quiz, Themenbasiertes Quiz und Prüfungsmodus"
    }
]);

// TODO: Legende der Symbole einbauen (wsl am besten hardcoded?)
</script>

<template>
    <div class="accordion w-100" id="faqAccordion">
        <FAQLegend />
        <div v-for="(content, index) in FAQ_CONTENT" class="accordion-item mb-2">
            <h2 class="accordion-header">
                <button type="button" class="accordion-button bg-info bg-opacity-25" data-bs-toggle="collapse"
                    :data-bs-target="'#collapse' + index">
                    <strong>
                        {{ content.question }}
                    </strong>
                </button>
            </h2>
            <div :id="'collapse' + index" class="accordion-collapse collapse bg-info bg-opacity-10">
                <div class="accordion-body">
                    {{ content.answer1 }} <br>
                    <strong>
                        {{ content.answer2 }}
                    </strong>
                </div>
            </div>
        </div>
    </div>
</template>