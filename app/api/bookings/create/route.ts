import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await request.json();
    const {
      boardingHouseId,
      tenantName,
      roomName,
      amount,
      startDate,
      durationMonths,
    } = body;

    if (!boardingHouseId || !tenantName || !amount) {
      return NextResponse.json(
        { error: 'Data booking tidak lengkap.' },
        { status: 400 }
      );
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const invoice = `INV-${new Date().getFullYear()}-${randomDigits}`;
    const confirmToken = crypto.randomBytes(24).toString('hex');
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert({
        invoice,
        tenant_name: tenantName,
        boarding_house_id: boardingHouseId,
        room_name: roomName || 'Standard Room',
        amount: Number(amount),
        start_date: startDate || today,
        duration_months: Number(durationMonths) || 1,
        status: 'Pending',
        date: today,
        confirm_token: confirmToken,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert transaction error:', error);
      return NextResponse.json(
        { error: 'Gagal menyimpan transaksi.' },
        { status: 500 }
      );
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    const confirmUrl = `${origin}/api/bookings/confirm?code=${encodeURIComponent(
      invoice
    )}&token=${encodeURIComponent(confirmToken)}`;

    const cancelUrl = `${origin}/api/bookings/cancel?code=${encodeURIComponent(
      invoice
    )}&token=${encodeURIComponent(confirmToken)}`;

    return NextResponse.json({
      transaction: data,
      invoice,
      confirmUrl,
      cancelUrl,
    });
  } catch (err) {
    console.error('Booking API error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}