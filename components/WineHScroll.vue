<template>
    <div class="hscroll">
        <div class="prev" @click="prev"></div>
        <slot></slot>
        <div class="next" @click="next"></div>
    </div>
</template>

<script>
export default {
    name: 'WineHScroll',
    methods: {
        prev() {
            const row = this.$el.getElementsByClassName('wine')[0];
            row.scrollLeft = row.scrollLeft - row.offsetWidth;
        },
        next() {
            const row = this.$el.getElementsByClassName('wine')[0];
            row.scrollLeft = row.scrollLeft + row.offsetWidth;
        }
    },
    mounted(){
    }
}
</script>

<style lang="scss" scoped>
    .hscroll {
        position: relative;
        background-color: #191A1C;
        margin-bottom: 20px;
        .wine {
            clear: both;
            display: flex;
            flex-wrap: nowrap;
            overflow: hidden;
            scroll-behavior: smooth;
            margin: 0;
        }
    }
    .next,.prev {
        cursor: pointer;
        position: absolute;
        background-color: #08aae7;
        top: 50%;
        z-index: 70;
        background: url('../assets/images/paging_small.svg') 50% no-repeat;
        background-size: cover;
        width: 31px;
        height: 62px;
        margin-top: -31px
    }

    .next {
        right: 0;
        transform: rotate(180deg)
    }

    .prev {
        left: 0
    }
</style>
