import { Routes, Route, Navigate } from "react-router-dom";
import PricingComparison from "@features/stripe/PricingComparison";
import SuccessPage from "./success.page";
import CancelPage from "./cancel.page";
import DonationPage from "./donation.page";
import DonationSuccessPage from "./donation-success.page";

export default function StripeRoutes() {
  return (
    <Routes>
      <Route path="pricing" element={<PricingComparison />} />
      <Route path="donation" element={<DonationPage />} />
      <Route path="donations/success" element={<DonationSuccessPage />} />
      <Route path="success" element={<SuccessPage />} />
      <Route path="cancel" element={<CancelPage />} />
      <Route path="*" element={<Navigate to="/payments/cancel" />} />
    </Routes>
  );
}
