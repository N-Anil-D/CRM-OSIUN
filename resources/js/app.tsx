import './bootstrap';
import '../css/app.css';
import '../css/all.min.css'
import '../css/bootstrap.css'
import '../css/bootstrap-datetimepicker.min.css'
import '../css/bootstrap.min.css'
import '../css/ckeditor.css'
import '../css/dataTables.bootstrap4.min.css'
import '../css/feather.css'
import '../css/fullcalendar.min.css'
import '../css/line-awesome.min.css'
import '../css/material.css'
import '../css/owl.carousel.min.css'
import '../css/select2.min.css'
import '../css/CameraComponent.css'
import '../css/PhotoGallery.css'
import '../scss/main.scss'
import '../css/ticketMain.css'
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'ag-grid-community/styles/ag-grid.css';  // AG Grid ana stili
import 'ag-grid-community/styles/ag-theme-quartz.css';  // Tema stili (quartz)



import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import axios from 'axios';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        if (import.meta.env.DEV) {
            createRoot(el).render(
                <App {...props} />);
            return
        }

        hydrateRoot(el, <App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
