<template>
    <div class="home" id="home">
        <background />

        <div id="myconfigsidebar">
            <configsidebar />
        </div>
        <div id="homebutton">
            <md-button class="md-icon-button md-raised">
                <md-icon class="md-size-5x">home</md-icon>
            </md-button>
        </div>
        <div id="stats">
            <md-button class="md-icon-button md-raised">
                <md-icon class="md-size-5x">bar_chart</md-icon>
            </md-button>
        </div>
    </div>
</template>

<script>

    import background from "./background.vue";
    import configsidebar from "./configsidebar.vue"


    export default {
        name: 'Home',
        props: {
            msg: String
        },
        components: {
            background,
            configsidebar
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    #homebutton {
        display: flex;
        top: 40%;
        left: 10%;
        height:20%;
        width:12%;
        z-index: 2;
        position:fixed;
    }
    #stats {
        display: flex;
        top: 40%;
        left: 40%;
        height: 20%;
        width: 12%;
        z-index: 2;
        position: fixed;
    }
    #myconfigsidebar {
        display: flex;
        flex-direction: row-reverse;
        z-index: 1200;
    }
    .md-button{
        width:100%;
        height:100%;
    }
    .md-icon {
        width: 100%;
        height: 100%;
        font-size:100%;
        text-size-adjust:100%;
        line-height:100%;
    }
    .md-button-content {
        width: 100%;
        height: 100%;
    }

</style>

