import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import CSLS from "../../../tools/cs_local_storage"
import { 
  GET_REVENUE_TOTAL_QUERY, 
  GET_REVENUE_SUBTOTAL_QUERY, 
  GET_REVENUE_TAX_QUERY,
  GET_REVENUE_TOTAL_CLASSPASSES_QUERY,
  GET_REVENUE_SUBTOTAL_CLASSPASSES_QUERY,
  GET_REVENUE_TAX_CLASSPASSES_QUERY,
  GET_REVENUE_TOTAL_EVENT_TICKETS_QUERY,
  GET_REVENUE_SUBTOTAL_EVENT_TICKETS_QUERY,
  GET_REVENUE_TAX_EVENT_TICKETS_QUERY,
  GET_REVENUE_TOTAL_OTHER_QUERY,
  GET_REVENUE_SUBTOTAL_OTHER_QUERY,
  GET_REVENUE_TAX_OTHER_QUERY,
  GET_REVENUE_TOTAL_SUBSCRIPTIONS_QUERY, 
  GET_REVENUE_SUBTOTAL_SUBSCRIPTIONS_QUERY, 
  GET_REVENUE_TAX_SUBSCRIPTIONS_QUERY
} from './queries'
import InsightRevenueBase from './InsightRevenueBase'
import InsightRevenueDisplay from './InsightRevenueDisplay'

function InsightRevenue ({ t, history }) {
  const year = localStorage.getItem(CSLS.INSIGHT_REVENUE_YEAR)

  // Total
  const { 
    loading: loadingTotal, 
    error: errorTotal, 
    data: dataTotal,
    refetch: refetchTotal
   } = useQuery(GET_REVENUE_TOTAL_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingSubtotal, 
    error: errorSubtotal, 
    data: dataSubtotal,
    refetch: refetchSubtotal
   } = useQuery(GET_REVENUE_SUBTOTAL_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingTax, 
    error: errorTax, 
    data: dataTax,
    refetch: refetchTax
   } = useQuery(GET_REVENUE_TAX_QUERY, {
    variables: { year: year }
  })

  // Classpasses
  const { 
    loading: loadingTotalPasses, 
    error: errorTotalPasses, 
    data: dataTotalPasses,
    refetch: refetchTotalPasses
   } = useQuery(GET_REVENUE_TOTAL_CLASSPASSES_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingSubtotalPasses, 
    error: errorSubtotalPasses, 
    data: dataSubtotalPasses,
    refetch: refetchSubtotalPasses
   } = useQuery(GET_REVENUE_SUBTOTAL_CLASSPASSES_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingTaxPasses, 
    error: errorTaxPasses, 
    data: dataTaxPasses,
    refetch: refetchTaxPasses
   } = useQuery(GET_REVENUE_TAX_CLASSPASSES_QUERY, {
    variables: { year: year }
  })

  // Subscriptions
  const { 
    loading: loadingTotalSubs, 
    error: errorTotalSubs, 
    data: dataTotalSubs,
    refetch: refetchTotalSubs
   } = useQuery(GET_REVENUE_TOTAL_SUBSCRIPTIONS_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingSubtotalSubs, 
    error: errorSubtotalSubs, 
    data: dataSubtotalSubs,
    refetch: refetchSubtotalSubs
   } = useQuery(GET_REVENUE_SUBTOTAL_SUBSCRIPTIONS_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingTaxSubs, 
    error: errorTaxSubs, 
    data: dataTaxSubs,
    refetch: refetchTaxSubs
   } = useQuery(GET_REVENUE_TAX_SUBSCRIPTIONS_QUERY, {
    variables: { year: year }
  })

  // Event tickets
  const { 
    loading: loadingTotalTickets, 
    error: errorTotalTickets, 
    data: dataTotalTickets,
    refetch: refetchTotalTickets
   } = useQuery(GET_REVENUE_TOTAL_EVENT_TICKETS_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingSubtotalTickets, 
    error: errorSubtotalTickets, 
    data: dataSubtotalTickets,
    refetch: refetchSubtotalTickets
   } = useQuery(GET_REVENUE_SUBTOTAL_EVENT_TICKETS_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingTaxTickets, 
    error: errorTaxTickets, 
    data: dataTaxTickets,
    refetch: refetchTaxTickets
   } = useQuery(GET_REVENUE_TAX_EVENT_TICKETS_QUERY, {
    variables: { year: year }
  })

  // other
  const { 
    loading: loadingTotalOther, 
    error: errorTotalOther, 
    data: dataTotalOther,
    refetch: refetchTotalOther
   } = useQuery(GET_REVENUE_TOTAL_OTHER_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingSubtotalOther, 
    error: errorSubtotalOther, 
    data: dataSubtotalOther,
    refetch: refetchSubtotalOther
   } = useQuery(GET_REVENUE_SUBTOTAL_OTHER_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingTaxOther, 
    error: errorTaxOther, 
    data: dataTaxOther,
    refetch: refetchTaxOther
   } = useQuery(GET_REVENUE_TAX_OTHER_QUERY, {
    variables: { year: year }
  })

  function refetchData(year) {
    // Total
    refetchTotal({year: year})
    refetchSubtotal({year: year})
    refetchTax({year: year})
    // Classpasses
    refetchTotalPasses({year: year})
    refetchSubtotalPasses({year: year})
    refetchTaxPasses({year: year})
    // Subscritpions
    refetchTotalSubs({year: year})
    refetchSubtotalSubs({year: year})
    refetchTaxSubs({year: year})
    // Event tickets
    refetchTotalTickets({year: year})
    refetchSubtotalTickets({year: year})
    refetchTaxTickets({year: year})
    // Other
    refetchTotalOther({year: year})
    refetchSubtotalOther({year: year})
    refetchTaxOther({year: year})
  }

  // use <datavar> && <datavar unpacked> as <datavar> might not yet be loaded.

  return (
    <InsightRevenueBase year={year} refetchData={refetchData}>
      {/* Total */}
      <InsightRevenueDisplay
        loading={(loadingTotal || loadingSubtotal || loadingTax)}
        error={(errorTotal || errorSubtotal || errorTax)}
          cardTitle={t("general.total")}
          dataTotal={dataTotal && dataTotal.insightRevenueTotal.data}
          dataSubtotal={dataSubtotal && dataSubtotal.insightRevenueSubtotal.data}
          dataTax={dataTax && dataTax.insightRevenueTax.data}
      />
      {/* Subscriptions */}
      <InsightRevenueDisplay
          loading={(loadingTotalSubs || loadingSubtotalSubs || loadingTaxSubs)}
          error={(errorTotalSubs || errorSubtotalSubs || errorTaxSubs)}
          cardTitle={t("general.subscriptions")}
          dataTotal={dataTotalSubs && dataTotalSubs.insightRevenueTotalSubscriptions.data}
          dataSubtotal={dataSubtotalSubs && dataSubtotalSubs.insightRevenueSubtotalSubscriptions.data}
          dataTax={dataTaxSubs && dataTaxSubs.insightRevenueTaxSubscriptions.data}
      />
      {/* Classpasses */}
      <InsightRevenueDisplay
          loading={(loadingTotalPasses || loadingSubtotalPasses || loadingTaxPasses)}
          error={(errorTotalPasses || errorSubtotalPasses || errorTaxPasses)}
          cardTitle={t("general.classpasses")}
          dataTotal={dataTotalPasses && dataTotalPasses.insightRevenueTotalClasspasses.data}
          dataSubtotal={dataSubtotalPasses && dataSubtotalPasses.insightRevenueSubtotalClasspasses.data}
          dataTax={dataTaxPasses && dataTaxPasses.insightRevenueTaxClasspasses.data}
      />
      {/* Event tickets */}
      <InsightRevenueDisplay
          loading={(loadingTotalTickets || loadingSubtotalTickets || loadingTaxTickets)}
          error={(errorTotalTickets || errorSubtotalTickets || errorTaxTickets)}
          cardTitle={t("general.event_tickets")}
          dataTotal={dataTotalTickets && dataTotalTickets.insightRevenueTotalEventTickets.data}
          dataSubtotal={dataSubtotalTickets && dataSubtotalTickets.insightRevenueSubtotalEventTickets.data}
          dataTax={dataTaxTickets && dataTaxTickets.insightRevenueTaxEventTickets.data}
      />
      {/* Other */}
      <InsightRevenueDisplay
          loading={(loadingTotalOther || loadingSubtotalOther || loadingTaxOther)}
          error={(errorTotalOther || errorSubtotalOther || errorTaxOther)}
          cardTitle={t("general.other")}
          dataTotal={dataTotalOther && dataTotalOther.insightRevenueTotalOther.data}
          dataSubtotal={dataSubtotalOther && dataSubtotalOther.insightRevenueSubtotalOther.data}
          dataTax={dataTaxOther && dataTaxOther.insightRevenueTaxOther.data}
      />
    </InsightRevenueBase>
  )
}

export default withTranslation()(withRouter(InsightRevenue))