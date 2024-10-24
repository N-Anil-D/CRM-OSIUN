export function timeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return interval === 1 ? `${interval} year ago` : `${interval} jaren geleden`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval === 1 ? `${interval} month ago` : `${interval} maanden geleden`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval === 1 ? `${interval} day ago` : `${interval} dagen geleden`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval === 1 ? `${interval} hour ago` : `${interval} uren geleden`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval === 1 ? `${interval} minute ago` : `${interval} minuten geleden`;
    }
    return seconds < 10 ? `zojuist` : `${seconds} seconden geleden`;
}
