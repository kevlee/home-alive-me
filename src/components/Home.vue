<template>
    <v-container fluid class="fill-height">
        <v-row no-gutters>
            <v-col justify="space-between" >
                <v-card class="home" id="home"
                    color="rgba(255, 255, 255, 0.7)"
                    elevation="9"
                    height="144"
                    shaped
                    width="137">
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

    export default {
        name: 'Home',
        data: () => ({
            
        }),
        methods: {

        },
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

