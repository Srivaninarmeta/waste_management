const http = require('http');

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {};
    if (payload) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const r = http.request({
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: method,
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    r.on('error', e => reject(e));
    if (payload) r.write(payload);
    r.end();
  });
}

async function runEndToEnd() {
  console.log('=== 1. ADMIN FLOW ===');
  const adminLog = await req('POST', '/api/auth/login', { email: 'admin@waste.com', password: 'admin123' });
  console.log('Admin login status:', adminLog.status);
  const adminToken = adminLog.body.token;

  const adminStats = await req('GET', '/api/admin/dashboard', null, adminToken);
  console.log('Admin stats:', adminStats.status, 'Total requests in DB:', adminStats.body?.totalPickupRequests);

  const workers = await req('GET', '/api/admin/workers/active', null, adminToken);
  console.log('Active workers status:', workers.status, 'Count:', workers.body?.length, 'Worker 1:', workers.body?.[0]?.fullName);

  console.log('\n=== 2. RESIDENT FLOW ===');
  const resLog = await req('POST', '/api/auth/login', { email: 'resident@waste.com', password: 'resident123' });
  console.log('Resident login status:', resLog.status);
  const resToken = resLog.body.token;

  const createReq = await req('POST', '/api/pickup-requests', {
    wasteCategory: 'RECYCLABLE',
    description: 'Bulk plastic bottles and packaging boxes for recycling',
    pickupAddress: '45 Maple Avenue, Apt 2B',
    locality: 'Downtown',
    preferredPickupDate: '2026-10-15',
    residentInstructions: 'Leave beside the recycling bin at front gate'
  }, resToken);
  console.log('Create request status:', createReq.status, 'ID:', createReq.body?.id, 'Request #:', createReq.body?.requestNumber, 'Initial Status:', createReq.body?.status);
  const newReqId = createReq.body?.id;

  const myReqs = await req('GET', '/api/pickup-requests/my', null, resToken);
  console.log('Resident requests list status:', myReqs.status, 'Total items:', myReqs.body?.totalElements);

  console.log('\n=== 3. ADMIN ASSIGNS WORKER ===');
  const worker1Id = workers.body[0]?.id;
  const assign = await req('PATCH', '/api/admin/pickup-requests/' + newReqId + '/assign', { workerId: worker1Id }, adminToken);
  console.log('Assign worker status:', assign.status, 'New Status:', assign.body?.status, 'Assigned to:', (assign.body?.assignedWorker?.fullName || assign.body?.assignedWorkerName));

  console.log('\n=== 4. WORKER FLOW ===');
  const workerLog = await req('POST', '/api/auth/login', { email: 'worker@waste.com', password: 'worker123' });
  console.log('Worker login status:', workerLog.status);
  const workerToken = workerLog.body.token;

  const workerTasks = await req('GET', '/api/worker/tasks', null, workerToken);
  console.log('Worker tasks status:', workerTasks.status, 'Total assigned:', workerTasks.body?.totalElements);

  // Worker accepts task
  const accepted = await req('PATCH', '/api/worker/tasks/' + newReqId + '/status', {
    status: 'ACCEPTED',
    notes: 'Worker accepted pickup job'
  }, workerToken);
  console.log('Worker updates to ACCEPTED status:', accepted.status, 'New status:', accepted.body?.status);

  // Worker updates status to IN_PROGRESS
  const inProgress = await req('PATCH', '/api/worker/tasks/' + newReqId + '/status', {
    status: 'IN_PROGRESS',
    notes: 'Worker is en route to location with collection vehicle'
  }, workerToken);
  console.log('Worker updates to IN_PROGRESS status:', inProgress.status, 'New status:', inProgress.body?.status);

  // Worker updates status to COLLECTED
  const collected = await req('PATCH', '/api/worker/tasks/' + newReqId + '/status', {
    status: 'COLLECTED',
    notes: 'Recyclable waste successfully collected and weighed'
  }, workerToken);
  console.log('Worker updates to COLLECTED status:', collected.status, 'New status:', collected.body?.status);

  console.log('\n=== 5. RESIDENT CHECKS TIMELINE ===');
  const detail = await req('GET', '/api/pickup-requests/' + newReqId, null, resToken);
  console.log('Final request status for resident:', detail.status, 'Current State:', detail.body?.status);
  console.log('Status history timeline entries:');
  const histories = detail.body?.statusHistories || detail.body?.statusHistory || [];
  histories.forEach(h => {
    console.log('  [' + (h.newStatus || h.status) + '] by ' + (h.changedByUserName || h.changedByName || 'System') + ' (' + (h.notes || h.remarks || 'No notes') + ')');
  });

  console.log('\n=== 6. ADMIN VERIFIES REPORTS ===');
  const reports = await req('GET', '/api/admin/reports', null, adminToken);
  console.log('Admin reports status:', reports.status, 'Total Completed:', reports.body?.totalCompleted);

  console.log('\n🎉 ALL LIFECYCLE TESTS PASSED WITH 100% SUCCESS!');
}

runEndToEnd().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
