import {
    isObj
} from '../common/utils';
const defaultOptions = {
    type: 'text',
    mask: false,
    message: '',
    show: true,
    zIndex: 1000,
    duration: 3000,
    position: 'middle',
    forbidClick: false,
    loadingType: 'circular',
    selector: '#van-toast'
};
let queue = [];
let currentOptions = Object.assign({}, defaultOptions);

function parseOptions(message) {
    return isObj(message) ? message : {
        message
    };
}

function getContext() {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
}

function Toast(toastOptions) {
    // console.error(toastOptions, 'toastOptions');
    wx.showToast({
        title: toastOptions,
        icon: 'none',
        duration: toastOptions.duration || 50000
    })
    // const options = Object.assign({}, currentOptions, parseOptions(toastOptions));
    // const context = options.context || getContext();
    // const toast = context.selectComponent(options.selector);
    // if (!toast) {
    //     console.warn('未找到 van-toast 节点，请确认 selector 及 context 是否正确');
    //     return;
    // }
    // delete options.context;
    // delete options.selector;
    // toast.clear = () => {
    //     toast.set({
    //         show: false
    //     });
    //     if (options.onClose) {
    //         options.onClose();
    //     }
    // };
    // queue.push(toast);
    // toast.set(options);
    // clearTimeout(toast.timer);
    // if (options.duration > 0) {
    //     toast.timer = setTimeout(() => {
    //         toast.clear();
    //         queue = queue.filter(item => item !== toast);
    //     }, options.duration);
    // }
    // return toast;
}
const createMethod = type => (options) => Toast(Object.assign({
    type
}, parseOptions(options)));
Toast.loading = (e) => {
    // console.error(e, 'wewe');
    wx.showLoading({
        title: e.message,
        mask: e.mask || false,
        duration: e.duration || 5000,
    })
};
Toast.success = createMethod('success');
Toast.fail = createMethod('fail');
Toast.clear = () => {
    wx.hideLoading();
    // queue.forEach(toast => {
    //     toast.clear();
    // });
    // queue = [];
};
Toast.setDefaultOptions = (options) => {
    Object.assign(currentOptions, options);
};
Toast.resetDefaultOptions = () => {
    currentOptions = Object.assign({}, defaultOptions);
};
export default Toast;