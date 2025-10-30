import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
 * @see routes/web.php:9
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:9
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:9
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:9
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:9
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:9
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:9
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
 * @see routes/web.php:10
 * @route '/members'
 */
export const members = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: members.url(options),
    method: 'get',
})

members.definition = {
    methods: ["get","head"],
    url: '/members',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:10
 * @route '/members'
 */
members.url = (options?: RouteQueryOptions) => {
    return members.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:10
 * @route '/members'
 */
members.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: members.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:10
 * @route '/members'
 */
members.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: members.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:10
 * @route '/members'
 */
    const membersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: members.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:10
 * @route '/members'
 */
        membersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: members.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:10
 * @route '/members'
 */
        membersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: members.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    members.form = membersForm
/**
 * @see routes/web.php:11
 * @route '/about'
 */
export const about = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})

about.definition = {
    methods: ["get","head"],
    url: '/about',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:11
 * @route '/about'
 */
about.url = (options?: RouteQueryOptions) => {
    return about.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:11
 * @route '/about'
 */
about.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:11
 * @route '/about'
 */
about.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: about.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:11
 * @route '/about'
 */
    const aboutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: about.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:11
 * @route '/about'
 */
        aboutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: about.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:11
 * @route '/about'
 */
        aboutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: about.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    about.form = aboutForm
/**
 * @see routes/web.php:12
 * @route '/random-song'
 */
export const randomSong = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: randomSong.url(options),
    method: 'get',
})

randomSong.definition = {
    methods: ["get","head"],
    url: '/random-song',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:12
 * @route '/random-song'
 */
randomSong.url = (options?: RouteQueryOptions) => {
    return randomSong.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:12
 * @route '/random-song'
 */
randomSong.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: randomSong.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:12
 * @route '/random-song'
 */
randomSong.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: randomSong.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:12
 * @route '/random-song'
 */
    const randomSongForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: randomSong.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:12
 * @route '/random-song'
 */
        randomSongForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: randomSong.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:12
 * @route '/random-song'
 */
        randomSongForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: randomSong.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    randomSong.form = randomSongForm
/**
 * @see routes/web.php:15
 * @route '/SpotifyIdFinder'
 */
export const spotifyIdFinder = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: spotifyIdFinder.url(options),
    method: 'get',
})

spotifyIdFinder.definition = {
    methods: ["get","head"],
    url: '/SpotifyIdFinder',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:15
 * @route '/SpotifyIdFinder'
 */
spotifyIdFinder.url = (options?: RouteQueryOptions) => {
    return spotifyIdFinder.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:15
 * @route '/SpotifyIdFinder'
 */
spotifyIdFinder.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: spotifyIdFinder.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:15
 * @route '/SpotifyIdFinder'
 */
spotifyIdFinder.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: spotifyIdFinder.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:15
 * @route '/SpotifyIdFinder'
 */
    const spotifyIdFinderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: spotifyIdFinder.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:15
 * @route '/SpotifyIdFinder'
 */
        spotifyIdFinderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: spotifyIdFinder.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:15
 * @route '/SpotifyIdFinder'
 */
        spotifyIdFinderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: spotifyIdFinder.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    spotifyIdFinder.form = spotifyIdFinderForm
/**
 * @see routes/web.php:16
 * @route '/PreviewTest'
 */
export const previewTest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewTest.url(options),
    method: 'get',
})

previewTest.definition = {
    methods: ["get","head"],
    url: '/PreviewTest',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:16
 * @route '/PreviewTest'
 */
previewTest.url = (options?: RouteQueryOptions) => {
    return previewTest.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:16
 * @route '/PreviewTest'
 */
previewTest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewTest.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:16
 * @route '/PreviewTest'
 */
previewTest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewTest.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:16
 * @route '/PreviewTest'
 */
    const previewTestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewTest.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:16
 * @route '/PreviewTest'
 */
        previewTestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewTest.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:16
 * @route '/PreviewTest'
 */
        previewTestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewTest.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewTest.form = previewTestForm
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\RegisteredUserController::register
 * @see app/Http/Controllers/Auth/RegisteredUserController.php:21
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::login
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:20
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:45
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:45
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:45
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:45
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\AuthenticatedSessionController::logout
 * @see app/Http/Controllers/Auth/AuthenticatedSessionController.php:45
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm