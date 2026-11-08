import {
  GENERATION_UNIT_COPY,
  PRICE_PRO,
  PRICE_STARTER,
  PRICING_GRANDFATHER_NOTE,
  PRO_QUOTA,
  STARTER_QUOTA,
} from '@/config/seo-site';

export function PricingTable() {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-border border-b">
              <th scope="col" className="px-3 py-2 font-semibold">
                Plan
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Price
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Generations / month
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Includes
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-border border-b">
              <th scope="row" className="px-3 py-2 font-medium">
                Starter
              </th>
              <td className="px-3 py-2">{PRICE_STARTER}</td>
              <td className="px-3 py-2">{STARTER_QUOTA}</td>
              <td className="px-3 py-2">
                720P standard, no watermark, commercial license. 1080P counts as
                2 generations
              </td>
            </tr>
            <tr className="border-border border-b">
              <th scope="row" className="px-3 py-2 font-medium">
                Pro
              </th>
              <td className="px-3 py-2">{PRICE_PRO}</td>
              <td className="px-3 py-2">{PRO_QUOTA}</td>
              <td className="px-3 py-2">1080P and a priority queue</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground mt-4 text-sm leading-6">
        {GENERATION_UNIT_COPY}
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        {PRICING_GRANDFATHER_NOTE}
      </p>
    </div>
  );
}
