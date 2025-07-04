import { Helmet } from 'react-helmet-async';

const DefaultMeta = () => (
    <Helmet>
        <title>FastCar - Thuê xe dễ dàng và tiện lợi</title>
        <meta name="description" content="Ứng dụng thuê xe hiện đại, an toàn và nhanh chóng." />
        <meta property="og:title" content="FastCar - Thuê xe dễ dàng" />
        <meta property="og:description" content="Thuê xe chất lượng cao chỉ với vài cú click!" />
    </Helmet>
);

export default DefaultMeta;
