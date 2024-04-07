
//const CACHE_NAME= 'cache-1';

const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';

const CACHE_INMUTABLE_NAME = 'inmutable-v1'

self.addEventListener('install', e=>{

    const cachePromesa = caches.open(CACHE_STATIC_NAME)
        .then(cache=>{

            cache.addAll([
                '/',
                '/index.html',
                '/js/app.js',
                '/js/base.js'
            ]);
        });
            const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME)
                .then(cache=>cache.add('/js/pouchdb-nightly.js')
            );

    e.waitUntil(Promise.all([cachePromesa,cacheInmutable]));
}); 

self.addEventListener('fetch', e=>{

    //Cache with network fallback
    
    const respuesta = caches.match(e.request)
    .then(res=>{

        if (res) return res;
        //No existe y va internet 
        console.log('No existe', e.request.url);

        return fetch(e.request).then(newResp=>{
            caches.open(CACHE_DYNAMIC_NAME)
                .then(cache=>{
                    cache.put(e.request, newResp);
                });
            return newResp.clone();
        });
    });

    e.respondWith(respuesta);

    //Cache-only
    //e.respondWith(caches.match(e.request));

});