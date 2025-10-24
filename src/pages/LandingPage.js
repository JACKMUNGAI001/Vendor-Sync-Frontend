import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Package, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-slate-900">
            Streamline Your Construction Procurement
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Say goodbye to spreadsheets and emails. VendorSync puts all your vendor management, 
            quotes, and orders in one powerful platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Built for Every Team Member</h2>
            <p className="text-xl text-slate-600">Three specialized dashboards for seamless collaboration</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Procurement Manager */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">Procurement Manager</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Create material requirement lists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Invite vendors for quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Compare and approve quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Create purchase orders</span>
                </li>
              </ul>
            </div>

            {/* Vendor */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">Vendor</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Register and get approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Receive quote requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Submit competitive quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Confirm deliveries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>