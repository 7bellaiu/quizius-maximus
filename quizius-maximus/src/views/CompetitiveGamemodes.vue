<script setup>
import GamemodeCard from '@/components/gamemodes/gamemodeCard.vue';

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
        description: "COMING SOON",
        type: "comp",
        isPlayable: false
    },
    {
        title: "Lernmodus",
        description: "COMING SOON",
        type: "comp",
        isPlayable: false
    }
];
</script>

<template>
    <main>
        <section class="album py-3 container">
            <div class="row">
                <h2 class="text-center">Welchen der <span class="text-danger">kompetitiven</span> Spielmodi möchtest du spielen?</h2>
            </div>
            <div class="row justify-content-center">
                <GamemodeCard v-for="comp_gamemode in COMP_GAMEMODES" :gamemode-title="comp_gamemode.title"
                    :gamemode-description="comp_gamemode.description"
                    :gamemode-type="comp_gamemode.type"
                    :gamemode-is-playable="comp_gamemode.isPlayable" />
            </div>
        </section>
    </main>
</template>