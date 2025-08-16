const CheckoutComponent = `
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTruck, FiGift } from 'react-icons/fi';
import { orderAPI } from '@/lib/api';
import { clearCart } from '@/store/cartSlice';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const shippingCost = cart.totalAmount > 5000 ? 0 : 299;
  const tax = cart.totalAmount * 0.18;
  const rewardDiscount = user?.rewardPointsToUse || 0;
  const finalTotal = cart.totalAmount + shippingCost + tax - rewardDiscount;
  
  const onSubmitShipping = (data) => {
    setStep(2);
  };
  
  const processPayment = async (paymentData) => {
    setIsProcessing(true);
    try {
      const stripe = await stripePromise;
      
      const orderData = {
        items: cart.items,
        shippingAddress: paymentData.shippingAddress,
        billingAddress: paymentData.billingAddress,
        paymentMethod: paymentData.paymentMethod,
        subtotal: cart.totalAmount,
        shippingAmount: shippingCost,
        taxAmount: tax,
        totalAmount: finalTotal,
        rewardPointsUsed: rewardDiscount
      };
      
      const { data: order } = await orderAPI.createOrder(orderData);
      
      if (paymentData.paymentMethod === 'card') {
        // Process Stripe payment
        const result = await stripe.confirmCardPayment(order.clientSecret);
        
        if (result.error) {
          throw new Error(result.error.message);
        }
      }
      
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      router.push(\`/orders/\${order.id}/success\`);
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className={\`flex items-center \${step >= 1 ? 'text-luxury-blue' : 'text-neutral-400'}\`}>
                <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${step >= 1 ? 'bg-luxury-blue text-white' : 'bg-neutral-200'}\`}>
                  1
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              <div className="flex-1 h-0.5 bg-neutral-200 mx-4">
                <div className={\`h-full bg-luxury-blue transition-all \${step >= 2 ? 'w-full' : 'w-0'}\`} />
              </div>
              <div className={\`flex items-center \${step >= 2 ? 'text-luxury-blue' : 'text-neutral-400'}\`}>
                <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${step >= 2 ? 'bg-luxury-blue text-white' : 'bg-neutral-200'}\`}>
                  2
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
            
            {/* Shipping Form */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-2xl font-serif mb-6">Shipping Information</h2>
                <form onSubmit={handleSubmit(onSubmitShipping)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        First Name
                      </label>
                      <input
                        {...register('firstName', { required: 'First name is required' })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-luxury-blue focus:border-transparent"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Last Name
                      </label>
                      <input
                        {...register('lastName', { required: 'Last name is required' })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-luxury-blue focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-luxury-blue focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Street Address
                      </label>
                      <input
                        {...register('street', { required: 'Address is required' })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-luxury-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        City
                      </label>
                      <input
                        {...register('city', { required: 'City is required' })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-luxury-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        State
                      </label>
                      <input
                        {...register('state', { required: 'State is required' })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-luxury-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        {...register('zipCode', { required: 'ZIP code is required' })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-luxury-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone is required' })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-luxury-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-6 bg-luxury-blue text-white py-3 rounded-lg font-medium hover:bg-luxury-blue-dark transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </motion.div>
            )}
            
            {/* Payment Form */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-2xl font-serif mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-luxury-blue">
                    <input type="radio" name="payment" value="card" className="mr-3" defaultChecked />
                    <FiCreditCard className="mr-3" size={20} />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-luxury-blue">
                    <input type="radio" name="payment" value="upi" className="mr-3" />
                    <span className="font-medium ml-8">UPI</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-luxury-blue">
                    <input type="radio" name="payment" value="netbanking" className="mr-3" />
                    <span className="font-medium ml-8">Net Banking</span>
                  </label>
                </div>
                
                <button
                  onClick={() => processPayment({ paymentMethod: 'card' })}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-luxury-blue text-white py-3 rounded-lg font-medium hover:bg-luxury-blue-dark transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : \`Pay ₹\${finalTotal.toLocaleString()}\`}
                </button>
              </motion.div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-serif mb-4">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-xs text-neutral-500">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{cart.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : \`₹\${shippingCost}\`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (GST)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                {rewardDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Reward Discount</span>
                    <span>-₹{rewardDiscount}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Rewards Earned */}
              <div className="mt-4 p-3 bg-luxury-gold/10 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <FiGift className="text-luxury-gold" />
                  <span>You'll earn <strong>{Math.floor(finalTotal / 100) * 10}</strong> reward points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;