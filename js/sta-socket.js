function initGlobalSocketWatchers() {
    stateTagApp['socketIo'].emit('subscribe', {channel: 'public-ui-channel'});

    stateTagApp.$onSocket('connect', (socket)=>{
        console.log('connected to socket:', stateTagApp['socketIo'].id);
    });


    stateTagApp.$onSocket('ProjectTouched', function(event, payload){
        payload = (payload && payload.message) || {};

    });

}
