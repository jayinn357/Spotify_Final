import SpotifyController from './SpotifyController'
import Settings from './Settings'
import Auth from './Auth'
const Controllers = {
    SpotifyController: Object.assign(SpotifyController, SpotifyController),
Settings: Object.assign(Settings, Settings),
Auth: Object.assign(Auth, Auth),
}

export default Controllers