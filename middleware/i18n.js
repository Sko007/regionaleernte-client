export default function ({ isHMR, app, store }) {

    if (isHMR) { // ignore if called from hot module replacement
        return;
    }

    if (store) {
        app.i18n.locale = store.state.locale;
    }
};