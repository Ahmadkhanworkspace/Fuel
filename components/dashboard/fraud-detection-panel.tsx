"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface FraudDetectionPanelProps {
  fraudScore: number;
  flags: {
    hasDuplicate: boolean;
    exifTimestampValid: boolean;
    gpsValid: boolean;
    ocrConfidence: number;
    zoneCompliant: boolean;
    odometerConsistent: boolean;
  };
}

export default function FraudDetectionPanel({ fraudScore, flags }: FraudDetectionPanelProps) {
  const getScoreColor = (score: number) => {
    if (score > 70) return "text-red-600 bg-red-50";
    if (score > 40) return "text-orange-600 bg-orange-50";
    return "text-blue-600 bg-blue-50";
  };

  const getScoreText = (score: number) => {
    if (score > 70) return "High Risk - Manual Review Required";
    if (score > 40) return "Medium Risk - Review Recommended";
    return "Low Risk - Auto Approve";
  };

  return (
    <Card className="shadow-lg border-l-4 border-red-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Fraud Detection
          </CardTitle>
          <div className={`px-3 py-1 rounded-lg ${getScoreColor(fraudScore)}`}>
            <span className="font-bold">{fraudScore}</span>/100
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">
            {getScoreText(fraudScore)}
          </p>
        </div>

        <div className="space-y-2">
          {flags.hasDuplicate && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <XCircle className="h-4 w-4" />
              Duplicate image detected
            </div>
          )}
          {!flags.exifTimestampValid && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              EXIF timestamp mismatch
            </div>
          )}
          {!flags.gpsValid && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              GPS data invalid
            </div>
          )}
          {flags.ocrConfidence < 0.7 && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Low OCR confidence ({Math.round(flags.ocrConfidence * 100)}%)
            </div>
          )}
          {!flags.zoneCompliant && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <XCircle className="h-4 w-4" />
              Zone violation detected
            </div>
          )}
          {!flags.odometerConsistent && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Odometer reading inconsistent
            </div>
          )}
          {fraudScore <= 40 && (
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              All checks passed
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

