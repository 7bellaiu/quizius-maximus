<script setup>
import GamemodeCard from '@/components/gamemodes/GamemodeCard.vue';

const props = defineProps({
    moduleId: {
        type: String,
        required: true,
    },
    moduleShortname: {
        type: String,
        required: true,
    },
    moduleLongname: {
        type: String,
        required: true
    }
});

// TODO: Beschreibungen sind noch für Coop => Comp !!!
const COMP_GAMEMODES = [
    {
        title: "Schnelles Quiz",
        description: "Hier kannst du dein Wissen gemeinsam mit deinen Komiliton:innen unter Beweis stellen, wenn ihr mal nur einen kurzen Zeit-Slot zur Verfügung habt - 5 zufällige Fragen.",
        type: "comp",
        isPlayable: true
    },
    {
        title: "Themenbasiertes Quiz",
        description: "Hier kannst du dir wertvolles Wissen entweder zu kompletten Modulen oder einzelnen Lektionen der Module gemeinsam mit deinen Komiliton:innen aneignen. Schafft ihr es, die 50%-Hürde zu erreichen?",
        type: "comp",
        isPlayable: false
    },
    {
        title: "Lernmodus",
        description: "Hier kannst du dir wertvolles Wissen entweder zu kompletten Modulen oder einzelnen Lektionen der Module gemeinsam mit deinen Komiliton:innen aneignen. In diesem Modus habt ihr weder Zeitdruck, noch eine bestimmte zu erreichende Punktzahl.",
        type: "comp",
        isPlayable: false
    }
];
</script>

<template>
    <main>
        <section class="album py-3 container">
            <div class="row">
                <h2 class="text-center">Welchen der <span class="text-danger">kompetitiven</span> Spielmodi möchtest du
                    spielen?</h2>
            </div>
            <div class="row justify-content-center mx-1">
                <GamemodeCard v-for="comp_gamemode in COMP_GAMEMODES" :module-id="props.moduleId"
                    :module-shortname="props.moduleShortname" :module-longname="props.moduleLongname"
                    :gamemode-title="comp_gamemode.title" :gamemode-description="comp_gamemode.description"
                    :gamemode-type="comp_gamemode.type" :gamemode-is-playable="comp_gamemode.isPlayable" />
            </div>
        </section>
    </main>
</template>