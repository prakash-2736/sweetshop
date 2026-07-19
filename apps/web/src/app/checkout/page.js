import CheckoutForm from "@/features/checkout/CheckoutForm";

export const metadata = {
  title: "Checkout | SweetShop Bakery",
  description: "Securely review and complete your order of handcrafted sweets.",
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Complete Your Order
        </h1>
        <p className="text-sm text-muted-foreground">
          Please review your items, fill in delivery details, and place your order.
        </p>
      </div>

      {/* Form & Summary */}
      <CheckoutForm />
    </div>
  );
}
