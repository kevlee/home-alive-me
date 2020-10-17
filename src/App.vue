<template>
    <div id="app">
        <Home/>
    </div>
</template>

<script>
    import Home from './components/Home.vue';

    export default {
        name: 'app',
        components: {
            Home
        }
    };
</script>

<style>
    @import url("https://fonts.googleapis.com/css?family=Material+Icons");
    #app {
        margin: 0px;
        padding: 0px;
    }
    body{
        margin: 0px;
    }
</style>

