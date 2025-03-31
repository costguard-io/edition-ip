const endPoints = {
    languages: 'api/languages',
    languagePack: 'api/language-pack?pack={pack}&lang={lang}',
    login: 'api/login',
    currencies: 'api/currencies',
    search: {
        users: 'api/search/users?q={query}',
        receipts: 'api/search/projects/{project}/receipts',
        history: 'api/search/projects/{project}/history',
        results: 'api/search/projects/{project}/history/{search}',
        delete: 'api/search/projects/{project}/history/{search}',
        redo: 'api/search/projects/{project}/history/{search}'
    },
    charts: {
        pie: 'api/projects/{project}/pie',
        bar: 'api/projects/{project}/bar',
    },
    password: {
        set: 'api/password/set',
        forgot: 'api/password/forgot',
        reset: 'api/password/reset'
    },
    member: {
        creditCard: 'api/stripe',
        updateCreditCard: 'api/stripe',
        cancelMembership: 'api/stripe',
        upgradeOptions: 'api/stripe/plans',
        changePlan: 'api/stripe/plan',
        license: 'api/license',
        changeLanguage: 'api/language'
    },
    permissions: {
        grant: 'api/projects/{project}/team/{member}',
        revoke: 'api/projects/{project}/team/{member}',
        teammate: 'api/projects/{project}/team'
    },
    projects: {
        store: 'api/projects',
        list: 'api/projects',
        update: 'api/projects/{project}',
        delete: 'api/projects/{project}',
        team: 'api/projects/{project}/team',
    },
    files: {
        store: 'api/projects/{project}/files',
        list: 'api/projects/{project}/files',
        delete: 'api/projects/{project}/files/{file}',
        process: 'api/projects/{project}/process',
    },
    receipts: {
        store: 'api/projects/{project}/receipts',
        list: 'api/projects/{project}/receipts',
        delete: 'api/projects/{project}/receipts/{receipt}',
        update: 'api/projects/{project}/receipts/{receipt}'
        //detail: 'api/projects/{project}/receipts/{receipt}'
    }
};

endPoints.secure = [
    ...Object.values(endPoints.charts),
    ...Object.values(endPoints.projects),
    ...Object.values(endPoints.files),
    ...Object.values(endPoints.receipts),
    ...Object.values(endPoints.member),
    ...Object.values(endPoints.search),
    ...Object.values(endPoints.permissions),
];


const isSecureEndpoint = (endpoint) => {
    // Remove query parameters from the endpoint
    endpoint = endpoint.split('?')[0].replace(/^\/|\/$/g, '');

    // Convert secure endpoints into regex patterns, also removing query parts
    const securePatterns = endPoints.secure.map(pattern => {
        // Remove query parameters from each stored pattern
        const normalizedPattern = pattern.split('?')[0].replace(/^\/|\/$/g, '');
        return new RegExp(
            '^' + normalizedPattern.replace(/{[^}]+}/g, '[^/]+') + '$'
        );
    });

    return securePatterns.some(regex => regex.test(endpoint));
};
