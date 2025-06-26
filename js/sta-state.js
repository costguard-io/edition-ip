stateTagApp['state'] = {
    sta: {
        undo: {
            delay: 5,
            timeoutId: null,
            reject: null
        }
    },
    ai: {
        activated: 0
    },

    notification: {
        model: 'none',
        id: 0
    },
    rolex: null,
    epoch: {
        mode: ['date', 'range'][0],
        start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 1 year ago as YYYY-MM-DD
        end: new Date().toISOString().slice(0, 10) // today as YYYY-MM-DD
    },
    langpack: {
        options: {
            en: 'English'
        },
        selected: 'en',
        uiux: {
            filters: 'Filters',
            search: 'Search',
            submit: 'Submit',
        },
        numberCurrency: ['receipt', 'project'][0],
        numberFormat: '#,###.##'
    },
    currencies: {
        selected: 'USD',
        options: ['USD', 'EUR']
    },
    nav: {
        /*project: false,*/
        builder: false,
        camera: false,
        microphone: false,
        team: false,
        export: false,
        passwordReset: false,
        passwordSet: false,
    },
    user: {
        id: null,
        first_name: '',
        last_name: '',
        email: '',
        lang: 'en',
        token: '',
    },
    passwordReset: {
        token: '',
        email: '',
        password: '',
        password_confirmation: '',
    },
    license: {},
    stripe: {
        subscription: {
            name: '',
            status: '',
            paidOn: {
                date: '',
                amount: '',
                status: '',
            },
            until: ''
        },
        card: {
            last4: '',
            brand: '',
            exp: '',
        }
    },
    project: {
        id: null,
        name: '',
        language: 'en',
        currency: '',
        numberFormat: '#,###.##',
        budget: null, // null implies an ongoing project
        error: '',
    },
    projects: [],
    receipt: {},
    receipts: [],
    exports: [],
    team: [],
    searches: [],
    errors: {
        builder: '',
        projects: '',
        license: '',
        team: '',
        user: '',
        modal: '',
    },
    builder: {
        files: [],
    },
    camera: {
        auto: 0,
        landscape: false,
        endpoint: null,
        currency: false,
        batch: null,
    },
    microphone: {
        endpoint: null,
        instruction: ''
    },
    badges: {
        inbox: 0,
    },
    pie: [
        {value: 0},
        {value: 75},
        {value: 55},
    ],
    barchart: {
        flags: {
            budget: 110,
            spend: 10,
            due: 0,
            spendDue: 0,
        },

        bars: [
            {time: 'Stage 1', amount: 30},
            {time: 'Stage 2', amount: 40},
            {time: 'Stage 3', amount: 55},
        ]
    },

    modal: {
        content: {
            header: '',
            body: '',
            image: '',
            images: [],
        },
        options: {
            x: true,
            backdrop: true,
            keyboard: true
        }
    }

};

function initGlobalStateWatchers(stateObserver) {
    let notificationQueueInterval = null;

    stateObserver.watch(
        function (state) {
            return state.user.token;
        },
        function (fresh, stale) {
            if (_.isEmpty(fresh)) {
                stateTagApp.commands.clear('stripe');
                stateTagApp.commands.showLogin()
            } else {
                //stateTagApp.commands.hideModal();
            }
        }
    );

    stateObserver.watch(
        function (state) {
            return state.passwordReset.token;
        },
        function (fresh, stale) {
            if (!_.isEmpty(fresh)) {
                stateTagApp.commands.showPasswordReset();
            } else {
                //stateTagApp.commands.hideModal();
            }
        }
    );

    stateObserver.watch(
        function (state) {
            return state.nav.passwordSet;
        },
        function (fresh, stale) {
            //console.log('passwordSet', fresh, stale);
            if (fresh) {
                stateTagApp.commands.showPasswordSet();
            } else {
                stateTagApp.commands.hideModal();
            }
        }
    );


    // List of error loci to watch
    let errors = Object.keys(stateTagApp.$read('errors'));

    errors.forEach((errorPath) => {
        let locus = 'errors.'.concat(errorPath);
        stateObserver.watch(
            function (state) {
                return _.get(state, locus); // Use lodash to access nested property by path
            },
            function (fresh, stale) {
                //console.log(fresh, stale);
                if (!_.isEmpty(fresh)) {
                    setTimeout(() => {
                        stateTagApp.$write(locus, '');
                    }, 5000);
                }
            }
        );
    });

    stateObserver.watch(
        function (state) {
            return state.nav.camera;
        },
        function (fresh, stale) {
            if (_.isString(fresh)) {
                stateTagApp.$write('camera.endpoint', fresh);
                stateTagApp.$write('nav.camera', true);
            }
        }
    );

    stateObserver.watch(
        function (state) {
            return state.nav.microphone;
        },
        function (fresh, stale) {
            if (_.isString(fresh)) {
                stateTagApp.$write('microphone.endpoint', fresh);
                stateTagApp.$write('nav.microphone', true);
            }
        }
    );

    stateObserver.watch(
        function (state) {
            return state.langpack.selected;
        },
        function (fresh, stale) {
            stateTagApp.$write('user.lang', fresh);
        }
    );
}
