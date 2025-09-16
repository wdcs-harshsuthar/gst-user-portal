import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Home,
  MapPin,
  Camera,
  Navigation,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { RegistrationData } from '../../UserApp';

interface PropertyVerificationTabProps {
  application: RegistrationData;
}

// Mock property verification data - in a real app, this would come from the Property Verifier Portal
const MOCK_PROPERTY_VERIFICATION = {
  inspectionId: 'INS-2025-001',
  inspectionStatus: 'completed',
  inspectionDate: '2025-01-04 10:30 AM',
  inspectorName: 'Michael Davis',
  inspectorId: 'INS-001',
  
  // Property Assessment
  actualBedrooms: 3,
  actualBathrooms: 2,
  propertyCondition: 'Good',
  structuralIntegrity: 'Sound',
  estimatedValue: '75000',
  accessNotes: 'Property easily accessible via Crown Hill Road. Owner was present during inspection.',
  inspectorNotes: 'Property matches declared information. Well-maintained residential building with minor cosmetic wear typical for age. All major structural elements appear sound.',
  complianceIssues: 'None identified',
  
  // GPS and Location
  gpsCoordinates: '6.3156, -10.8074',
  locationVerified: true,
  
  // Photos captured during inspection
  photos: [
    {
      id: 'photo-1',
      type: 'exterior_front',
      description: 'Front Exterior View',
      timestamp: '2025-01-04 10:35 AM',
      gpsLocation: '6.3156, -10.8074',
      verified: true
    },
    {
      id: 'photo-2', 
      type: 'exterior_back',
      description: 'Back Exterior View',
      timestamp: '2025-01-04 10:38 AM',
      gpsLocation: '6.3156, -10.8074',
      verified: true
    },
    {
      id: 'photo-3',
      type: 'interior_living',
      description: 'Living Room Interior',
      timestamp: '2025-01-04 10:42 AM',
      gpsLocation: '6.3156, -10.8074',
      verified: true
    },
    {
      id: 'photo-4',
      type: 'interior_bedroom',
      description: 'Master Bedroom',
      timestamp: '2025-01-04 10:45 AM',
      gpsLocation: '6.3156, -10.8074',
      verified: true
    },
    {
      id: 'photo-5',
      type: 'interior_bathroom',
      description: 'Main Bathroom',
      timestamp: '2025-01-04 10:47 AM',
      gpsLocation: '6.3156, -10.8074',
      verified: true
    }
  ],
  
  // Room details captured
  roomDetails: [
    {
      id: 'room-1',
      roomType: 'Living Room',
      dimensions: '4.5m x 3.8m',
      condition: 'Good',
      features: ['Tiled Floor', 'Ceiling Fan', 'Large Windows'],
      notes: 'Spacious main living area with good natural light'
    },
    {
      id: 'room-2', 
      roomType: 'Master Bedroom',
      dimensions: '3.5m x 3.2m',
      condition: 'Good',
      features: ['Tiled Floor', 'Built-in Wardrobe', 'AC Unit'],
      notes: 'Well-ventilated bedroom with adequate storage'
    },
    {
      id: 'room-3',
      roomType: 'Kitchen',
      dimensions: '3.0m x 2.5m',
      condition: 'Fair',
      features: ['Tiled Floor', 'Running Water', 'Electrical Outlets'],
      notes: 'Functional kitchen, could benefit from minor updates'
    }
  ],
  
  verificationComplete: true,
  verificationDate: '2025-01-04 11:15 AM',
  finalRecommendation: 'Property verification completed successfully. Declared information is accurate.'
};

export default function PropertyVerificationTab({ application }: PropertyVerificationTabProps) {
  const propertyData = application.propertyData;
  const verification = MOCK_PROPERTY_VERIFICATION;
  
  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in_progress': return Clock;
      case 'scheduled': return Shield;
      case 'cancelled': return AlertCircle;
      default: return AlertCircle;
    }
  };

  // If no property verification data exists
  if (!verification || verification.inspectionStatus === 'scheduled') {
    return (
      <div className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Property inspection has not been completed yet. Once the Property Verifier completes the field inspection, 
            verification details, photos, and assessment information will appear here.
          </AlertDescription>
        </Alert>
        
        {propertyData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Information (Self-Declared)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Address</Label>
                  <p className="font-medium">{propertyData.streetAddress}</p>
                  <p className="text-sm text-gray-600">{propertyData.city}, {propertyData.county}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Declared Value</Label>
                  <p className="font-medium">${Number(propertyData.declaredValue || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const StatusIcon = getVerificationStatusIcon(verification.inspectionStatus);

  return (
    <div className="space-y-6">
      {/* Inspection Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Property Inspection Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <StatusIcon className="h-5 w-5" />
            <Badge className={getVerificationStatusColor(verification.inspectionStatus)}>
              {verification.inspectionStatus.toUpperCase().replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Inspection ID</Label>
              <p className="font-mono">{verification.inspectionId}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Inspection Date</Label>
              <p>{verification.inspectionDate}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Inspector</Label>
              <p>{verification.inspectorName} ({verification.inspectorId})</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">GPS Coordinates</Label>
              <p className="font-mono text-sm">{verification.gpsCoordinates}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Location Verified</Label>
              <div className="flex items-center gap-1">
                {verification.locationVerified ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-700">Not Verified</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Completed</Label>
              <p>{verification.verificationDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Assessment Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Declared vs Actual Comparison */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Property Details Comparison</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Bedrooms</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Declared: {propertyData?.bedrooms || 'N/A'}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium">Actual: {verification.actualBedrooms}</span>
                    {Number(propertyData?.bedrooms) === verification.actualBedrooms ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Bathrooms</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Declared: {propertyData?.bathrooms || 'N/A'}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium">Actual: {verification.actualBathrooms}</span>
                    {Number(propertyData?.bathrooms) === verification.actualBathrooms ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Property Value</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Declared: ${Number(propertyData?.declaredValue || 0).toLocaleString()}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium">Estimated: ${Number(verification.estimatedValue).toLocaleString()}</span>
                    {Number(propertyData?.declaredValue) === Number(verification.estimatedValue) ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Assessment Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Inspector Assessment</h4>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">Property Condition</Label>
                  <p className="font-medium">{verification.propertyCondition}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Structural Integrity</Label>
                  <p className="font-medium">{verification.structuralIntegrity}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Compliance Issues</Label>
                  <p className={verification.complianceIssues === 'None identified' ? 'text-green-700' : 'text-red-700'}>
                    {verification.complianceIssues}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspector Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Inspection Photos ({verification.photos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verification.photos.map((photo, index) => (
              <Card key={photo.id} className="border-2">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{photo.description}</Label>
                      {photo.verified && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    {/* Placeholder for actual photo - in real app, would display the actual image */}
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">{photo.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>📅 {photo.timestamp}</p>
                      <p>📍 {photo.gpsLocation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Room Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verification.roomDetails.map((room, index) => (
              <div key={room.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{room.roomType}</h4>
                  <Badge variant="outline">{room.condition}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Dimensions</Label>
                    <p>{room.dimensions}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Features</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {room.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {room.notes && (
                  <div>
                    <Label className="text-gray-600">Inspector Notes</Label>
                    <p className="text-sm">{room.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inspector Notes and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Inspector Notes & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600">Access Notes</Label>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{verification.accessNotes}</p>
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Inspector Notes</Label>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{verification.inspectorNotes}</p>
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Final Recommendation</Label>
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">{verification.finalRecommendation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}