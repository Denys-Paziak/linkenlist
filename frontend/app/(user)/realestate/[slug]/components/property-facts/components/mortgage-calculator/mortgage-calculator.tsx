'use client'

import { Calculator, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../../../../../components/ui/card";
import { IRealestate } from "../../../../../../../../types/Realestate";
import { MortgageCalculatorDialog } from "./mortgage-calculator-dialog";
import { useState } from "react";

export function MortgageCalculator({ listing }: { listing: IRealestate }) {
  const [expandedMortgage, setExpandedMortgage] = useState(false);

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-gray-50 p-4"
          onClick={() => setExpandedMortgage(!expandedMortgage)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">Mortgage Calculator</h3>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-600 transition-transform ${
                expandedMortgage ? "rotate-180" : ""
              }`}
            />
          </div>
        </CardHeader>
        {expandedMortgage && (
          <CardContent className="p-4">
            <div className="bg-white rounded-lg p-4">
              <MortgageCalculatorDialog listing={listing} />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
