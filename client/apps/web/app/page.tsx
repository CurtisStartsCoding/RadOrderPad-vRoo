"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "../../../src/components/ui/button";

/**
 * Home page component
 * 
 * This is the main landing page of the application.
 */
export default function HomePage() {
  return (
    <div className="container mx-auto py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">RadOrderPad</h1>
        <p className="text-xl mb-10">
          A comprehensive radiology order management system
        </p>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Link href="/admin/queue">
            <Button size="lg">
              Admin Queue
            </Button>
          </Link>
          
          <Link href="/order/new">
            <Button size="lg" variant="outline">
              New Order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
