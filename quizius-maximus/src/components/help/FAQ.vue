<!-- TODO: Icons in Text einbinden und Text-Struktur ggfs. anpassen -->
<script setup>
import { ref } from 'vue';
import FAQLegend from './FAQLegend.vue';

const FAQ_CONTENT = ref([
    {
        // TODO: Hier die Icons einbauen -> KI fragen
        question: "Wie kann ich meinen Benutzernamen ändern?"
        , answer1: "Deinen Benutzernamen kannst du jederzeit ganz einfach in deinem Profil ändern."
        , answer2: "Klicke einfach auf 'Mein Profil' und anschließend auf 'Benutzername ändern'."
    },
    {
        question: "Wie kann ich mein Passwort ändern?"
        , answer1: "Dein Passwort kannst du jederzeit ganz einfach in deinem Profil ändern."
        , answer2: "Klicke einfach auf 'Mein Profil' und anschließend auf 'Passwort ändern'."
    },
    {
        question: "Wo finde ich Statistiken?"
        , answer1: "In deinem Profil findest du sowohl eine Statistik deiner Quizze, die unterteilt in kooperativ und kompetitiv jeweils anzeigt, wie viele Fragen richtig und falsch beantwortet wurden, als auch eine Rangliste der 10 besten Spieler:innen."
    },
    {
        question: "Wie lösche ich mein Benutzerkonto?"
        , answer1: "Falls du dein Benutzerkonto löschen möchtest melde dich gerne bei uns über das Kontaktformular mit einer kurzen Begründung, warum wird dein Konto löschen sollen."
        , answer3: "Den Rest übernehmen wir für dich :)"
    },
    {
        question: "Was sind Fragenkataloge?",
        answer1: "Fragenkataloge sind Sammlungen von Fragen zu den jeweiligen Modulen.",
        answer3: "<br>In der Übersicht 'Fragenkataloge' hast du die Möglichkeit,",
        answer4: "<strong>-</strong> einen <strong>neuen Fragenkatalog zu erstellen</strong>",
        answer5: "<strong>- Fragenkataloge anzuzeigen</strong>, um die darin enthaltenen Fragen anzusehen",
        answer6: "<strong>- Fragenkataloge zu bearbeiten</strong>, zur Anpassung von bestehenden Fragenkatalogen sowie",
        answer7: "<strong>- Fragenkataloge zu löschen</strong>"
    },
    {
        question: "Wie starte ich ein Quiz?"
        , answer1: "Zur Übersichtsseite mit all unseren verfügbaren Quizzen kommst du über die Startseite, indem du auf den Button 'Quiz starten' klickst oder über das Burger-Menü 'Quiz starten' auswählst."
        , answer2: "Dann einfach dein gewünschtes Modul anklicken, den gewünschten Spielmodus auswählen und schon geht es los :)"
    },
    {
        question: "Wo finde ich meine laufenden Quizze?"
        , answer1: "Einen Überblick über deine laufenden Quizze findest du bereits auf der Startseite in der Box 'Meine Quizze'."
        , answer3: "Zur Übersichtsseite mit all deinen laufenden Quizzen kommst du über die Startseite, indem du auf die Box 'Meine Quizze' klickst oder über das Burger-Menü 'Meine Quizze' auswählst."
    },
    {
        question: "Was sind kompetitive Spielmodi?",
        answer1: "Hier kannst du in in drei verschiedenen Spielmodi gegen deine Komiliton:innen antreten im 1 gegen 1.",
        answer3: "<br>Zur Auswahl stehen dabei:",
        answer4: "<strong>-</strong> Schnelles Quiz",
        answer5: "<strong>-</strong> Themenbasiertes Quiz",
        answer6: "<strong>-</strong> Prüfungssimulation",
    },
    {
        question: "Was sind kooperative Spielmodi?",
        answer1: "Hier kannst du dir in drei verschiedenen Spielmodi gemeinsam mit Komiliton:innen Wissen aneignen.",
        answer3: "<br>Zur Auswahl stehen dabei:",
        answer4: "<strong>-</strong> Schnelles Quiz",
        answer5: "<strong>-</strong> Themenbasiertes Quiz",
        answer6: "<strong>-</strong> Lernmodus",
    },
    {
        question: "Was ist ein schnelles Quiz?"
        , answer1: "Hier kannst du dein Wissen im 1 vs. 1 (kompetitiv) oder gemeinsam mit deinen Komiliton:innen (kooperativ) in 5 zufälligen Fragen unter Beweis stellen, wenn mal nur ein kurzer Zeit-Slot zur Verfügung steht."
        , answer2: "Einfach das gewünschte Modul auswählen und schon kann es losgehen!"
    },
    {
        question: "Was ist ein themenbasiertes Quiz?"
        , answer1: "Hier kannst du dir wertvolles Wissen entweder zu kompletten Modulen oder einzelnen Lektionen der Module allein (kompetitiv) oder gemeinsam mit deinen Komiliton:innen (kooperativ) aneignen."
        , answer2: "Einfach das gewünschte Modul auswählen und schon kann es losgehen!"
    },
    {
        question: "Was ist der Lernmodus?"
        , answer1: "Hier kannst du dir in gemeinsamen Lern-Sessions mit deinen Komiliton:innen wertvolles Wissen entweder zu kompletten Modulen oder einzelnen Lektionen der Module ohne Zeitdruck aneignen."
        , answer2: "Einfach das gewünschte Modul auswählen und schon kann es losgehen!"
    },
    {
        question: "Was ist die Prüfungssimulation?"
        , answer1: "Hier kannst du testen, ob du bereit bist für die Klausur. Wer von euch hat mehr von den 20 gestellten Fragen richtig beantwortet und somit die bessere Note erzielt? Schaffst du die 50%-Hürde?"
        , answer2: "Einfach das gewünschte Modul auswählen und schon kann es losgehen!"
    },
]);

// TODO: Legende der Symbole einbauen (wsl am besten hardcoded?)
</script>

<template>
    <div class="accordion w-100" id="faqAccordion">
        <FAQLegend />
        <div v-for="(content, index) in FAQ_CONTENT" class="accordion-item mb-2">
            <h2 class="accordion-header">
                <button type="button" class="accordion-button collapsed bg-info bg-opacity-25" data-bs-toggle="collapse"
                    :data-bs-target="'#collapse' + index">
                    <strong>
                        {{ content.question }}
                    </strong>
                </button>
            </h2>
            <div :id="'collapse' + index" class="accordion-collapse collapse bg-info bg-opacity-10">
                <div class="accordion-body">
                    <span v-if="content.answer1">{{ content.answer1 }}</span>
                    <span
                        v-if="content.answer1 && (content.answer3 || content.answer4 || content.answer5 || content.answer6 || content.answer7 || content.answer2)"><br></span>

                    <span v-if="content.answer3" v-html="content.answer3"></span>
                    <span
                        v-if="content.answer3 && (content.answer4 || content.answer5 || content.answer6 || content.answer7 || content.answer2)"><br></span>

                    <span v-if="content.answer4" v-html="content.answer4"></span>
                    <span
                        v-if="content.answer4 && (content.answer5 || content.answer6 || content.answer7 || content.answer2)"><br></span>

                    <span v-if="content.answer5" v-html="content.answer5"></span>
                    <span v-if="content.answer5 && (content.answer6 || content.answer7 || content.answer2)"><br></span>

                    <span v-if="content.answer6" v-html="content.answer6"></span>
                    <span v-if="content.answer6 && (content.answer7 || content.answer2)"><br></span>

                    <span v-if="content.answer7" v-html="content.answer7"></span>
                    <span v-if="content.answer7 && content.answer2"><br></span>

                    <span v-if="content.answer2"><strong>{{ content.answer2 }}</strong></span>
                </div>
            </div>
        </div>
    </div>
</template>