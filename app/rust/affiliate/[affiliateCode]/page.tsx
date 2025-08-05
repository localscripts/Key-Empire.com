import AffiliateClient from "./AffiliateClient"

export async function generateStaticParams() {
  const affiliateCodes = ["majster"]

  return affiliateCodes.map(code => ({
    affiliateCode: code,
  }))
}

export default function AffiliatePage({ params }: { params: { affiliateCode: string } }) {
  return <AffiliateClient affiliateCode={params.affiliateCode} />
}
