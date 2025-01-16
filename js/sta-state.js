stateTagApp['state'] = {
    sta: {}, //required & reserved

    rolex: null,
    scope: {
        mode: ['date', 'range'][0],
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: new Date() // today
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
        }
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
        budget: null, // null implies an ongoing project
        error: '',
    },
    receipts: [
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        },
        {
            "receiptId": "R-12345",
            "photo": "//placehold.co/200x700",
            "storeName": "Ferretería El Tornillo",
            "date": "2025-01-12",
            "currency": "MXN",
            "indicators": {
                "irrelevant": false,
                "excessive": true,
                "duplicate": false,
                "suspicious": false,
                "noncompliant": true
            },
            "items": [
                {
                    "original": {
                        "en": "Quarter-inch PVC pipe",
                        "es": "Tubo de PVC de un cuarto de pulgada"
                    },
                    "description": {
                        "en": "A small-diameter PVC pipe commonly used for plumbing and electrical conduit",
                        "es": "Un tubo de PVC de diámetro pequeño, comúnmente utilizado en plomería y tuberías eléctricas"
                    },
                    "indicators": [
                        "noncompliant"
                    ],
                    "units": 3,
                    "price": 50.00
                },
                {
                    "original": {
                        "en": "Electrical tape",
                        "es": "Cinta aislante"
                    },
                    "description": {
                        "en": "An adhesive tape used to insulate wires and cables",
                        "es": "Una cinta adhesiva utilizada para aislar cables y alambres"
                    },
                    "units": 2,
                    "price": 25.50
                },
                {
                    "original": {
                        "en": "Concrete drill bit",
                        "es": "Broca para concreto"
                    },
                    "description": {
                        "en": "A specialized drill bit designed for drilling into concrete, brick, or masonry",
                        "es": "Una broca especializada para perforar concreto, ladrillo o mampostería"
                    },
                    "indicators": [
                        "excessive"
                    ],
                    "units": 1,
                    "price": 100.00
                }
            ],
            "totalAmount": 175.50,
            "summary": {
                "en": "Various plumbing and electrical supplies, plus a tool for concrete drilling.",
                "es": "Varios suministros de plomería y electricidad, además de una herramienta para perforar concreto."
            }
        }
    ],

    team: [],
    projects: [],
    errors: {
        builder: '',
        projects: '',
        license: '',
        team: '',
        modal: '',
    },
    builder: {
        files: [],
    },
    camera: {
        auto: 0,
        landscape: false,
        endpoint: null,
    },
    microphone: {
        endpoint: null,
    },
    badges: {
        inbox: 0,
    },
    pie: [
        {value: 10, color: '#cdcdcd'},
        {value: 25},
        {value: 25},
        {value: 25},
    ],

    ratio: {
        budget: 1000000,
        spend: 300000,
        percent: 30
    },
    barchart: {
        indicators: {
            budget: 0,
            spend: 0,
            due: 0,
            spendDue: 0,
        },

        bars: [
            {time: 'Stage 1', amount: 0},
            {time: 'Stage 2', amount: 0},
            {time: 'Stage 3', amount: 0},
        ]
    },

    modal: {
        content: {
            header: "",
            body: ""
        },
        options: {
            x: true,
            backdrop: true,
            keyboard: true
        }
    }

};

function initGlobalStateWatchers(stateObserver) {

    stateObserver.watch(
        function (state) {
            return state.user.token;
        },
        function (fresh, stale) {
            if (_.isEmpty(fresh)) {
                stateTagApp.commands.clear('stripe');
                stateTagApp.commands.showLogin()
            } else {
                stateTagApp.commands.hideModal();
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
            console.log('passwordSet', fresh, stale);
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
                console.log(fresh, stale);
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
}
