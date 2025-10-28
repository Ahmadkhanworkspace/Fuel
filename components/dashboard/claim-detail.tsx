"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, MapPin, CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import FraudDetectionPanel from "./fraud-detection-panel";

export default function ClaimDetail({ claim }: { claim: any }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (!claim) {
    return <div className="text-center py-12 text-gray-500">Claim not found</div>;
  }

  const mockFraudFlags = {
    hasDuplicate: claim.fraud_score > 70,
    exifTimestampValid: true,
    gpsValid: !!(claim.gps_lat && claim.gps_lng),
    ocrConfidence: claim.ocr_confidence || 0.85,
    zoneCompliant: claim.fraud_score < 50,
    odometerConsistent: true,
  };

  const handleApprove = async () => {
    // Implement approval
    console.log("Approving claim:", claim.id);
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      alert("Please provide a rejection reason");
      return;
    }
    // Implement rejection
    console.log("Rejecting claim:", claim.id, rejectionReason);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Claim Details
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Claim Information</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                  claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {claim.status.toUpperCase()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Claim ID</p>
                  <p className="font-mono text-sm">{claim.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p>{formatDate(claim.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Liters</p>
                  <p className="text-lg font-semibold">{claim.liters_claimed}L</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-blue-600">{formatCurrency(claim.price)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee & Vehicle */}
          <Card>
            <CardHeader>
              <CardTitle>Employee & Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Employee</p>
                  <p className="font-medium">{claim.employee?.name}</p>
                  <p className="text-sm text-gray-400">{claim.employee?.employee_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium text-blue-600">{claim.vehicle?.reg_no}</p>
                  <p className="text-sm text-gray-400">{claim.vehicle?.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Odometer</p>
                  <p className="font-medium">{claim.odometer_reading} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GPS</p>
                  <p className="text-sm font-mono">{claim.gps_lat?.toFixed(6)}, {claim.gps_lng?.toFixed(6)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          {claim.photos && claim.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {claim.photos.map((photo: string, index: number) => (
                    <div
                      key={index}
                      className="cursor-pointer hover:opacity-80 transition"
                      onClick={() => setSelectedImage(photo)}
                    >
                      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-xs text-center mt-2 text-gray-600">Photo {index + 1}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* OCR Results */}
          {claim.ocr_text && (
            <Card>
              <CardHeader>
                <CardTitle>OCR Extraction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Confidence: {Math.round((claim.ocr_confidence || 0) * 100)}%</p>
                  <pre className="text-xs bg-gray-50 p-3 rounded border">
                    {JSON.stringify(claim.ocr_text, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Actions & Fraud */}
        <div className="space-y-6">
          {/* Fraud Detection */}
          <FraudDetectionPanel fraudScore={claim.fraud_score || 0} flags={mockFraudFlags} />

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleApprove}
                disabled={claim.status !== 'pending'}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Claim
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
                disabled={claim.status !== 'pending'}
                variant="destructive"
                className="w-full"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Claim
              </Button>
            </CardContent>
          </Card>

          {/* Approver Info */}
          {claim.approver && (
            <Card>
              <CardHeader>
                <CardTitle>Approved By</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{claim.approver.name}</p>
                <p className="text-sm text-gray-500">{claim.approver.employee_code}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(claim.updated_at)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Selected Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl max-h-[90vh] p-4">
            <img src={selectedImage} alt="Claim photo" className="max-w-full max-h-[85vh] rounded" />
            <Button
              onClick={() => setSelectedImage(null)}
              className="mt-4"
              variant="destructive"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

