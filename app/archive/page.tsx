import { redirect } from 'next/navigation';

/**
 * /archive has no index — the archive lives on the homepage.
 * Redirect anyone who lands here rather than showing a 404.
 */
export default function ArchivePage() {
    redirect('/');
}
