(function () {
  'use strict';

  var CACHE_KEY = 'amitools-network-catalog-v2';
  var TABLE_NAME = 'network_catalog';
  var ROW_ID = 'main';

  var DEFAULT_CATALOG = {
    schemaVersion: 1,
    name: 'Reseau AMITOOLS',
    serviceSlots: [
      { id: 'M', label: 'M · 7h - 14h', start: '07:00', end: '14:00', sortOrder: 10, active: true },
      { id: 'J', label: 'J · 10h - 17h', start: '10:00', end: '17:00', sortOrder: 20, active: true },
      { id: 'AM', label: 'AM · 12h50 - 19h50', start: '12:50', end: '19:50', sortOrder: 30, active: true },
      { id: 'S01', label: 'S01 · 15h30 - 22h30', start: '15:30', end: '22:30', sortOrder: 40, active: true },
      { id: 'S05', label: 'S05 · 17h - 0h00', start: '17:00', end: '00:00', sortOrder: 50, active: true },
      { id: 'SPE', label: 'Spé · horaires libres', start: '', end: '', sortOrder: 60, active: true }
    ],
    missionTypes: ['Cabotage', 'Embarquement', 'PAP', 'Pôle échange', 'Médiation sociale', 'Autre'],
    otherMissionTypes: ['RDS', 'TAC', 'STAR me guide', 'SNCF'],
    places: {
      pap: ['REP', 'POT', 'TRI', 'VU', 'HFR', 'GAR', 'STAa', 'STAb', 'IJC', 'CLE', 'SGE'],
      boarding: ['SJG', 'REP', 'STAa ( JFK )', 'STAb ( CVI )', 'GARa ( JFK )', 'GARb ( CVI )', 'Navette Stade'],
      sncf: ['Dinan', 'Messac', 'Vitré']
    },
    metroLines: [
      {
        id: 'metroA', code: 'A', name: 'Métro A', color: '#d93a3a', active: true, sortOrder: 10,
        sectors: [
          { id: 'metro-a-nord-anf', label: 'CAB nord ANF', stations: ['PON', 'VU', 'JFK'], active: true, sortOrder: 10 },
          { id: 'metro-a-nord-spe-jfk', label: 'CAB nord ( spé ) JFK', stations: ['PON', 'ANF'], active: true, sortOrder: 20 },
          { id: 'metro-a-centre-sta', label: 'CAB centre STA', stations: ['REP', 'CDG', 'GAR'], active: true, sortOrder: 30 },
          { id: 'metro-a-centre-spe-gar', label: 'CAB centre ( spé ) GAR', stations: ['CDG', 'REP'], active: true, sortOrder: 40 },
          { id: 'metro-a-sud-hfr', label: 'CAB sud HFR', stations: ['GCL', 'JCA'], active: true, sortOrder: 50 },
          { id: 'metro-a-sud-spe-gcl', label: 'CAB Sud ( spé ) GCL', stations: ['JCA', 'HFR'], active: true, sortOrder: 60 },
          { id: 'metro-a-sud-pot', label: 'CAB sud POT', stations: ['BLO', 'TRI', 'ITA'], active: true, sortOrder: 70 }
        ]
      },
      {
        id: 'metroB', code: 'B', name: 'Métro B', color: '#22a55a', active: true, sortOrder: 20,
        sectors: [
          { id: 'metro-b-sud-mab', label: 'CAB sud MAB', stations: ['CLE', 'LCO', 'SJG'], active: true, sortOrder: 10 },
          { id: 'metro-b-centre-sge', label: 'CAB centre SGE', stations: ['GARB', 'COL'], active: true, sortOrder: 20 },
          { id: 'metro-b-centre-col', label: 'CAB centre COL', stations: ['GAR', 'SGE', 'STAb'], active: true, sortOrder: 30 },
          { id: 'metro-b-nord-lga', label: 'CAB nord LGA', stations: ['GCH', 'JFE', 'STAb'], active: true, sortOrder: 40 },
          { id: 'metro-b-nord-cvi', label: 'CAB nord CVI', stations: ['ATA', 'BUN', 'IJC'], active: true, sortOrder: 50 },
          { id: 'metro-b-nord-spe-cvi', label: 'CAB nord ( spé ) CVI', stations: ['ATA', 'BUN'], active: true, sortOrder: 60 }
        ]
      }
    ],
    busLines: [
      { id: 'bus-c1', code: 'C1', name: 'Ligne C1', active: true, sortOrder: 10, zones: [{ id: 'Z1', label: 'St Grégoire Champs Daguet' }, { id: 'Z3', label: 'Chantepie Rosa Parks' }], stations: [] },
      { id: 'bus-c2', code: 'C2', name: 'Ligne C2', active: true, sortOrder: 20, zones: [{ id: 'Z2', label: 'Cesson-Cévigné Champs Blancs' }, { id: 'Z3', label: 'Haut Sancé' }], stations: [] },
      { id: 'bus-c3', code: 'C3', name: 'Ligne C3', active: true, sortOrder: 30, zones: [{ id: 'Z1', label: 'Patton' }, { id: 'Z4', label: 'Henri Fréville' }], stations: [] },
      { id: 'bus-c4', code: 'C4', name: 'Ligne C4', active: true, sortOrder: 40, zones: [{ id: 'Z1', label: 'St Grégoire Grand Quartier' }, { id: 'Z3', label: 'ZA Saint-Sulpice' }], stations: [] },
      { id: 'bus-c5', code: 'C5', name: 'Ligne C5', active: true, sortOrder: 50, zones: [{ id: 'Z2', label: 'Saint-Laurent' }, { id: 'Z4', label: 'Lycée Bréquigny' }], stations: [] },
      { id: 'bus-c6', code: 'C6', name: 'Ligne C6', active: true, sortOrder: 60, zones: [{ id: 'Z3', label: 'Cesson-Sévigné Rigourdière' }, { id: 'Z4', label: 'St Jacques de la Lande Aéroport' }], stations: [] },
      { id: 'bus-l10', code: 'L10', name: 'Ligne 10', active: true, sortOrder: 70, zones: [{ id: 'Z2', label: 'Beaulieu Chimie' }, { id: 'Z4', label: 'Porte de Cleunay' }], stations: [] },
      { id: 'bus-l11', code: 'L11', name: 'Ligne 11', active: true, sortOrder: 80, zones: [{ id: 'Z1', label: 'Vezin-le-Coquet ZI Ouest' }, { id: 'Z3', label: 'La Poterie' }], stations: [] },
      { id: 'bus-l12', code: 'L12', name: 'Ligne 12', active: true, sortOrder: 90, zones: [{ id: 'Z1', label: 'Villejean Université' }, { id: 'Z4', label: 'La Poterie' }], stations: [] },
      { id: 'bus-l13', code: 'L13', name: 'Ligne 13', active: true, sortOrder: 100, zones: [{ id: 'Z3', label: 'Chantepie Cucé' }, { id: 'Z4', label: 'Bruz Porte de Ker Lann' }], stations: [] },
      { id: 'bus-l14', code: 'L14', name: 'Ligne 14', active: true, sortOrder: 110, zones: [{ id: 'Z1', label: 'Roazhon Park' }, { id: 'Z2', label: 'Cesson-Cévigné Monniais' }], stations: [] }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function byOrder(a, b) {
    return Number(a.sortOrder || 0) - Number(b.sortOrder || 0) || String(a.code || a.label || '').localeCompare(String(b.code || b.label || ''), 'fr');
  }

  function validCatalog(value) {
    return !!(value && Number(value.schemaVersion) >= 1 && Array.isArray(value.metroLines) && Array.isArray(value.busLines));
  }

  function readCache() {
    try {
      var value = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      return validCatalog(value) ? value : null;
    } catch (_) {
      return null;
    }
  }

  function writeCache(value) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(value)); } catch (_) {}
  }

  var catalog = readCache() || clone(DEFAULT_CATALOG);
  var metadata = { source: readCache() ? 'cache' : 'local', revision: 0, updatedAt: null, error: null };
  var client = null;
  var channel = null;
  var readyResolve;
  var ready = new Promise(function (resolve) { readyResolve = resolve; });

  function derive(value) {
    var source = value || catalog;
    var slotMap = {};
    var cabotageMap = {};
    var busZoneMap = {};
    var busZoneDetailMap = {};
    (source.serviceSlots || []).filter(function (x) { return x.active !== false; }).sort(byOrder).forEach(function (slot) {
      slotMap[slot.id] = { start: slot.start || '', end: slot.end || '' };
    });
    (source.metroLines || []).filter(function (x) { return x.active !== false; }).sort(byOrder).forEach(function (line) {
      cabotageMap[line.id] = {};
      (line.sectors || []).filter(function (x) { return x.active !== false; }).sort(byOrder).forEach(function (sector) {
        cabotageMap[line.id][sector.label] = (sector.stations || []).join(' - ');
      });
    });
    (source.busLines || []).filter(function (x) { return x.active !== false; }).sort(byOrder).forEach(function (line) {
      busZoneMap[line.code] = (line.zones || []).map(function (zone) { return zone.id; });
      (line.zones || []).forEach(function (zone) { busZoneDetailMap[line.code + '|' + zone.id] = zone.label || ''; });
    });
    return { slotMap: slotMap, cabotageMap: cabotageMap, busZoneMap: busZoneMap, busZoneDetailMap: busZoneDetailMap };
  }

  function emit() {
    document.dispatchEvent(new CustomEvent('amitools:catalog-changed', { detail: { catalog: clone(catalog), metadata: Object.assign({}, metadata) } }));
  }

  function setCatalog(next, nextMetadata) {
    if (!validCatalog(next)) throw new Error('Catalogue reseau invalide');
    catalog = clone(next);
    metadata = Object.assign({}, metadata, nextMetadata || {});
    writeCache(catalog);
    emit();
  }

  function getConfig() {
    var config = window.AMITOOLS_CONFIG || {};
    return {
      url: String(config.supabaseUrl || '').trim(),
      key: String(config.supabasePublishableKey || '').trim()
    };
  }

  async function loadRemote() {
    var config = getConfig();
    if (!config.url || !config.key || !window.supabase || !window.supabase.createClient) {
      metadata.source = metadata.source === 'cache' ? 'cache' : 'local';
      metadata.error = 'Base en ligne non configuree';
      readyResolve(clone(catalog));
      emit();
      return catalog;
    }
    client = window.supabase.createClient(config.url, config.key, { auth: { persistSession: true, autoRefreshToken: true } });
    var response = await client.from(TABLE_NAME).select('data, revision, updated_at').eq('id', ROW_ID).maybeSingle();
    if (response.error) throw response.error;
    if (response.data && validCatalog(response.data.data)) {
      setCatalog(response.data.data, { source: 'remote', revision: Number(response.data.revision || 0), updatedAt: response.data.updated_at || null, error: null });
    } else {
      metadata.source = 'local';
      metadata.error = 'Catalogue distant vide';
      emit();
    }
    channel = client.channel('amitools-network-catalog').on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME, filter: 'id=eq.' + ROW_ID }, function (payload) {
      var row = payload.new;
      if (row && validCatalog(row.data)) setCatalog(row.data, { source: 'remote', revision: Number(row.revision || 0), updatedAt: row.updated_at || null, error: null });
    }).subscribe();
    readyResolve(clone(catalog));
    return catalog;
  }

  async function saveCatalog(next) {
    if (!client) throw new Error('La base en ligne n\'est pas configuree.');
    if (!validCatalog(next)) throw new Error('Catalogue reseau invalide.');
    var userResponse = await client.auth.getUser();
    if (userResponse.error || !userResponse.data.user) throw new Error('Connexion referent requise.');
    var response = await client.from(TABLE_NAME).upsert({ id: ROW_ID, data: next, updated_by: userResponse.data.user.id }, { onConflict: 'id' }).select('data, revision, updated_at').single();
    if (response.error) throw response.error;
    setCatalog(response.data.data, { source: 'remote', revision: Number(response.data.revision || 0), updatedAt: response.data.updated_at || null, error: null });
    return clone(catalog);
  }

  async function signIn(email, password) {
    if (!client) throw new Error('La base en ligne n\'est pas configuree.');
    var response = await client.auth.signInWithPassword({ email: email, password: password });
    if (response.error) throw response.error;
    return response.data;
  }

  async function signOut() {
    if (client) await client.auth.signOut();
  }

  async function getUser() {
    if (!client) return null;
    var response = await client.auth.getUser();
    return response.data ? response.data.user : null;
  }

  window.AMIToolsData = {
    ready: ready,
    initialize: loadRemote,
    getCatalog: function () { return clone(catalog); },
    getDefaultCatalog: function () { return clone(DEFAULT_CATALOG); },
    getMetadata: function () { return Object.assign({}, metadata); },
    derive: derive,
    saveCatalog: saveCatalog,
    signIn: signIn,
    signOut: signOut,
    getUser: getUser,
    isConfigured: function () { var config = getConfig(); return !!(config.url && config.key); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { loadRemote().catch(function (error) { metadata.error = error.message; metadata.source = metadata.source === 'cache' ? 'cache' : 'local'; readyResolve(clone(catalog)); emit(); }); }, { once: true });
  else loadRemote().catch(function (error) { metadata.error = error.message; readyResolve(clone(catalog)); emit(); });
})();
