stateTagApp["commands"] = {
    openCamera: function () {
        if(stateTagApp.$read('project.status') !== 'active'){
            alert(stateTagApp.$translate('instructions.project-rendering'));
            return;
        }

        stateTagApp.$write('camera.currency', true);
        stateTagApp.$write(
            'nav.camera',
            endPoints.receipts.store.replace(
                '{project}',
                stateTagApp.$read('project.id')
            )
        );
    },

    setEventContext: function (context) {
        stateTagApp.$write('sta.context', context);
        return stateTagApp.$read('sta.context');
    },

    getEventContext: function () {
        return stateTagApp.$read('sta.context');
    },

    clear: function (key) {
        if (_.isUndefined(key)) {
            stateTagApp.$execute('resetState')
        } else {
            stateTagApp.$execute('resetState', key)
        }
    },

    reset: function () {
        stateTagApp.$execute('resetApp')
    },

    showModal: function (header, body, options = {}) {
        options = {...stateTagApp.$read('modal.options'), ...options};
        stateTagApp.$write('modal.options', options);
        stateTagApp.$write('modal.content.header', header);
        //stateTagApp.$write('modal.content.footer', error);
        stateTagApp.$write('modal.content.body', body);
    },

    hideModal: function () {
        this.clear('modal');
        this.clear('errors.modal')
    },

    showLogin: function () {
        this.clear('user');
        let header = 'login';
        let body = '<x-login></x-login>';
        this.showModal(header, body, {x: false});
    },

    showPasswordReset: function () {
        this.clear('user');
        let header = 'password-reset';
        let body = '<x-password-reset></x-password-reset>';
        this.showModal(header, body);
    },

    showPasswordSet: function () {

        let header = 'password-set';
        let body = '<x-password-set></x-password-set>';
        this.showModal(header, body);
    },

    newProject: function () {
        let header = 'new-project';
        let body = '<x-project></x-project>';
        this.clear('builder.files');
        console.log(stateTagApp.$read('builder.files'))
        this.showModal(header, body, {x: true});
    }
};

function receiveStateTagAppBroadcast(message) {
    let staMessage;
    try {
        staMessage = JSON.parse(message.data);
    } catch (e) {
        return;
    }
    if (_.isUndefined(staMessage.app) || staMessage.app != 'stateTagApp'.concat(':').concat(stateTagApp.namespace)) {
        return;
    }

    /**
     * HANDLERS
     * You can respond to stateTagApp events here.
     */
    stateTagApp.log(staMessage);

    if (staMessage.event === 401) { // token-expired
        stateTagApp.commands.clear('user')
        //stateTagApp.$write('user.token', '');
    }

    if (staMessage.event === 'stripe-required') {

    }

    // handle login-success broadcast
    if (staMessage.event === 'login-success') {
        const jwt = staMessage.token;
        const user = staMessage.user;

        localStorage.setItem('jwt_token', jwt);
        localStorage.setItem('user', JSON.stringify(user));

        if (typeof setupPush === 'function') {
            setupPush(jwt);
        }
    }
}

stateTagApp["$broadcast"] = function (data) {
    let desired = ['app', 'type', 'from', 'event'];
    let required = [];

    data['app'] = 'stateTagApp'.concat(':').concat(stateTagApp.namespace);

    if (!_.isNull(stateTagApp.$read('sta.context'))) {
        data['context'] = stateTagApp.$read('sta.context');
    }

    staValidateStaEvent(data, desired, console.log);
    if (staValidateStaEvent(data, required, function (msg) {
        alert(msg);
    })) {
        window.parent.postMessage(JSON.stringify(data), '*');
    }
}

function staValidateStaEvent(data, spec, onFailCallback) {

    for (let r of spec) {
        if (_.isEmpty(data[r]) && !_.isNumber(data[r])) {
            let msg = 'Missing staMessage element: '
                .concat(r)
                .concat(' in ')
                .concat(JSON.stringify(data));

            if (_.isFunction(onFailCallback)) {
                onFailCallback(msg);
            }

            return false;
        }
    }

    return true;
}

function staBindEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, eventHandler);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    staBindEvent(window, "message", receiveStateTagAppBroadcast);
});

