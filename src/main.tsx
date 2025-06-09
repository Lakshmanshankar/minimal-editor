import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './typography.css';
import './color.css';
import App from './App.tsx';

import { ThemeProvider } from '@/provider/theme.tsx';
import { TopNavbar } from '@/components/core/top-navbar.tsx';
import { AppFooter } from '@/components/core/footer.tsx';

export default App;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TopNavbar />
            <App />
            <AppFooter />
        </ThemeProvider>
    </StrictMode>
);
