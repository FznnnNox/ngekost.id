import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const token = request.nextUrl.searchParams.get('token');

  if (!code || !token) {
    return new NextResponse('Link pembatalan tidak valid.', { status: 400 });
  }

  const { data: trx, error: findError } = await supabaseAdmin
    .from('transactions')
    .select('id, invoice, tenant_name, status, confirm_token')
    .eq('invoice', code)
    .single();

  if (findError || !trx || trx.confirm_token !== token) {
    return new NextResponse('Token atau kode invoice tidak valid.', {
      status: 403,
    });
  }

  const { error: updateError } = await supabaseAdmin
    .from('transactions')
    .update({ status: 'Cancelled' })
    .eq('id', trx.id);

  if (updateError) {
    return new NextResponse('Gagal memperbarui status transaksi.', {
      status: 500,
    });
  }

  return new NextResponse(
    `<!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Booking Dibatalkan - Ngekost.id</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #121212; color: #ededed; display: flex; min-height: 100vh; align-items: center; justify-content: center; margin: 0; padding: 16px; }
          .box { max-width: 420px; width: 100%; background: #1c1c1c; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 24px; text-align: center; }
          .badge { display: inline-block; background: rgba(239,68,68,0.15); color: #f87171; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
          p { color: #9c9c9c; font-size: 14px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="badge">CANCELLED</div>
          <h2>Booking Dibatalkan</h2>
          <p>Transaksi <strong>${trx.invoice}</strong> atas nama <strong>${trx.tenant_name}</strong> telah diperbarui menjadi <strong>Cancelled</strong> di sistem Ngekost.id.</p>
        </div>
      </body>
    </html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}