import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { MusicProvider } from './contexts/MusicContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './router';

// Initialize theme on app load
initializeTheme();

// Render the app
const rootElement = document.getElementById('app');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <AuthProvider>
            <MusicProvider>
                <AppRouter />
            </MusicProvider>
        </AuthProvider>
    );
}
