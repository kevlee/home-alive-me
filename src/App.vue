<template>
    <div id="app">
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
    </div>
    
</template>

<script>
    import configsidebar from "./components/configsidebar.vue"
    export default {
        name: 'App',
        data: () => {
            return {
                theme: 'green'
            }
        },
        components: {
            configsidebar
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
    #app {
        margin: 0px;
        padding: 0px;
    }

    body {
        margin: 0px;
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
        right:0px;
        z-index: 1200;
    }
</style>

