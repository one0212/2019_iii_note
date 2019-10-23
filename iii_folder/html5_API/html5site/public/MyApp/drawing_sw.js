var cacheName = "drawing_v1"
self.addEventListener("install",function(event){
    event.waitUntil(
        caches.open(cacheName).then(function(cache){
            var url_files = [
                '/MyApp/',
                '/MyApp/Drawing.html',
                '/MyApp/Drawing.css',
                '/MyApp/Drawing.js',
                '/MyApp/drawing_sw.js',
            ]
            return cache.addAll(url_files);
        })
    )
})
self.addEventListener("fetch",function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            if(response){
                return response;
            }
            return fetch(event.request);
        })
    )
})
self.addEventListener("activate",function(event){
    event.waitUntil(
        caches.keys().then(function(names){
            Promise.all(names.map(function(name){
                if(name != cacheName){
                    return caches.delete(name);
                }
            }))
        })
    )
})