<template>
    <div id="app">
        <v-app>
            <div id="myconfigsidebar">
                <configsidebar />
            </div>
            <router-view></router-view>
            <div id="navbar">
                <md-bottom-bar md-type="shift" md-sync-route :md-theme="'bottom-bar-' + theme" md-fixed>
                    <md-bottom-bar-item to="/homepage/" exact md-label="Home" md-icon="home" @click.native="theme = 'blue'"></md-bottom-bar-item>
                    <md-bottom-bar-item to="/stats/" exact md-label="stats" md-icon="bar_chart" @click.native="theme = 'green'"></md-bottom-bar-item>
                </md-bottom-bar>
            </div>
        </v-app>
    </div>

</template>

<script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>

<script>
    import configsidebar from "./components/configsidebar.vue"
    import * as tools from '../lib/tools.js'
    export default {
        name: 'App',
        data: () => {
            return {
                theme: 'blue'
            }
        },
        components: {
            configsidebar
        },
        mounted: async function () {
            await tools.getallmodules()
        }
    };
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

    #myconfigsidebar {
        display: flex;
        flex-direction: row-reverse;
        position: absolute;
        right: 0px;
        z-index: 1200;
    }

    ::-webkit-scrollbar {
        height: 10px;
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

