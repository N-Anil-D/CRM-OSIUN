self.addEventListener('push', (event) => {
    const title = data.title || 'Osius CRM';
    const options = {
        body: data.body || 'Er zijn meldingen die je hebt gemist.',
        icon: './img/logo.png',
        badge: './img/logo.png'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
