import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiUsers, FiDollarSign, FiTrendingUp, FiShoppingBag, FiEye } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/dashboard/stats'),
  });
  
  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => api.get('/admin/orders?limit=10'),
  });
  
  const statsCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      change: '+12.5%',
      icon: FiDollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      change: '+8.2%',
      icon: FiShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      change: '+15.3%',
      icon: FiUsers,
      color: 'bg-purple-500',
    },
    {
      title: 'Page Views',
      value: stats?.pageViews || 0,
      change: '+22.1%',
      icon: FiEye,
      color: 'bg-yellow-500',
    },
  ];
  
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: stats?.monthlyRevenue || [],
        borderColor: '#1E3A8A',
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        tension: 0.4,
      },
    ],
  };
  
  const categoryChartData = {
    labels: ['Dresses', 'Gowns', 'Casual', 'Party', 'Wedding'],
    datasets: [
      {
        data: stats?.categoryBreakdown || [],
        backgroundColor: [
          '#1E3A8A',
          '#D4AF37',
          '#87A96B',
          '#FFF0F5',
          '#6B7280',
        ],
      },
    ],
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-green-500 text-sm font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{stat.value}</h3>
              <p className="text-neutral-500 text-sm mt-1">{stat.title}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-serif mb-4">Revenue Trend</h3>
            <Line data={revenueChartData} options={{ responsive: true }} />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-serif mb-4">Category Breakdown</h3>
            <Doughnut data={categoryChartData} options={{ responsive: true }} />
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-serif mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-neutral-50">
                    <td className="py-3 px-4 font-mono text-sm">{order.orderNumber}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button className="text-luxury-blue hover:underline text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}