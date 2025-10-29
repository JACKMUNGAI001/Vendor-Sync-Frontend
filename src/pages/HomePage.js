import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">VendorSync</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-slate-900">
            Streamline Your Construction Procurement
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Say goodbye to spreadsheets and emails. VendorSync puts all your vendor management, 
            quotes, and orders in one powerful platform.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Built for Every Team Member</h2>
            <p className="text-xl text-slate-600">Three specialized dashboards for seamless collaboration</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">Procurement Manager</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">✓</span><span>Create material requirement lists</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">✓</span><span>Invite vendors for quotes</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">✓</span><span>Compare and approve quotes</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">✓</span><span>Create purchase orders</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">✓</span><span>Assign orders to staff</span></li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">Staff</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>Track assigned orders</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>Update order status</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>Upload delivery receipts</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>Inspect deliveries</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>Communicate with vendors</span></li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">Vendor</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2"><span className="text-purple-600 mt-1">✓</span><span>Register and get approved</span></li>
                <li className="flex items-start gap-2"><span className="text-purple-600 mt-1">✓</span><span>Receive quote requests</span></li>
                <li className="flex items-start gap-2"><span className="text-purple-600 mt-1">✓</span><span>Submit competitive quotes</span></li>
                <li className="flex items-start gap-2"><span className="text-purple-600 mt-1">✓</span><span>Confirm deliveries</span></li>
                <li className="flex items-start gap-2"><span className="text-purple-600 mt-1">✓</span><span>Upload invoices</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">Quick Test Access</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Use these test accounts to explore the different user dashboards:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-blue-900">Manager Dashboard</h3>
              <p className="text-blue-700 mb-4">
                Email: <strong>manager@vendorsync.com</strong><br/>
                Password: <strong>password123</strong>
              </p>
              <Link to="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Access Manager Dashboard
                </Button>
              </Link>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-green-900">Staff Dashboard</h3>
              <p className="text-green-700 mb-4">
                Email: <strong>staff@vendorsync.com</strong><br/>
                Password: <strong>password123</strong>
              </p>
              <Link to="/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Access Staff Dashboard
                </Button>
              </Link>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <Package className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-purple-900">Vendor Dashboard</h3>
              <p className="text-purple-700 mb-4">
                Email: <strong>vendor@vendorsync.com</strong><br/>
                Password: <strong>password123</strong>
              </p>
              <Link to="/login">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Access Vendor Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 text-sm text-slate-500">
            <p>These are pre-configured test accounts with sample data.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Transform Your Procurement?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join leading construction companies who save time and money with VendorSync
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-6 w-6 text-blue-400" />
            <span className="text-white font-semibold">VendorSync</span>
          </div>
          <p className="text-sm">
            Streamlining construction procurement for modern teams.
          </p>
          <div className="mt-8 text-sm">
            © 2025 VendorSync. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;