import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, GSTRegistration } from '../../../../../types/api';

// ============================================================================
// Mock Database (Replace with actual database)
// ============================================================================

const mockRegistrations: GSTRegistration[] = [];

// ============================================================================
// POST - Submit Registration
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<GSTRegistration>>> {
  try {
    const { id } = await params;

    // Find registration
    const registrationIndex = mockRegistrations.findIndex(reg => reg.id === id);
    
    if (registrationIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          name: 'NotFoundError',
          code: 'NOT_FOUND',
          message: 'Registration not found',
          statusCode: 404,
        },
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    const existingRegistration = mockRegistrations[registrationIndex];

    // Check if registration can be submitted
    if (existingRegistration.status !== 'draft') {
      return NextResponse.json({
        success: false,
        error: {
          name: 'ConflictError',
          code: 'CONFLICT',
          message: 'Registration has already been submitted',
          statusCode: 409,
        },
        timestamp: new Date().toISOString(),
      }, { status: 409 });
    }

    // Validate required fields for submission
    if (!existingRegistration.personalInfo.firstName || 
        !existingRegistration.personalInfo.lastName || 
        !existingRegistration.personalInfo.email) {
      return NextResponse.json({
        success: false,
        error: {
          name: 'ValidationError',
          code: 'VALIDATION_ERROR',
          message: 'Personal information is incomplete',
          statusCode: 400,
        },
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Check if required documents are uploaded
    if (existingRegistration.documents.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          name: 'ValidationError',
          code: 'VALIDATION_ERROR',
          message: 'At least one document must be uploaded before submission',
          statusCode: 400,
        },
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Update registration status
    const updatedRegistration: GSTRegistration = {
      ...existingRegistration,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update in mock database
    mockRegistrations[registrationIndex] = updatedRegistration;

    // In a real application, you would:
    // 1. Send notification to admin/reviewer
    // 2. Log the submission
    // 3. Trigger any automated processes
    // 4. Send confirmation email to user

    return NextResponse.json({
      success: true,
      data: updatedRegistration,
      message: 'Registration submitted successfully for review',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Submit registration error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        name: 'ServerError',
        code: 'SERVER_ERROR',
        message: 'Internal server error',
        statusCode: 500,
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// ============================================================================
// OPTIONS Handler for CORS
// ============================================================================

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

