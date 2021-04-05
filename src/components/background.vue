<template>
    <div id="background" :style="image"/>
</template>

<script>

    export default {
        name: 'Background',
        data() {
            return {
                image: {
                    backgroundImage: 'url(' + require('../assets/images/background.png') + ')'
                }
            };
        },
    };
</script>

<style scoped>


    #background {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 0;
    }
</style>