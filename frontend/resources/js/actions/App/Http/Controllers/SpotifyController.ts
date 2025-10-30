import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artistId}/top-tracks'
 */
const getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.url(args, options),
    method: 'get',
})

getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.definition = {
    methods: ["get","head"],
    url: '/api/spotify/artists/{artistId}/top-tracks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artistId}/top-tracks'
 */
getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.url = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { artistId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    artistId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        artistId: args.artistId,
                }

    return getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.definition.url
            .replace('{artistId}', parsedArgs.artistId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artistId}/top-tracks'
 */
getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.get = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artistId}/top-tracks'
 */
getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.head = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artistId}/top-tracks'
 */
    const getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89dForm = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artistId}/top-tracks'
 */
        getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89dForm.get = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artistId}/top-tracks'
 */
        getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89dForm.head = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d.form = getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89dForm
    /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/admin/populate/member/{artistId}'
 */
const getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.url(args, options),
    method: 'get',
})

getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.definition = {
    methods: ["get","head"],
    url: '/api/admin/populate/member/{artistId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/admin/populate/member/{artistId}'
 */
getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.url = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { artistId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    artistId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        artistId: args.artistId,
                }

    return getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.definition.url
            .replace('{artistId}', parsedArgs.artistId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/admin/populate/member/{artistId}'
 */
getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.get = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/admin/populate/member/{artistId}'
 */
getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.head = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/admin/populate/member/{artistId}'
 */
    const getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7decaForm = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/admin/populate/member/{artistId}'
 */
        getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7decaForm.get = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/admin/populate/member/{artistId}'
 */
        getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7decaForm.head = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca.form = getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7decaForm
    /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artist}/top-tracks'
 */
const getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede = (args: { artist: string | number } | [artist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.url(args, options),
    method: 'get',
})

getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.definition = {
    methods: ["get","head"],
    url: '/api/spotify/artists/{artist}/top-tracks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artist}/top-tracks'
 */
getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.url = (args: { artist: string | number } | [artist: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { artist: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    artist: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        artist: args.artist,
                }

    return getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.definition.url
            .replace('{artist}', parsedArgs.artist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artist}/top-tracks'
 */
getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.get = (args: { artist: string | number } | [artist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artist}/top-tracks'
 */
getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.head = (args: { artist: string | number } | [artist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artist}/top-tracks'
 */
    const getArtistTopTracks1461b4b9a031eff418cd0d6409f95edeForm = (args: { artist: string | number } | [artist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artist}/top-tracks'
 */
        getArtistTopTracks1461b4b9a031eff418cd0d6409f95edeForm.get = (args: { artist: string | number } | [artist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::getArtistTopTracks
 * @see app/Http/Controllers/SpotifyController.php:105
 * @route '/api/spotify/artists/{artist}/top-tracks'
 */
        getArtistTopTracks1461b4b9a031eff418cd0d6409f95edeForm.head = (args: { artist: string | number } | [artist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede.form = getArtistTopTracks1461b4b9a031eff418cd0d6409f95edeForm

export const getArtistTopTracks = {
    '/api/spotify/artists/{artistId}/top-tracks': getArtistTopTracks83e7e9cddd0cdc8db2acb02d3596f89d,
    '/api/admin/populate/member/{artistId}': getArtistTopTracks2bfe637a3e87e8c832f519d4d4b7deca,
    '/api/spotify/artists/{artist}/top-tracks': getArtistTopTracks1461b4b9a031eff418cd0d6409f95ede,
}

/**
* @see \App\Http\Controllers\SpotifyController::searchTracks
 * @see app/Http/Controllers/SpotifyController.php:174
 * @route '/api/spotify/search'
 */
export const searchTracks = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchTracks.url(options),
    method: 'get',
})

searchTracks.definition = {
    methods: ["get","head"],
    url: '/api/spotify/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::searchTracks
 * @see app/Http/Controllers/SpotifyController.php:174
 * @route '/api/spotify/search'
 */
searchTracks.url = (options?: RouteQueryOptions) => {
    return searchTracks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::searchTracks
 * @see app/Http/Controllers/SpotifyController.php:174
 * @route '/api/spotify/search'
 */
searchTracks.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchTracks.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::searchTracks
 * @see app/Http/Controllers/SpotifyController.php:174
 * @route '/api/spotify/search'
 */
searchTracks.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchTracks.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::searchTracks
 * @see app/Http/Controllers/SpotifyController.php:174
 * @route '/api/spotify/search'
 */
    const searchTracksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: searchTracks.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::searchTracks
 * @see app/Http/Controllers/SpotifyController.php:174
 * @route '/api/spotify/search'
 */
        searchTracksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchTracks.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::searchTracks
 * @see app/Http/Controllers/SpotifyController.php:174
 * @route '/api/spotify/search'
 */
        searchTracksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchTracks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    searchTracks.form = searchTracksForm
/**
* @see \App\Http\Controllers\SpotifyController::getAlbumTracks
 * @see app/Http/Controllers/SpotifyController.php:209
 * @route '/api/spotify/albums/{albumId}/tracks'
 */
export const getAlbumTracks = (args: { albumId: string | number } | [albumId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAlbumTracks.url(args, options),
    method: 'get',
})

getAlbumTracks.definition = {
    methods: ["get","head"],
    url: '/api/spotify/albums/{albumId}/tracks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::getAlbumTracks
 * @see app/Http/Controllers/SpotifyController.php:209
 * @route '/api/spotify/albums/{albumId}/tracks'
 */
getAlbumTracks.url = (args: { albumId: string | number } | [albumId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { albumId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    albumId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        albumId: args.albumId,
                }

    return getAlbumTracks.definition.url
            .replace('{albumId}', parsedArgs.albumId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::getAlbumTracks
 * @see app/Http/Controllers/SpotifyController.php:209
 * @route '/api/spotify/albums/{albumId}/tracks'
 */
getAlbumTracks.get = (args: { albumId: string | number } | [albumId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAlbumTracks.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::getAlbumTracks
 * @see app/Http/Controllers/SpotifyController.php:209
 * @route '/api/spotify/albums/{albumId}/tracks'
 */
getAlbumTracks.head = (args: { albumId: string | number } | [albumId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAlbumTracks.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::getAlbumTracks
 * @see app/Http/Controllers/SpotifyController.php:209
 * @route '/api/spotify/albums/{albumId}/tracks'
 */
    const getAlbumTracksForm = (args: { albumId: string | number } | [albumId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAlbumTracks.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::getAlbumTracks
 * @see app/Http/Controllers/SpotifyController.php:209
 * @route '/api/spotify/albums/{albumId}/tracks'
 */
        getAlbumTracksForm.get = (args: { albumId: string | number } | [albumId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAlbumTracks.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::getAlbumTracks
 * @see app/Http/Controllers/SpotifyController.php:209
 * @route '/api/spotify/albums/{albumId}/tracks'
 */
        getAlbumTracksForm.head = (args: { albumId: string | number } | [albumId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAlbumTracks.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAlbumTracks.form = getAlbumTracksForm
/**
* @see \App\Http\Controllers\SpotifyController::getTrack
 * @see app/Http/Controllers/SpotifyController.php:282
 * @route '/api/spotify/tracks/{trackId}'
 */
export const getTrack = (args: { trackId: string | number } | [trackId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTrack.url(args, options),
    method: 'get',
})

getTrack.definition = {
    methods: ["get","head"],
    url: '/api/spotify/tracks/{trackId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::getTrack
 * @see app/Http/Controllers/SpotifyController.php:282
 * @route '/api/spotify/tracks/{trackId}'
 */
getTrack.url = (args: { trackId: string | number } | [trackId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { trackId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    trackId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        trackId: args.trackId,
                }

    return getTrack.definition.url
            .replace('{trackId}', parsedArgs.trackId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::getTrack
 * @see app/Http/Controllers/SpotifyController.php:282
 * @route '/api/spotify/tracks/{trackId}'
 */
getTrack.get = (args: { trackId: string | number } | [trackId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTrack.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::getTrack
 * @see app/Http/Controllers/SpotifyController.php:282
 * @route '/api/spotify/tracks/{trackId}'
 */
getTrack.head = (args: { trackId: string | number } | [trackId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTrack.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::getTrack
 * @see app/Http/Controllers/SpotifyController.php:282
 * @route '/api/spotify/tracks/{trackId}'
 */
    const getTrackForm = (args: { trackId: string | number } | [trackId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTrack.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::getTrack
 * @see app/Http/Controllers/SpotifyController.php:282
 * @route '/api/spotify/tracks/{trackId}'
 */
        getTrackForm.get = (args: { trackId: string | number } | [trackId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTrack.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::getTrack
 * @see app/Http/Controllers/SpotifyController.php:282
 * @route '/api/spotify/tracks/{trackId}'
 */
        getTrackForm.head = (args: { trackId: string | number } | [trackId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTrack.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTrack.form = getTrackForm
/**
* @see \App\Http\Controllers\SpotifyController::getSB19PopularTracks
 * @see app/Http/Controllers/SpotifyController.php:629
 * @route '/api/tracks/sb19/popular'
 */
export const getSB19PopularTracks = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSB19PopularTracks.url(options),
    method: 'get',
})

getSB19PopularTracks.definition = {
    methods: ["get","head"],
    url: '/api/tracks/sb19/popular',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::getSB19PopularTracks
 * @see app/Http/Controllers/SpotifyController.php:629
 * @route '/api/tracks/sb19/popular'
 */
getSB19PopularTracks.url = (options?: RouteQueryOptions) => {
    return getSB19PopularTracks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::getSB19PopularTracks
 * @see app/Http/Controllers/SpotifyController.php:629
 * @route '/api/tracks/sb19/popular'
 */
getSB19PopularTracks.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSB19PopularTracks.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::getSB19PopularTracks
 * @see app/Http/Controllers/SpotifyController.php:629
 * @route '/api/tracks/sb19/popular'
 */
getSB19PopularTracks.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSB19PopularTracks.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::getSB19PopularTracks
 * @see app/Http/Controllers/SpotifyController.php:629
 * @route '/api/tracks/sb19/popular'
 */
    const getSB19PopularTracksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getSB19PopularTracks.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::getSB19PopularTracks
 * @see app/Http/Controllers/SpotifyController.php:629
 * @route '/api/tracks/sb19/popular'
 */
        getSB19PopularTracksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSB19PopularTracks.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::getSB19PopularTracks
 * @see app/Http/Controllers/SpotifyController.php:629
 * @route '/api/tracks/sb19/popular'
 */
        getSB19PopularTracksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSB19PopularTracks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getSB19PopularTracks.form = getSB19PopularTracksForm
/**
* @see \App\Http\Controllers\SpotifyController::getMemberTracks
 * @see app/Http/Controllers/SpotifyController.php:715
 * @route '/api/tracks/member/{artistId}'
 */
export const getMemberTracks = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMemberTracks.url(args, options),
    method: 'get',
})

getMemberTracks.definition = {
    methods: ["get","head"],
    url: '/api/tracks/member/{artistId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::getMemberTracks
 * @see app/Http/Controllers/SpotifyController.php:715
 * @route '/api/tracks/member/{artistId}'
 */
getMemberTracks.url = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { artistId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    artistId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        artistId: args.artistId,
                }

    return getMemberTracks.definition.url
            .replace('{artistId}', parsedArgs.artistId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::getMemberTracks
 * @see app/Http/Controllers/SpotifyController.php:715
 * @route '/api/tracks/member/{artistId}'
 */
getMemberTracks.get = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMemberTracks.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::getMemberTracks
 * @see app/Http/Controllers/SpotifyController.php:715
 * @route '/api/tracks/member/{artistId}'
 */
getMemberTracks.head = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getMemberTracks.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::getMemberTracks
 * @see app/Http/Controllers/SpotifyController.php:715
 * @route '/api/tracks/member/{artistId}'
 */
    const getMemberTracksForm = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getMemberTracks.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::getMemberTracks
 * @see app/Http/Controllers/SpotifyController.php:715
 * @route '/api/tracks/member/{artistId}'
 */
        getMemberTracksForm.get = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMemberTracks.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::getMemberTracks
 * @see app/Http/Controllers/SpotifyController.php:715
 * @route '/api/tracks/member/{artistId}'
 */
        getMemberTracksForm.head = (args: { artistId: string | number } | [artistId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMemberTracks.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getMemberTracks.form = getMemberTracksForm
/**
* @see \App\Http\Controllers\SpotifyController::getSB19Albums
 * @see app/Http/Controllers/SpotifyController.php:758
 * @route '/api/albums/sb19'
 */
export const getSB19Albums = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSB19Albums.url(options),
    method: 'get',
})

getSB19Albums.definition = {
    methods: ["get","head"],
    url: '/api/albums/sb19',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::getSB19Albums
 * @see app/Http/Controllers/SpotifyController.php:758
 * @route '/api/albums/sb19'
 */
getSB19Albums.url = (options?: RouteQueryOptions) => {
    return getSB19Albums.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::getSB19Albums
 * @see app/Http/Controllers/SpotifyController.php:758
 * @route '/api/albums/sb19'
 */
getSB19Albums.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSB19Albums.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::getSB19Albums
 * @see app/Http/Controllers/SpotifyController.php:758
 * @route '/api/albums/sb19'
 */
getSB19Albums.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSB19Albums.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::getSB19Albums
 * @see app/Http/Controllers/SpotifyController.php:758
 * @route '/api/albums/sb19'
 */
    const getSB19AlbumsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getSB19Albums.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::getSB19Albums
 * @see app/Http/Controllers/SpotifyController.php:758
 * @route '/api/albums/sb19'
 */
        getSB19AlbumsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSB19Albums.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::getSB19Albums
 * @see app/Http/Controllers/SpotifyController.php:758
 * @route '/api/albums/sb19'
 */
        getSB19AlbumsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSB19Albums.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getSB19Albums.form = getSB19AlbumsForm
/**
* @see \App\Http\Controllers\SpotifyController::getAllTracksForRandom
 * @see app/Http/Controllers/SpotifyController.php:844
 * @route '/api/tracks/all'
 */
export const getAllTracksForRandom = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAllTracksForRandom.url(options),
    method: 'get',
})

getAllTracksForRandom.definition = {
    methods: ["get","head"],
    url: '/api/tracks/all',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::getAllTracksForRandom
 * @see app/Http/Controllers/SpotifyController.php:844
 * @route '/api/tracks/all'
 */
getAllTracksForRandom.url = (options?: RouteQueryOptions) => {
    return getAllTracksForRandom.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::getAllTracksForRandom
 * @see app/Http/Controllers/SpotifyController.php:844
 * @route '/api/tracks/all'
 */
getAllTracksForRandom.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAllTracksForRandom.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::getAllTracksForRandom
 * @see app/Http/Controllers/SpotifyController.php:844
 * @route '/api/tracks/all'
 */
getAllTracksForRandom.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAllTracksForRandom.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::getAllTracksForRandom
 * @see app/Http/Controllers/SpotifyController.php:844
 * @route '/api/tracks/all'
 */
    const getAllTracksForRandomForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getAllTracksForRandom.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::getAllTracksForRandom
 * @see app/Http/Controllers/SpotifyController.php:844
 * @route '/api/tracks/all'
 */
        getAllTracksForRandomForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAllTracksForRandom.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::getAllTracksForRandom
 * @see app/Http/Controllers/SpotifyController.php:844
 * @route '/api/tracks/all'
 */
        getAllTracksForRandomForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getAllTracksForRandom.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getAllTracksForRandom.form = getAllTracksForRandomForm
/**
* @see \App\Http\Controllers\SpotifyController::populateSB19Data
 * @see app/Http/Controllers/SpotifyController.php:780
 * @route '/api/admin/populate/sb19'
 */
export const populateSB19Data = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: populateSB19Data.url(options),
    method: 'get',
})

populateSB19Data.definition = {
    methods: ["get","head"],
    url: '/api/admin/populate/sb19',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::populateSB19Data
 * @see app/Http/Controllers/SpotifyController.php:780
 * @route '/api/admin/populate/sb19'
 */
populateSB19Data.url = (options?: RouteQueryOptions) => {
    return populateSB19Data.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::populateSB19Data
 * @see app/Http/Controllers/SpotifyController.php:780
 * @route '/api/admin/populate/sb19'
 */
populateSB19Data.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: populateSB19Data.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::populateSB19Data
 * @see app/Http/Controllers/SpotifyController.php:780
 * @route '/api/admin/populate/sb19'
 */
populateSB19Data.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: populateSB19Data.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::populateSB19Data
 * @see app/Http/Controllers/SpotifyController.php:780
 * @route '/api/admin/populate/sb19'
 */
    const populateSB19DataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: populateSB19Data.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::populateSB19Data
 * @see app/Http/Controllers/SpotifyController.php:780
 * @route '/api/admin/populate/sb19'
 */
        populateSB19DataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: populateSB19Data.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::populateSB19Data
 * @see app/Http/Controllers/SpotifyController.php:780
 * @route '/api/admin/populate/sb19'
 */
        populateSB19DataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: populateSB19Data.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    populateSB19Data.form = populateSB19DataForm
/**
* @see \App\Http\Controllers\SpotifyController::redirectToSpotify
 * @see app/Http/Controllers/SpotifyController.php:18
 * @route '/auth/spotify/redirect'
 */
export const redirectToSpotify = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToSpotify.url(options),
    method: 'get',
})

redirectToSpotify.definition = {
    methods: ["get","head"],
    url: '/auth/spotify/redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::redirectToSpotify
 * @see app/Http/Controllers/SpotifyController.php:18
 * @route '/auth/spotify/redirect'
 */
redirectToSpotify.url = (options?: RouteQueryOptions) => {
    return redirectToSpotify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::redirectToSpotify
 * @see app/Http/Controllers/SpotifyController.php:18
 * @route '/auth/spotify/redirect'
 */
redirectToSpotify.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToSpotify.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::redirectToSpotify
 * @see app/Http/Controllers/SpotifyController.php:18
 * @route '/auth/spotify/redirect'
 */
redirectToSpotify.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToSpotify.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::redirectToSpotify
 * @see app/Http/Controllers/SpotifyController.php:18
 * @route '/auth/spotify/redirect'
 */
    const redirectToSpotifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirectToSpotify.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::redirectToSpotify
 * @see app/Http/Controllers/SpotifyController.php:18
 * @route '/auth/spotify/redirect'
 */
        redirectToSpotifyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirectToSpotify.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::redirectToSpotify
 * @see app/Http/Controllers/SpotifyController.php:18
 * @route '/auth/spotify/redirect'
 */
        redirectToSpotifyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirectToSpotify.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirectToSpotify.form = redirectToSpotifyForm
/**
* @see \App\Http\Controllers\SpotifyController::handleSpotifyCallback
 * @see app/Http/Controllers/SpotifyController.php:36
 * @route '/auth/spotify/callback'
 */
export const handleSpotifyCallback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleSpotifyCallback.url(options),
    method: 'get',
})

handleSpotifyCallback.definition = {
    methods: ["get","head"],
    url: '/auth/spotify/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SpotifyController::handleSpotifyCallback
 * @see app/Http/Controllers/SpotifyController.php:36
 * @route '/auth/spotify/callback'
 */
handleSpotifyCallback.url = (options?: RouteQueryOptions) => {
    return handleSpotifyCallback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SpotifyController::handleSpotifyCallback
 * @see app/Http/Controllers/SpotifyController.php:36
 * @route '/auth/spotify/callback'
 */
handleSpotifyCallback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleSpotifyCallback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SpotifyController::handleSpotifyCallback
 * @see app/Http/Controllers/SpotifyController.php:36
 * @route '/auth/spotify/callback'
 */
handleSpotifyCallback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: handleSpotifyCallback.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SpotifyController::handleSpotifyCallback
 * @see app/Http/Controllers/SpotifyController.php:36
 * @route '/auth/spotify/callback'
 */
    const handleSpotifyCallbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: handleSpotifyCallback.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SpotifyController::handleSpotifyCallback
 * @see app/Http/Controllers/SpotifyController.php:36
 * @route '/auth/spotify/callback'
 */
        handleSpotifyCallbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: handleSpotifyCallback.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SpotifyController::handleSpotifyCallback
 * @see app/Http/Controllers/SpotifyController.php:36
 * @route '/auth/spotify/callback'
 */
        handleSpotifyCallbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: handleSpotifyCallback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    handleSpotifyCallback.form = handleSpotifyCallbackForm
const SpotifyController = { getArtistTopTracks, searchTracks, getAlbumTracks, getTrack, getSB19PopularTracks, getMemberTracks, getSB19Albums, getAllTracksForRandom, populateSB19Data, redirectToSpotify, handleSpotifyCallback }

export default SpotifyController