import React from 'react';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-24">
        <h1 className="text-5xl font-bold text-neutral-900 mb-2">7FT SERVICES</h1>
        <h2 className="text-2xl font-medium text-primary-600 mb-8">AI LAB</h2>
        <p className="max-w-2xl mx-auto text-neutral-600 text-lg">
          Explore our suite of intelligent agents designed to transform your data workflows
          and enhance your business capabilities through cutting-edge AI technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="info-box">
          <h3 className="text-lg font-semibold mb-2">Advanced AI Technology</h3>
          <p className="text-neutral-600 mb-4">
            Our agents utilize state-of-the-art deep learning models and natural language processing
            to deliver intelligent solutions for your business needs.
          </p>
          <div className="text-primary-600 font-medium flex items-center gap-1 text-sm">
            Learn more <ArrowRight className="w-4 h-4" />
          </div>
        </div>
        
        <div className="info-box">
          <h3 className="text-lg font-semibold mb-2">Data Processing</h3>
          <p className="text-neutral-600 mb-4">
            From structured databases to unstructured documents, our agents can process
            and analyze various data types with high accuracy.
          </p>
          <div className="text-primary-600 font-medium flex items-center gap-1 text-sm">
            Explore capabilities <ArrowRight className="w-4 h-4" />
          </div>
        </div>
        
        <div className="info-box">
          <h3 className="text-lg font-semibold mb-2">Enterprise Integration</h3>
          <p className="text-neutral-600 mb-4">
            Seamlessly integrate our AI agents with your existing systems and workflows
            for enhanced productivity and insights.
          </p>
          <div className="text-primary-600 font-medium flex items-center gap-1 text-sm">
            Get started <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Ready to transform your business with AI?</h2>
          <p className="text-neutral-600 mb-6">
            Start exploring our intelligent agents and discover how they can elevate your workflows
            and boost your business efficiency.
          </p>
         <button
                className="btn btn-primary flex items-center gap-2 mx-auto"
                onClick={() => window.location.href = 'https://7ftservices.com/'}
              >
                Get started <ArrowRight className="w-4 h-4" />
        </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;