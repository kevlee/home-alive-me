<template>
    <div id="background" :style="image"/>
</template>

<script>

    export default {
        name: 'Background',
        data() {
            return {
                image: {
                    backgroundImage: 'url(' + require('../assets/images/background.png') + ')',
                }
            };
        },
    };
</script>

<style scoped>


    #background {
        background-size: contain;
        background: no-repeat;
        min-width: 100%;
        min-height: 100%;
        position: absolute;
        z-index: 1;
    }
</style>