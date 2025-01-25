import {Breadcrumb, Component} from "../components/code/utils/types";

interface State {
    breadcrumbs: Breadcrumb[];
    panel: Component;
}

export default {
    namespaced: true,
    state: (): State => ({
        breadcrumbs: [],
        panel: undefined,
    }),
    mutations: {
        addBreadcrumbs(
            state: State,
            {
                breadcrumb,
                position,
            }: { breadcrumb: Breadcrumb; position: number },
        ) {
            state.breadcrumbs[position] = breadcrumb;
        },
        removeBreadcrumb(
            state: State,
            {position, last = false}: { position: number; last?: boolean },
        ) {
            if (last) {
                state.breadcrumbs.pop();
            } else {
                state.breadcrumbs = state.breadcrumbs.slice(0, position + 1);
            }
        },
        clearBreadcrumbs(state: State) {
            state.breadcrumbs = [];
        },
        setPanel(state: State, panel: Component) {
            state.panel = panel;
        },
        unsetPanel(state: State) {
            state.panel = undefined;
        },
    },
};
