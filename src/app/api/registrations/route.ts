import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, CreateRegistrationRequest, GSTRegistration, PaginatedResponse } from '../../../types/api';

// ============================================================================
// Mock Database (Replace with actual database)
// ============================================================================

const mockRegistrations: GSTRegistration[] = [];

// ============================================================================
// GET - Fetch Registrations
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PaginatedResponse<GSTRegistration>>>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const formType = searchParams.get('formType');

    // Filter registrations
    let filteredRegistrations = [...mockRegistrations];
    
    if (status) {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.status === status);
    }
    
    if (formType) {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.formType === formType);
    }

    // Pagination
    const total = filteredRegistrations.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredRegistrations.slice(startIndex, endIndex);

    const response: PaginatedResponse<GSTRegistration> = {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Fetch registrations error:', error);
    
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
// POST - Create Registration
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<GSTRegistration>>> {
  try {
    const body: CreateRegistrationRequest = await request.json();
    const { formType, personalInfo, businessInfo, propertyInfo } = body;
    const normalizedPropertyInfo = (propertyInfo || []).map((prop, index) => ({
      id: `prop-${Date.now()}-${index}`,
      ...prop,
    }));

    // Validate input
    if (!formType || !personalInfo) {
      return NextResponse.json({
        success: false,
        error: {
          name: 'ValidationError',
          code: 'VALIDATION_ERROR',
          message: 'Form type and personal information are required',
          statusCode: 400,
        },
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Validate form type
    if (!['IN-01', 'RF-01'].includes(formType)) {
      return NextResponse.json({
        success: false,
        error: {
          name: 'ValidationError',
          code: 'VALIDATION_ERROR',
          message: 'Invalid form type',
          field: 'formType',
          statusCode: 400,
        },
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Validate personal info
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {
      return NextResponse.json({
        success: false,
        error: {
          name: 'ValidationError',
          code: 'VALIDATION_ERROR',
          message: 'First name, last name, and email are required',
          statusCode: 400,
        },
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Create new registration
    const newRegistration: GSTRegistration = {
      id: `reg-${Date.now()}`,
      userId: 'current-user-id', // In real app, get from auth token
      formType,
      status: 'draft',
      personalInfo,
      businessInfo,
      propertyInfo: normalizedPropertyInfo,
      documents: [],
      fees: {
        registrationFee: 100,
        processingFee: 50,
        totalAmount: 150,
        paidAmount: 0,
        paymentStatus: 'pending',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database
    mockRegistrations.push(newRegistration);

    return NextResponse.json({
      success: true,
      data: newRegistration,
      message: 'Registration created successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Create registration error:', error);
    
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

