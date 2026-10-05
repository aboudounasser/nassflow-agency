import { NextResponse, type NextRequest } from 'next/server';
import { checkCrmAccess, CRM_REALM } from '@/lib/crm/auth';

/**
 * Le seul proxy du site : il garde le CRM interne (/crm).
 *
 * C'est lui qui renvoie le 401 qui fait apparaître la demande
 * d'identifiants du navigateur — une page ne peut pas le faire. La page
 * et les Server Actions revérifient elles-mêmes (lib/crm/auth.ts) : le
 * proxy est la porte, pas la seule serrure.
 */
export function proxy(request: NextRequest) {
  const access = checkCrmAccess(request.headers.get('authorization'));

  if (access === 'granted') return NextResponse.next();

  if (access === 'disabled') {
    return new NextResponse('Not Found', { status: 404 });
  }

  return new NextResponse('Identifiants requis.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${CRM_REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  matcher: ['/crm', '/crm/:path*'],
};
