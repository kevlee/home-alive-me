<template>
    <div id="app">
        <v-app>
            <background />
            <configsidebar />
            <v-main>
                <router-view></router-view>
            </v-main>
            <v-bottom-navigation grow :background-color="color" v-model="value" shift dark >
                    <v-btn to="/homepage/">
                        <v-icon>fas fa-home</v-icon>
                    </v-btn >
                    <v-btn to="/stats/">
                        <v-icon>fas fa-chart-line</v-icon>
                    </v-btn >
            </v-bottom-navigation>
        </v-app>
    </div>

</template>

<script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>

<script>
    import configsidebar from "./components/configsidebar.vue"
    import * as tools from '../lib/tools.js'
    import background from "./components/background.vue";

    export default {
        name: 'App',
        data: () => {
            return {
                theme: 'blue',
                value: 0
            }
        },
        components: {
            configsidebar,
            background
        },
        mounted: async function () {
            await tools.getallmodules()
        },
        computed: {
            color () {
                switch (this.value) {
                    case 0: return 'blue darken-2'
                    case 1: return 'teal darken-1'
                    default: return 'blue darken-2'
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "~vue-material/dist/theme/engine";

    @include md-register-theme("bottom-bar-blue", (
        primary: md-get-palette-color(blue, 800)
    ));

    @include md-register-theme("bottom-bar-green", (
        primary: md-get-palette-color(green, 800)
    ));
    @import "~vue-material/dist/theme/all";


</style>

<style>
    @import url("https://fonts.googleapis.com/css?family=Material+Icons");
    @import url("https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900");
    @import url("https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css");

    #app {
        margin: 0px;
        padding: 0px;
    }

    body {
        margin: 0px;
    }

    html.md-theme-default {
        overflow-y: hidden;
    }

    #navbar {
        display: inline-flex;
        align-items: flex-end;
        overflow: hidden;
        position: absolute;
        bottom: 0px;
        width: 100%;
        z-index: 1000;
    }

    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: #e6e6e6;
        border-left: 1px solid #dadada;
    }

    ::-webkit-scrollbar-thumb {
        background: #757575;
        border: solid 1px #e6e6e6;
        border-radius: 10px;
    }


    
</style>

