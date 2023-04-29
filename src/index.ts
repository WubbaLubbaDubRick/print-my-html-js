import Vue from 'vue';
import { VueConstructor } from 'vue/types/vue';
import { iframePrint } from './utils/viewIframe';

const install = (Vue: VueConstructor) => {
    Vue.directive('print-html', {
        bind: function (el, binding) {
            el.onclick = async function () {
                // 需要获取binding中绑定的dom id来获取需要打印的dom
                await iframePrint(binding);
            }
        },
        // unbind(el, binding, vnode) {}
        unbind() {}
    })
};

if (typeof window !== 'undefined' && Vue) {
    install(<VueConstructor>Vue);
}

export default {
    install,
};
