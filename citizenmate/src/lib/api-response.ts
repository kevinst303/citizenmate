import { NextResponse } from 'next/server';

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ data }, { status });
}

export function errorResponse(message: string, status: number = 400): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorizedResponse(): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function internalErrorResponse(): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: 'Internal error' }, { status: 500 });
}
