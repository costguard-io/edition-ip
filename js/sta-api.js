const endPoints = {
    languages: 'api/languages',
    languagePack: 'api/language-pack?pack={pack}&lang={lang}',
    login: 'api/login',
    currencies: 'api/currencies',
    search: {
        users: 'api/search/users?q={query}',
        receipts: 'api/search/projects/{project}/receipts',
        history: 'api/search/projects/{project}/history',
        results: 'api/search/projects/{project}/history/{search}'
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

// const isSecureEndpoint = (endpoint) => {
//     // Convert the secure endpoints into a list of regular expressions
//     const securePatterns = endPoints.secure.map(pattern =>
//         new RegExp(`^${pattern.replace(/{[^}]+}/g, '[^/]+')}$`)
//     );
//
//     // Check if the endpoint matches any of the patterns
//     return securePatterns.some(regex => regex.test(endpoint));
// };


// const isSecureEndpoint = (endpoint) => {
//     // Normalize endpoint to ensure no trailing or leading slashes
//     endpoint = endpoint.replace(/^\/|\/$/g, '');
//
//     // Convert secure endpoints into regex patterns
//     const securePatterns = endPoints.secure.map(pattern =>
//         new RegExp(`^${pattern.replace(/^\//, '').replace(/\/$/, '').replace(/{[^}]+}/g, '[^/]+')}$`)
//     );
//
//     console.log('Secure patterns:', securePatterns);
//     console.log('Checking endpoint:', endpoint);
//
//     // Check if the endpoint matches any of the secure patterns
//     const isSecure = securePatterns.some(regex => regex.test(endpoint));
//     console.log(`Endpoint "${endpoint}" is secure:`, isSecure);
//     return isSecure;
// };


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

    // console.log('Secure patterns:', securePatterns);
    // console.log('Checking endpoint:', endpoint);

    const isSecure = securePatterns.some(regex => regex.test(endpoint));
    //console.log(`Endpoint "${endpoint}" is secure:`, isSecure);
    return isSecure;
};
