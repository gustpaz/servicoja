import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonical?: string
}

export function SEO({ title, description, canonical }: SEOProps) {
  return (
    <Head>
      <title>{title} | ServiçoJá</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="ServiçoJá" />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Head>
  )
}

