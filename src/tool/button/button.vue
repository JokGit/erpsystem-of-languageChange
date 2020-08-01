<template>
    <button class="myButton" :style="{lineHeight:height,fontSize:fontSize}" v-on="listeners" :disabled='disabled'>
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'myButton',
    props: {
        height: String,
        fontSize: String,
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isQuickClick: false
        }
    },
    methods: {
        
    },
    computed: {
        listeners() {
            let _this = this
            return Object.assign(
                {},
                this.$listeners,
                {
                    click: function() {
                        if(_this.isQuickClick) return
                        _this.$emit('click')
                        _this.isQuickClick = true
                        setTimeout(res => {
                            _this.isQuickClick = false
                        },300)
                    }
                }
            )
        }
    }
}
</script>

<style>
.myButton {
    line-height: 32px;
    background: #0079FE;
    font-size: 12px;
    padding: 0 20px;
    outline: none;
    box-shadow: none;
    border: none;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    margin-left: 5px;
    white-space: nowrap;
}

button.myButton[disabled='disabled'] {
    background: #ccc;
}

.myButton:hover {
    background: #3597ff;
}

.myButton:first-of-type {
    margin-left: 0px;
}


</style>