<template>
    <div class="stats" id="stats">
        <background />
        <tempchart></tempchart>
    </div>
</template>

<script>
    import background from "./background.vue";
    import tempchart from "./tempchart.vue";


    export default {
        name: 'stats',
        props: {
            msg: String
        },
        components: {
            background,
            tempchart
        }
    };

</script>

<style scoped>
    #tempchart {
        display: flex;
        left: 10%;
        height: 30%;
        width: 30%;
        z-index: 2;
        position: fixed;
    }

</style>