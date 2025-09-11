import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, GSTRegistration, UpdateRegistrationRequest, BusinessInfo } from '../../../../types/api';

// ============================================================================
// Mock Database (Replace with actual database)
// ============================================================================

const mockRegistrations: GSTRegistration[] = [];

// ============================================================================
// GET - Fetch Single Registration
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<GSTRegistration>>> {
  try {
    const { id } = await params;

    // Find registration
    const registration = mockRegistrations.find(reg => reg.id === id);
    
    if (!registration) {
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

    return NextResponse.json({
      success: true,
      data: registration,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Fetch registration error:', error);
    
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
// PUT - Update Registration
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<GSTRegistration>>> {
  try {
    const { id } = await params;
    const body: UpdateRegistrationRequest = await request.json();

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

    // Check if registration can be updated
    if (existingRegistration.status === 'submitted' || existingRegistration.status === 'approved') {
      return NextResponse.json({
        success: false,
        error: {
          name: 'ConflictError',
          code: 'CONFLICT',
          message: 'Cannot update submitted or approved registration',
          statusCode: 409,
        },
        timestamp: new Date().toISOString(),
      }, { status: 409 });
    }

    // Update registration
    const updatedRegistration: GSTRegistration = {
      ...existingRegistration,
      personalInfo: { ...existingRegistration.personalInfo, ...body.personalInfo },
      businessInfo: body.businessInfo && existingRegistration.businessInfo 
        ? { ...existingRegistration.businessInfo, ...body.businessInfo } as BusinessInfo
        : existingRegistration.businessInfo,
      propertyInfo: body.propertyInfo || existingRegistration.propertyInfo,
      updatedAt: new Date().toISOString(),
    };

    // Update in mock database
    mockRegistrations[registrationIndex] = updatedRegistration;

    return NextResponse.json({  
      success: true,
      data: updatedRegistration,
      message: 'Registration updated successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Update registration error:', error);
    
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
// DELETE - Delete Registration
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
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

    // Check if registration can be deleted
    if (existingRegistration.status === 'submitted' || existingRegistration.status === 'approved') {
      return NextResponse.json({
        success: false,
        error: {
          name: 'ConflictError',
          code: 'CONFLICT',
          message: 'Cannot delete submitted or approved registration',
          statusCode: 409,
        },
        timestamp: new Date().toISOString(),
      }, { status: 409 });
    }

    // Remove from mock database
    mockRegistrations.splice(registrationIndex, 1);

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Registration deleted successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Delete registration error:', error);
    
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

