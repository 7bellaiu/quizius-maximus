<script setup>

</script>

<template>
    <main>
        <!-- Entwurf: Aktuelle Frage -->
        <section class="album py-3 container">
            <!-- Fortschritt -->
            <div class="row row-cols-1 mx-2 my-2">
                <div class="col text-center text-body-secondary">
                    <p>
                        <strong>Spielmodus</strong>
                        <br>
                        <small>Frage # von #</small>
                    </p>
                </div>
            </div>
            <!-- Frage -->
            <div class="row row-cols-1 mx-2 mt-2">
                <div class="col">
                    <div class="card border-primary bg-primary text-white">
                        <div class="card-body">
                            <p class="card-text">Frage</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Antwortoptionen -->
            <div class="row row-cols-2 mx-2 mt-2">
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-primary">
                            <div class="card-body">
                                <p class="card-text">Option 1</p>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-primary">
                            <div class="card-body">
                                <p class="card-text">Option 2</p>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-primary">
                            <div class="card-body">
                                <p class="card-text">Option 3</p>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-primary">
                            <div class="card-body">
                                <p class="card-text">Option 4</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Button: "Nächste Frage" -->
            <div class="row row-cols-1 mx-2 mt-2">
                <div class="col w-100 d-flex justify-content-end">
                    <button class="btn btn-secondary">Nächste Frage</button>
                </div>
            </div>
        </section>

        <!-- Entwurf: Antwort richtig -->
        <section class="album py-3 container">
            <!-- Fortschritt -->
            <div class="row row-cols-1 mx-2 my-2">
                <div class="col text-center text-body-secondary">
                    <p>
                        <strong>Spielmodus</strong>
                        <br>
                        <small>Frage # von #</small>
                    </p>
                </div>
            </div>
            <!-- Frage -->
            <div class="row row-cols-1 mx-2 mt-2">
                <div class="col">
                    <div class="card border-primary bg-primary text-white">
                        <div class="card-body">
                            <p class="card-text">Frage</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Antwortoptionen -->
            <div class="row row-cols-2 mx-2 mt-2">
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-secondary text-secondary">
                            <div class="card-body">
                                <p class="card-text">Option 1</p>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-success text-success">
                            <div class="card-body">
                                <p class="card-text"><strong>Option 2</strong></p>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-secondary text-secondary">
                            <div class="card-body">
                                <p class="card-text">Option 3</p>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-secondary text-secondary">
                            <div class="card-body">
                                <p class="card-text">Option 4</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Nachricht: Sehr gut -->
            <div class="row row-cols-1 mx-2 my-2">
                <div class="col text-center text-body-secondary">
                    <p class="text-success">
                        <strong>Sehr gut</strong> - <small>du hast die korrekte Antwort gewählt!</small>
                    </p>
                </div>
            </div>

            <!-- Button: "Nächste Frage" -->
            <div class="row row-cols-1 mx-2 mt-2">
                <div class="col w-100 d-flex justify-content-end">
                    <button class="btn btn-secondary">Nächste Frage</button>
                </div>
            </div>
        </section>

        <!-- Entwurf: Antwort falsch -->
        <section class="album py-3 container">
            <!-- Fortschritt -->
            <div class="row row-cols-1 mx-2 my-2">
                <div class="col text-center text-body-secondary">
                    <p>
                        <strong>Spielmodus</strong>
                        <br>
                        <small>Frage # von #</small>
                    </p>
                </div>
            </div>
            <!-- Frage -->
            <div class="row row-cols-1 mx-2 mt-2">
                <div class="col">
                    <div class="card border-primary bg-primary text-white">
                        <div class="card-body">
                            <p class="card-text">Frage</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Antwortoptionen -->
            <div class="row row-cols-2 mx-2 mt-2">
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-secondary text-secondary">
                            <div class="card-body">
                                <p class="card-text">Option 1</p>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-success text-success">
                            <div class="card-body">
                                <p class="card-text"><strong>Option 2</strong></p>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card border-secondary text-secondary">
                            <div class="card-body">
                                <p class="card-text">Option 3</p>
                            </div>
                        </div>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn p-0 my-1 w-100" @click="">
                        <div class="card bg-danger text-white">
                            <div class="card-body">
                                <p class="card-text">Option 4</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Nachricht: Schade -->
            <div class="row row-cols-1 mx-2 my-2">
                <div class="col text-center text-body-secondary">
                    <p class="text-danger">
                        <strong>Leider falsch</strong> - <small>du hast dich bestimmt nur verklickt!</small>
                    </p>
                </div>
            </div>

            <!-- Button: "Nächste Frage" -->
            <div class="row row-cols-1 mx-2 mt-2">
                <div class="col w-100 d-flex justify-content-end">
                    <button class="btn btn-secondary">Nächste Frage</button>
                </div>
            </div>
        </section>
    </main>
</template>