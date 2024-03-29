import NewsletterSignup from '../components/NewsletterSignup';
import PageContent from './PageContent';

function NewsletterPage() {
    return (
        <PageContent title="Join our awesome newsletter!">
            <NewsletterSignup />
        </PageContent>
    );
}

export default NewsletterPage;

export async function action({ request }) {
    const data = await request.formData();
    const email = data.get('email');

    // send to backend newsletter server ...
    return { message: 'Signup successful!' };
}