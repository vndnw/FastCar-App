// components/Meta.jsx
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description }) => (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
    </Helmet>
);

export default Meta;
