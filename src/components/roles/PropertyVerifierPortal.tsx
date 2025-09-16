import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  MapPin,
  Camera,
  Home,
  CheckCircle2,
  AlertCircle,
  Clock,
  Navigation,
  Image as ImageIcon,
  Upload,
  Eye,
  Trash2,
  RotateCcw,
  Maximize2,
  RefreshCw,
  Shield,
  User,
  Building2
} from 'lucide-react';

interface PropertyInspection {
  id: string;
  applicationId: string;
  applicantName: string;
  applicationType: 'individual' | 'business';
  propertyAddress: string;
  city: string;
  county: string;
  landmark?: string;
  declaredValue: number;
  declaredBedrooms: number;
  declaredBathrooms: number;
  scheduledDate: string;
  status: 'assigned' | 'in_transit' | 'at_location' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  assignedDate: string;
}

interface InspectionData {
  actualBedrooms: number;
  actualBathrooms: number;
  propertyCondition: string;
  structuralIntegrity: string;
  estimatedValue: string;
  accessNotes: string;
  inspectorNotes: string;
  complianceIssues: string;
  photos: InspectionPhoto[];
  roomDetails: RoomDetail[];
  verificationComplete: boolean;
}

interface InspectionPhoto {
  id: string;
  type: 'exterior_front' | 'exterior_back' | 'exterior_side_left' | 'exterior_side_right' | 'interior_living' | 'interior_kitchen' | 'interior_bedroom' | 'interior_bathroom' | 'other';
  description: string;
  file: File | null;
  dataUrl: string;
  timestamp: string;
  gpsLocation?: string;
}

interface RoomDetail {
  id: string;
  roomType: string;
  dimensions: string;
  condition: string;
  features: string[];
  photos: string[];
  notes: string;
}

const MOCK_INSPECTIONS: PropertyInspection[] = [
  {
    id: 'INS-2025-001',
    applicationId: 'APP-2025-001',
    applicantName: 'John Michael Thompson',
    applicationType: 'individual',
    propertyAddress: '15 Broad Street, Central Monrovia',
    city: 'Monrovia',
    county: 'Montserrado',
    landmark: 'Near Centennial Pavilion',
    declaredValue: 45000,
    declaredBedrooms: 3,
    declaredBathrooms: 2,
    scheduledDate: '2025-01-04 10:00 AM',
    status: 'assigned',
    priority: 'high',
    assignedTo: 'Michael Davis',
    assignedDate: '2025-01-04 08:00 AM'
  },
  {
    id: 'INS-2025-002',
    applicationId: 'APP-2025-002',
    applicantName: 'Sunrise Trading Company',
    applicationType: 'business',
    propertyAddress: '42 Randall Street, Sinkor',
    city: 'Monrovia',
    county: 'Montserrado',
    landmark: 'Behind JFK Hospital',
    declaredValue: 125000,
    declaredBedrooms: 0,
    declaredBathrooms: 3,
    scheduledDate: '2025-01-04 02:00 PM',
    status: 'assigned',
    priority: 'medium',
    assignedTo: 'Michael Davis',
    assignedDate: '2025-01-04 08:15 AM'
  }
];

const PHOTO_TYPES = [
  { id: 'exterior_front', label: 'Front Exterior', required: true },
  { id: 'exterior_back', label: 'Back Exterior', required: true },
  { id: 'exterior_side_left', label: 'Left Side Exterior', required: false },
  { id: 'exterior_side_right', label: 'Right Side Exterior', required: false },
  { id: 'interior_living', label: 'Living/Main Room', required: true },
  { id: 'interior_kitchen', label: 'Kitchen', required: false },
  { id: 'interior_bedroom', label: 'Bedroom', required: true },
  { id: 'interior_bathroom', label: 'Bathroom', required: true },
  { id: 'other', label: 'Other/Additional', required: false }
];

export default function PropertyVerifierPortal() {
  const [inspections, setInspections] = useState<PropertyInspection[]>(MOCK_INSPECTIONS);
  const [selectedInspection, setSelectedInspection] = useState<PropertyInspection | null>(null);
  const [inspectionData, setInspectionData] = useState<InspectionData>({
    actualBedrooms: 0,
    actualBathrooms: 0,
    propertyCondition: '',
    structuralIntegrity: '',
    estimatedValue: '',
    accessNotes: '',
    inspectorNotes: '',
    complianceIssues: '',
    photos: [],
    roomDetails: [],
    verificationComplete: false
  });
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureType, setCaptureType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-yellow-100 text-yellow-800';
      case 'at_location': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateInspectionData = (field: keyof InspectionData, value: any) => {
    setInspectionData(prev => ({ ...prev, [field]: value }));
  };

  const startInspection = (inspection: PropertyInspection) => {
    setSelectedInspection(inspection);
    updateInspectionStatus(inspection.id, 'in_transit');
    
    // Initialize inspection data with declared values
    setInspectionData({
      actualBedrooms: inspection.declaredBedrooms,
      actualBathrooms: inspection.declaredBathrooms,
      propertyCondition: '',
      structuralIntegrity: '',
      estimatedValue: inspection.declaredValue.toString(),
      accessNotes: '',
      inspectorNotes: '',
      complianceIssues: '',
      photos: [],
      roomDetails: [],
      verificationComplete: false
    });
  };

  const updateInspectionStatus = (inspectionId: string, status: PropertyInspection['status']) => {
    setInspections(prev =>
      prev.map(inspection =>
        inspection.id === inspectionId ? { ...inspection, status } : inspection
      )
    );
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocation('GPS not available');
      return;
    }

    setCurrentLocation('Getting location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (error) => {
        let errorMessage = 'Location unavailable';
        let userFriendlyMessage = '';
        
        switch(error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location access denied by user';
            userFriendlyMessage = 'GPS access denied';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location position unavailable';
            userFriendlyMessage = 'GPS unavailable';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timeout';
            userFriendlyMessage = 'GPS timeout';
            break;
          default:
            errorMessage = 'Unknown location error';
            userFriendlyMessage = 'GPS error';
            break;
        }
        
        // Log the full error for debugging but show user-friendly message
        if (process.env.NODE_ENV === 'development') {
          console.warn('Geolocation error:', errorMessage, { 
            code: error.code, 
            message: error.message 
          });
        }
        
        setCurrentLocation(userFriendlyMessage);
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 8000, // Reduced timeout
        maximumAge: 300000 // 5 minutes cache
      }
    );
  };

  const capturePhoto = (photoType: string) => {
    setCaptureType(photoType);
    setIsCapturing(true);
    fileInputRef.current?.click();
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && captureType) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: InspectionPhoto = {
          id: Date.now().toString(),
          type: captureType as any,
          description: PHOTO_TYPES.find(pt => pt.id === captureType)?.label || 'Unknown',
          file,
          dataUrl: e.target?.result as string,
          timestamp: new Date().toISOString(),
          gpsLocation: currentLocation && !currentLocation.includes('denied') && !currentLocation.includes('unavailable') && !currentLocation.includes('error') && !currentLocation.includes('timeout') && !currentLocation.includes('not available') 
            ? currentLocation 
            : 'Location not available'
        };

        setInspectionData(prev => ({
          ...prev,
          photos: [...prev.photos, newPhoto]
        }));
      };
      reader.readAsDataURL(file);
    }
    setIsCapturing(false);
    setCaptureType('');
  };

  const deletePhoto = (photoId: string) => {
    setInspectionData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const addRoomDetail = () => {
    const newRoom: RoomDetail = {
      id: Date.now().toString(),
      roomType: '',
      dimensions: '',
      condition: '',
      features: [],
      photos: [],
      notes: ''
    };
    setInspectionData(prev => ({
      ...prev,
      roomDetails: [...prev.roomDetails, newRoom]
    }));
  };

  const updateRoomDetail = (roomId: string, field: keyof RoomDetail, value: any) => {
    setInspectionData(prev => ({
      ...prev,
      roomDetails: prev.roomDetails.map(room =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    }));
  };

  const completeInspection = () => {
    if (selectedInspection) {
      updateInspectionStatus(selectedInspection.id, 'completed');
      updateInspectionData('verificationComplete', true);
      
      // In a real app, this would sync with the server
      alert('Property inspection completed and submitted for review!');
      setSelectedInspection(null);
    }
  };

  const getPhotoProgress = () => {
    const requiredPhotos = PHOTO_TYPES.filter(pt => pt.required).length;
    const capturedRequired = PHOTO_TYPES.filter(pt => 
      pt.required && inspectionData.photos.some(photo => photo.type === pt.id)
    ).length;
    return (capturedRequired / requiredPhotos) * 100;
  };

  React.useEffect(() => {
    // Only try to get location automatically if user hasn't interacted yet
    // This prevents the permission prompt from appearing immediately
    // Users can manually request location when needed
  }, []);

  if (!selectedInspection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Property Verifier</h1>
                <p className="text-sm text-gray-600">Field Inspection Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={getCurrentLocation}
                disabled={currentLocation === 'Getting location...'}
              >
                <Navigation className="h-4 w-4 mr-2" />
                {currentLocation === 'Getting location...' ? 'Getting GPS...' : 'Get GPS Location'}
              </Button>
              {currentLocation && currentLocation !== 'Getting location...' && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    currentLocation.includes('denied') || currentLocation.includes('unavailable') || currentLocation.includes('error') || currentLocation.includes('timeout')
                      ? 'border-orange-300 text-orange-700 bg-orange-50' 
                      : 'border-green-300 text-green-700 bg-green-50'
                  }`}
                >
                  📍 {currentLocation}
                </Badge>
              )}
            </div>
          </div>

          {/* GPS Information Alert */}
          {(!currentLocation || currentLocation.includes('denied') || currentLocation.includes('unavailable')) && (
            <Alert className="mb-6">
              <Navigation className="h-4 w-4" />
              <AlertDescription>
                <strong>GPS Location (Optional):</strong> Enable GPS to automatically attach coordinates to inspection photos. 
                This helps verify property locations but is not required to complete inspections.
              </AlertDescription>
            </Alert>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-semibold">{inspections.filter(i => i.status === 'assigned').length}</p>
                    <p className="text-sm text-muted-foreground">Assigned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-semibold">{inspections.filter(i => i.status === 'in_transit').length}</p>
                    <p className="text-sm text-muted-foreground">In Transit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-semibold">{inspections.filter(i => i.status === 'at_location').length}</p>
                    <p className="text-sm text-muted-foreground">At Location</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-semibold">{inspections.filter(i => i.status === 'completed').length}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assigned Inspections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Today's Property Inspections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inspections.map((inspection) => (
                  <Card key={inspection.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {inspection.applicationType === 'individual' ? (
                              <User className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Building2 className="h-4 w-4 text-purple-600" />
                            )}
                            <div>
                              <h3 className="font-semibold text-sm">{inspection.applicantName}</h3>
                              <p className="text-xs text-muted-foreground">{inspection.applicationId}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <Badge className={getStatusColor(inspection.status)}>
                              {inspection.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(inspection.priority)} variant="outline">
                              {inspection.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <p className="text-xs text-gray-700">{inspection.propertyAddress}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Home className="h-3 w-3 text-gray-500" />
                            <p className="text-xs text-gray-700">
                              {inspection.declaredBedrooms}BR/{inspection.declaredBathrooms}BA - ${inspection.declaredValue.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <p className="text-xs text-gray-700">Scheduled: {inspection.scheduledDate}</p>
                          </div>
                        </div>

                        <Button 
                          onClick={() => startInspection(inspection)}
                          className="w-full"
                          disabled={inspection.status === 'completed'}
                        >
                          {inspection.status === 'assigned' ? 'Start Inspection' : 
                           inspection.status === 'completed' ? 'Completed' : 'Continue Inspection'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Inspection Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setSelectedInspection(null)}>
              ← Back to List
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{selectedInspection.applicantName}</h1>
              <p className="text-sm text-gray-600">{selectedInspection.applicationId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(selectedInspection.status)}>
              {selectedInspection.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Button 
              variant="outline" 
              onClick={() => updateInspectionStatus(selectedInspection.id, 'at_location')}
              disabled={selectedInspection.status === 'at_location' || selectedInspection.status === 'completed'}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Mark At Location
            </Button>
          </div>
        </div>

        {/* GPS Information for Inspection */}
        {(!currentLocation || currentLocation.includes('denied') || currentLocation.includes('unavailable') || currentLocation.includes('error')) && (
          <Alert className="mb-6">
            <Navigation className="h-4 w-4" />
            <AlertDescription>
              <strong>GPS Status:</strong> {currentLocation || 'GPS not enabled'}. 
              You can still complete the inspection - GPS coordinates are optional and help with location verification.
              {' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-600 underline"
                onClick={getCurrentLocation}
              >
                Enable GPS
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Property Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Address</Label>
                <p className="font-medium">{selectedInspection.propertyAddress}</p>
                <p className="text-sm text-gray-600">{selectedInspection.city}, {selectedInspection.county}</p>
                {selectedInspection.landmark && (
                  <p className="text-sm text-blue-600">Near: {selectedInspection.landmark}</p>
                )}
              </div>
              <div>
                <Label className="text-sm text-gray-600">Declared Details</Label>
                <p>Bedrooms: {selectedInspection.declaredBedrooms}</p>
                <p>Bathrooms: {selectedInspection.declaredBathrooms}</p>
                <p>Declared Value: ${selectedInspection.declaredValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photos">Photos & Documentation</TabsTrigger>
            <TabsTrigger value="rooms">Room Details</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="space-y-6">
            {/* Photo Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Property Photography
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-sm font-medium">{Math.round(getPhotoProgress())}% Complete</p>
                    <Progress value={getPhotoProgress()} className="w-32 mt-1" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PHOTO_TYPES.map((photoType) => {
                    const existingPhoto = inspectionData.photos.find(p => p.type === photoType.id);
                    return (
                      <Card key={photoType.id} className={`border-2 ${photoType.required ? 'border-red-200' : 'border-gray-200'}`}>
                        <CardContent className="p-4">
                          <div className="text-center space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">{photoType.label}</Label>
                              {photoType.required && (
                                <Badge variant="outline" className="text-xs">Required</Badge>
                              )}
                            </div>
                            
                            {existingPhoto ? (
                              <div className="space-y-2">
                                <div className="relative">
                                  <img
                                    src={existingPhoto.dataUrl}
                                    alt={existingPhoto.description}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="absolute top-1 right-1 h-6 w-6 p-0"
                                    onClick={() => deletePhoto(existingPhoto.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  <span className="text-xs text-green-600">Captured</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Camera className="h-8 w-8 text-gray-400" />
                                </div>
                                <Button
                                  onClick={() => capturePhoto(photoType.id)}
                                  className="w-full"
                                  variant="outline"
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Capture Photo
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Room-by-Room Details
                  </CardTitle>
                  <Button onClick={addRoomDetail}>
                    Add Room
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {inspectionData.roomDetails.map((room, index) => (
                  <Card key={room.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Room Type</Label>
                          <Select 
                            value={room.roomType} 
                            onValueChange={(value) => updateRoomDetail(room.id, 'roomType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="living_room">Living Room</SelectItem>
                              <SelectItem value="bedroom">Bedroom</SelectItem>
                              <SelectItem value="kitchen">Kitchen</SelectItem>
                              <SelectItem value="bathroom">Bathroom</SelectItem>
                              <SelectItem value="dining_room">Dining Room</SelectItem>
                              <SelectItem value="office">Office</SelectItem>
                              <SelectItem value="storage">Storage</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Dimensions (L x W)</Label>
                          <Input
                            placeholder="e.g., 12ft x 10ft"
                            value={room.dimensions}
                            onChange={(e) => updateRoomDetail(room.id, 'dimensions', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Condition</Label>
                          <Select 
                            value={room.condition} 
                            onValueChange={(value) => updateRoomDetail(room.id, 'condition', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                              <SelectItem value="needs_repair">Needs Repair</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            placeholder="Additional room notes..."
                            value={room.notes}
                            onChange={(e) => updateRoomDetail(room.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {inspectionData.roomDetails.length === 0 && (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No rooms added yet</p>
                    <Button onClick={addRoomDetail} className="mt-4">
                      Add First Room
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Property Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Actual Bedrooms</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inspectionData.actualBedrooms}
                      onChange={(e) => updateInspectionData('actualBedrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Actual Bathrooms</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inspectionData.actualBathrooms}
                      onChange={(e) => updateInspectionData('actualBathrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Overall Property Condition</Label>
                    <Select 
                      value={inspectionData.propertyCondition} 
                      onValueChange={(value) => updateInspectionData('propertyCondition', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="dilapidated">Dilapidated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Structural Integrity</Label>
                    <Select 
                      value={inspectionData.structuralIntegrity} 
                      onValueChange={(value) => updateInspectionData('structuralIntegrity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select integrity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sound">Sound</SelectItem>
                        <SelectItem value="minor_issues">Minor Issues</SelectItem>
                        <SelectItem value="major_concerns">Major Concerns</SelectItem>
                        <SelectItem value="unsafe">Unsafe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Estimated Market Value (USD)</Label>
                    <Input
                      type="number"
                      placeholder="Enter estimated value"
                      value={inspectionData.estimatedValue}
                      onChange={(e) => updateInspectionData('estimatedValue', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Access & Location Notes</Label>
                  <Textarea
                    placeholder="Notes about property access, parking, security, etc..."
                    value={inspectionData.accessNotes}
                    onChange={(e) => updateInspectionData('accessNotes', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Inspector Notes</Label>
                  <Textarea
                    placeholder="Detailed observations about the property..."
                    value={inspectionData.inspectorNotes}
                    onChange={(e) => updateInspectionData('inspectorNotes', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Compliance Issues (if any)</Label>
                  <Textarea
                    placeholder="Building code violations, zoning issues, safety concerns..."
                    value={inspectionData.complianceIssues}
                    onChange={(e) => updateInspectionData('complianceIssues', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Complete Inspection */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">Complete Property Inspection</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure all required photos are captured and assessment details are filled out
                  </p>
                  
                  {/* Completion Checklist */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Required Photos</span>
                      <span className={getPhotoProgress() === 100 ? 'text-green-600' : 'text-orange-600'}>
                        {Math.round(getPhotoProgress())}% ({inspectionData.photos.filter(p => PHOTO_TYPES.find(pt => pt.id === p.type)?.required).length}/{PHOTO_TYPES.filter(pt => pt.required).length})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Property Condition</span>
                      <span className={inspectionData.propertyCondition ? 'text-green-600' : 'text-orange-600'}>
                        {inspectionData.propertyCondition ? '✓ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Inspector Notes</span>
                      <span className={inspectionData.inspectorNotes ? 'text-green-600' : 'text-orange-600'}>
                        {inspectionData.inspectorNotes ? '✓ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={completeInspection}
                    className="w-full"
                    size="lg"
                    disabled={getPhotoProgress() < 100 || !inspectionData.propertyCondition || !inspectionData.inspectorNotes}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Complete & Submit Inspection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}