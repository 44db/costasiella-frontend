// @flow

import React, { useContext, useRef, useState } from 'react'
import { useMutation, useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { v4 } from "uuid"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment'

import AppSettingsContext from '../../../context/AppSettingsContext'
import FinanceInvoicesStatus from "../../../ui/FinanceInvoiceStatus"
import ContentCard from "../../../general/ContentCard"

import {
  Button,
  Card,
  Grid,
  Icon,
  Table,
  Text
} from "tabler-react"
import { GET_INVOICE_QUERY, CREATE_PAYMENT_LINK } from "./queries"
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"

import ShopAccountInvoicePaymentBase from "./ShopAccountInvoicePaymentBase"


function ShopAccountInvoicePayment({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const dateTimeFormat = dateFormat + ' ' + timeFormat
  const onlinePaymentsAvailable = appSettings.onlinePaymentsAvailable

  const id = match.params.id
  const cardTitleLoadingError = t("shop.account.invoice_payment.title")

  const btnPayNow = useRef(null);
  const initialBtnText = <span><Icon name="credit-card" /> {t('shop.checkout.payment.to_payment')} <Icon name="chevron-right" /></span>
  const [btn_text, setBtnText] = useState(initialBtnText)

  // Chain queries. First query user data and then query invoices for that user once we have the account Id.
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data, fetchMore } = useQuery(GET_INVOICE_QUERY, {
    skip: loadingUser || errorUser || !dataUser,
    variables: {
      id: id
    }
  })

  const [createPaymentLink] = useMutation(CREATE_PAYMENT_LINK)

  function onClickPay() {
    btnPayNow.current.setAttribute("disabled", "disabled")
    setBtnText(t("shop.checkout.payment.redirecting"))
    // btnPayNow.current.setValue("redirecting...")
    // btnPayNow
    // btnPayNow.current.removeAttribute("disabled")
    createPaymentLink({ variables: { id: id } }).then(({ data }) => {
      console.log('got data', data);
      const paymentLink = data.createFinanceInvoicePaymentLink.financeInvoicePaymentLink.paymentLink
      window.location.href = paymentLink
    }).catch((error) => {
      toast.error((t('general.toast_server_error')) + ': ' +  error, {
          position: toast.POSITION.BOTTOM_RIGHT
        })
      console.log('there was an error sending the query', error)
    })
  }

  if (loading || loadingUser || !data) return (
    <ShopAccountInvoicePaymentBase>
      <Card title={cardTitleLoadingError}>
        <Card.Body>
          {t("general.loading_with_dots")}
        </Card.Body>
      </Card>
    </ShopAccountInvoicePaymentBase>
  )
  if (error || errorUser) return (
    <ShopAccountInvoicePaymentBase>
      <Card title={cardTitleLoadingError}>
        <Card.Body>
          {t("shop.account.invoice_payment.error_loading_data")}
        </Card.Body>
      </Card>
    </ShopAccountInvoicePaymentBase>
  )

  console.log("User data: ###")
  console.log(data)
  const user = dataUser.user
  const invoice = data.financeInvoice

  
  return (
    <ShopAccountInvoicePaymentBase accountName={user.fullName}>
      <Card title={<span>{t("general.invoice")} #{invoice.invoiceNumber}</span>}>
        <Card.Body>
          Test
        </Card.Body>
        <Card.Footer>
          <button
            className="btn float-right btn-success"
            ref={btnPayNow}
            onClick={ onClickPay }
          >
            {btn_text}
          </button>
        </Card.Footer>
      </Card>
    </ShopAccountInvoicePaymentBase>
  )
}


export default withTranslation()(withRouter(ShopAccountInvoicePayment))