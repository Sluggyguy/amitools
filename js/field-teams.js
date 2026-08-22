(function () {
  'use strict';

  var timers = Object.create(null);
  var channel = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createShareKey() {
    var bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes).map(function (value) { return value.toString(16).padStart(2, '0'); }).join('');
  }

  function ensureShareKey(team) {
    if (!team) return '';
    if (!/^[0-9a-f]{64}$/.test(String(team.shareKey || ''))) team.shareKey = createShareKey();
    return team.shareKey;
  }

  async function getClient() {
    if (!window.AMIToolsData) throw new Error('Le service de donnees est indisponible.');
    await window.AMIToolsData.ready;
    var client = window.AMIToolsData.getClient && window.AMIToolsData.getClient();
    if (!client) throw new Error('La base en ligne n\'est pas configuree.');
    return client;
  }

  function teamPayload(team, source) {
    return {
      active: team.active !== false,
      source: source || team.source || 'unknown',
      serviceSlot: team.serviceSlot || '',
      specialStart: team.specialStart || '',
      specialEnd: team.specialEnd || '',
      phoneNumber: team.phoneNumber || '',
      kizeoNumber: team.kizeoNumber || '',
      phoneAssignedTo: team.phoneAssignedTo || '',
      pauseStart: team.pauseStart || '',
      comment: team.comment || team.validatedComment || '',
      members: Array.isArray(team.members) ? clone(team.members) : [],
      missions: Array.isArray(team.missions) ? clone(team.missions) : []
    };
  }

  async function publishTeam(team, source) {
    if (!team) throw new Error('Equipe manquante.');
    var key = ensureShareKey(team);
    var serviceDate = String(team.serviceDate || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(serviceDate)) throw new Error('Date de service invalide.');
    var client = await getClient();
    var response = await client.rpc('publish_field_team', {
      p_team_key: key,
      p_service_date: serviceDate,
      p_team_label: String(team.label || team.teamLabel || 'Equipe terrain').trim().slice(0, 80),
      p_data: teamPayload(team, source)
    });
    if (response.error) throw response.error;
    return response.data;
  }

  function schedulePublish(team, source, onStatus) {
    if (!team || !team.serviceDate) return;
    var key = ensureShareKey(team);
    var snapshot = clone(team);
    snapshot.shareKey = key;
    if (timers[key]) window.clearTimeout(timers[key]);
    if (typeof onStatus === 'function') onStatus('pending');
    timers[key] = window.setTimeout(function () {
      delete timers[key];
      publishTeam(snapshot, source).then(function (result) {
        if (typeof onStatus === 'function') onStatus('saved', result);
      }).catch(function (error) {
        if (window.console && console.warn) console.warn('Partage equipe impossible:', error && error.message ? error.message : error);
        if (typeof onStatus === 'function') onStatus('error', error);
      });
    }, 700);
  }

  async function archiveTeam(team) {
    if (!team || !/^[0-9a-f]{64}$/.test(String(team.shareKey || ''))) return;
    if (timers[team.shareKey]) {
      window.clearTimeout(timers[team.shareKey]);
      delete timers[team.shareKey];
    }
    var client = await getClient();
    var response = await client.rpc('archive_field_team', { p_team_key: team.shareKey });
    if (response.error) throw response.error;
  }

  async function listTeams(serviceDate) {
    var client = await getClient();
    var response = await client.from('field_teams')
      .select('id, service_date, team_label, data, updated_at')
      .eq('service_date', serviceDate)
      .order('team_label', { ascending: true });
    if (response.error) throw response.error;
    return (response.data || []).filter(function (row) { return !row.data || row.data.active !== false; });
  }

  async function isAdmin() {
    var client = await getClient();
    var userResponse = await client.auth.getUser();
    var user = userResponse.data && userResponse.data.user;
    if (!user) return false;
    var response = await client.from('app_admins').select('user_id').eq('user_id', user.id).maybeSingle();
    if (response.error) throw response.error;
    return !!response.data;
  }

  async function subscribe(serviceDate, onChange, onStatus) {
    await unsubscribe();
    var client = await getClient();
    channel = client.channel('amitools-field-teams-' + serviceDate)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'field_teams',
        filter: 'service_date=eq.' + serviceDate
      }, function (payload) {
        if (typeof onChange === 'function') onChange(payload);
      })
      .subscribe(function (status) {
        if (typeof onStatus === 'function') onStatus(status);
      });
    return channel;
  }

  async function unsubscribe() {
    if (!channel) return;
    var previous = channel;
    channel = null;
    try {
      var client = await getClient();
      await client.removeChannel(previous);
    } catch (_) {}
  }

  window.AMIToolsFieldTeams = {
    createShareKey: createShareKey,
    ensureShareKey: ensureShareKey,
    publishTeam: publishTeam,
    schedulePublish: schedulePublish,
    archiveTeam: archiveTeam,
    listTeams: listTeams,
    isAdmin: isAdmin,
    subscribe: subscribe,
    unsubscribe: unsubscribe
  };
})();
