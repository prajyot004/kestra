<template>
    <el-collapse v-model="expanded" class="mt-3 collapse">
        <el-collapse-item
            v-for="(item, index) in props.items"
            :key="index"
            :name="item.title"
            :title="`${item.title}${item.elements ? ` (${item.elements.length})` : ''}`"
            :class="{creation: props.creation}"
        >
            <template v-if="creation" #icon>
                <Creation :section="item.title" />
            </template>

            <template v-if="creation">
                <Element
                    v-for="(element, elementIndex) in item.elements"
                    :key="elementIndex"
                    :section="item.title"
                    :element
                    @remove-element="removeElement(item.title, elementIndex)"
                />
            </template>

            <slot name="content" />
        </el-collapse-item>
    </el-collapse>
</template>

<script setup lang="ts">
    import {nextTick, PropType, ref} from "vue";

    import {CollapseItem} from "../../utils/types";

    import Creation from "./buttons/Creation.vue";
    import Element from "./Element.vue";

    const emits = defineEmits(["remove"]);

    const props = defineProps({
        items: {
            type: Array as PropType<CollapseItem[]>,
            required: true,
        },
        flow: {type: String, default: undefined},
        creation: {type: Boolean, default: false},
    });
    const expanded = ref<CollapseItem["title"][]>([]);

    if (props.creation) {
        props.items.forEach((item) => {
            if (item.elements?.length) expanded.value.push(item.title);
        });
    }

    import YamlUtils from "../../../../utils/yamlUtils";
    const removeElement = (title: string, index: number) => {
        props.items.forEach((item) => {
            if (item.title === title) {
                nextTick(() => {
                    const ID = item.elements?.[index].id;

                    item.elements?.splice(index, 1);
                    emits(
                        "remove",
                        YamlUtils.deleteTask(props.flow, ID, title.toUpperCase()),
                    );
                    expanded.value = expanded.value.filter((v) => v !== title);
                });
            }
        });
    };
</script>

<style scoped lang="scss">
@import "../../styles/code.scss";

.collapse {
    & * {
        font-size: $code-font-sm;
    }

    :deep(*) {
        --el-collapse-header-bg-color: initial;
        --el-collapse-header-text-color: #{$code-gray-700};
        --el-collapse-content-bg-color: initial;

        .el-collapse-item__header,
        .el-collapse-item__content {
            padding: 0.5rem 0;
        }

        .el-collapse-item__header {
            justify-content: space-between;

            &.is-active {
                color: $code-primary;
            }
        }
    }
}
</style>
