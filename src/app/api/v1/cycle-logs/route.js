import { authenticatedRoute } from '../../../../server/http/handler.js';
import { readJsonBody } from '../../../../server/http/validate.js';
import { getCycleSummary, logCycle } from '../../../../server/domains/cycleLogs.js';

export const dynamic = 'force-dynamic';

export const GET = authenticatedRoute(async ({ owner }) => ({
  body: await getCycleSummary(owner.id),
}));

export const POST = authenticatedRoute(async ({ request, owner }) => {
  const body = await readJsonBody(request);
  const entry = await logCycle(owner.id, body);
  return { status: 201, body: { entry } };
});
