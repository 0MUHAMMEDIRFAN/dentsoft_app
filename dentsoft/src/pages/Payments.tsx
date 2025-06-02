import React, { useContext, useEffect } from 'react'
import AddPayments from "../components/Payments/AddPayments";
import ViewPayments from "../components/Payments/ViewPayments";
import { AppContext } from '../contexts/AppContext';


function Payments() {
    const { viewPayment, setAddPaymentClicked, setViewPayment } = useContext(AppContext)
    useEffect(() => {
        return (
            setAddPaymentClicked(false),
            setViewPayment(true)
        )
    }, [])
    if (viewPayment)
        return (<ViewPayments />)
    else
        return (<AddPayments />)
}

export default Payments
