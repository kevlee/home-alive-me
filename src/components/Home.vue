<template>
    <div class="home" id="home">
        <background />
    </div>
</template>

<script>
    import background from "./background.vue";
    

    //import('./themes')

    export default {
        name: 'Home',
        data: () => ({
            theme: 'green'
        }),
        methods: {
            toblue() {
                this.theme = blue
            },
            togreen() {
                this.theme = green
            }

        },
        components: {
            background,
        }
    };
</script>

<style lang="scss">

</style>
    -->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    #homebutton {
        display: flex;
        top: 40%;
        left: 10%;
        height: 20%;
        width: 12%;
        z-index: 2;
        position: fixed;
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

    .md-button {
        width: 100%;
        height: 100%;
    }

    .md-icon {
        width: 100%;
        height: 100%;
        font-size: 100%;
        text-size-adjust: 100%;
        line-height: 100%;
    }

    .md-button-content {
        width: 100%;
        height: 100%;
    }


</style>

