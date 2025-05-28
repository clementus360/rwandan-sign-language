// Simple timestamp formatting function in Kinyarwanda
export const formatTimestamp = (isoString: string): string => {
    const now = new Date(); // Current time: 09:50 PM CAT on May 27, 2025
    const postDate = new Date(isoString);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000); // Convert ms to minutes
    const diffHours = Math.floor(diffMs / 3600000); // Convert ms to hours

    if (diffMinutes < 60) {
        return diffMinutes === 0 ? 'None aha' : `hashize ${diffMinutes === 1 ? 'umunota' : 'iminota'} ${diffMinutes}`;
    } else if (diffHours < 24) {
        return `hashize ${diffHours === 1 ? 'isaha' : 'amasaha'} ${diffHours}`;
    } else {
        const day = postDate.getDate();
        const month = ['Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicurasi', 'Kamena', 'Nyakanga', 'Kanama', 'Nzeli', 'Ukwakira', 'Ugushyingo', 'Ukuboza'][postDate.getMonth()];
        return `${day} ${month}`;
    }
};