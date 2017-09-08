import sql from 'mssql';
import _ from 'lodash';
import Promise from 'bluebird';
import { SourceAction } from './actions';

sql.Promise = require('bluebird');

export default class SourceFfxAction extends SourceAction {
  constructor(config, destination) {
    super(config, destination);
    console.log('SourceFfxAction.constructor: ', this.config);
  }

  init() {
    this.startSchedule();
  }

  static query(query, key, inputs = []) {
    const request = new sql.Request();

    inputs.forEach((args) => {
      request.input(...args);
    });

    return request.query(query)
    .then((results) => {
      const res = {};
      res[key] = (results.rowsAffected[0] === 1) ? results.recordset[0] : results.recordsets[0];
      return res;
    });
  }

  static getRows(table, id, idColumn = 'eid') {
    return SourceFfxAction.query(`SELECT * from ${table} where ${idColumn}=${id}`, table);
  }

  static getEvent(id) {
    return SourceFfxAction.query(`
      SELECT TOP (100) PERCENT
      dbo.agency_event.num_1 AS event_num,
      dbo.agency_event.eid AS event_id,
      dbo.agency_event.dgroup AS disp_group,
      dbo.common_event.clname AS caller_name,
      dbo.common_event.cstr_add AS caller_str_addr,
      dbo.common_event.estnum AS event_str_num,
      dbo.common_event.edirpre AS event_str_prefix,
      dbo.common_event.efeanme AS event_str_name,
      dbo.common_event.efeatyp AS event_str_type,
      dbo.common_event.edirsuf AS event_str_suffix,
      dbo.common_event.eapt AS event_apt,
      dbo.common_event.earea AS event_area,
      dbo.common_event.emun AS event_city,
      dbo.common_event.zip,
      dbo.common_event.ecompl AS event_com_place,
      dbo.common_event.xstreet1,
      dbo.common_event.xstreet2,
      dbo.common_event.x_cord,
      dbo.common_event.y_cord,
      dbo.common_event.fire_esz,
      dbo.agency_event.esz AS fire_box,
      dbo.common_event.adc_mapgrid,
      dbo.common_event.tax_mapgrid,
      dbo.common_event.patient,
      dbo.agency_event.priority,
      dbo.agency_event.alarm_lev,
      dbo.agency_event.lev3 AS first_due,
      dbo.agency_event.lev4 AS incident_battalion,
      dbo.agency_event.assigned_units,
      CAST(SUBSTRING(dbo.agency_event.sdts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.sdts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.sdts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.sdts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.sdts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.sdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS call_receive_ts,
      CAST(SUBSTRING(dbo.agency_event.ad_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.ad_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.ad_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.ad_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.ad_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.ad_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS alarm_time_ts,
      CAST(SUBSTRING(dbo.agency_event.ds_ts, 1, 4) + '-' + sUBSTRING(dbo.agency_event.ds_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.ds_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.ds_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.ds_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.ds_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_disp_ts,
      CAST(SUBSTRING(dbo.agency_event.en_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.en_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.en_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.en_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.en_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.en_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_enr_ts,
      CAST(SUBSTRING(dbo.agency_event.ar_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.ar_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.ar_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.ar_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.ar_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.ar_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_arrive_ts,
      CAST(SUBSTRING(dbo.agency_event.tr_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.tr_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.tr_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.tr_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.tr_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.tr_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_transport_ts,
      CAST(SUBSTRING(dbo.agency_event.ta_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.ta_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.ta_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.ta_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.ta_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.ta_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_trans_ar_ts,
      CAST(SUBSTRING(dbo.agency_event.xdts, 1, 4) + '-' + sUBSTRING(dbo.agency_event.xdts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.xdts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.xdts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.xdts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.xdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS last_unit_close_ts,
      dbo.agency_event.xcmt AS closing_cmt,
      dbo.agency_event.tycod AS event_type,
      dbo.agency_event.typ_eng AS event_type_descr,
      dbo.FFX_ICAD_Types.Event_Code AS event_type_code,
      dbo.FFX_ICAD_Types.EMS_Type,
      dbo.FFX_ICAD_Types.Reportable,
      dbo.common_event.cdts AS employee_key,
      dbo.agency_event.sdts,
      dbo.FFX_ICAD_Types.SpecialOperations,
      dbo.agency_event.is_open,
      dbo.agency_event.open_and_curent
      FROM  dbo.agency_event
      INNER JOIN dbo.common_event ON dbo.agency_event.eid = dbo.common_event.eid
      INNER JOIN dbo.FFX_ICAD_Types ON dbo.agency_event.tycod = dbo.FFX_ICAD_Types.Evt_Typ
      WHERE dbo.common_event.eid=@eid
      ORDER BY dbo.agency_event.sdts
      `, 'event', [['eid', sql.Int, id]]);
  }


  static getPersonnel(table, id) {
    return SourceFfxAction.query(`SELECT *
      FROM un_hi_persl
      WHERE un_hi_rec_id IN (SELECT unique_id FROM un_hi WHERE eid=@id)`,
      table, [['id', sql.Int, id]]);
  }

  static processIncident(id) {
    return Promise.all([
      SourceFfxAction.getEvent(id),
      SourceFfxAction.getRows('V_Unit_History_Current', id, 'event_id'),
      SourceFfxAction.getPersonnel('un_hi_persl', id),
    ]);
  }

  static findNewIncidents() {
    const request = new sql.Request();
    return request.query(`SELECT eid
      FROM agency_event
      WHERE eid NOT IN (SELECT event_id FROM spade_log WHERE closed=1)`);
  }

  static logIncident(eventId, closed) {
    const query = `IF NOT EXISTS(SELECT * FROM spade_log where event_id=@event_id)
      INSERT INTO dbo.spade_log(event_id, closed)
      VALUES (@event_id, @closed)
    ELSE
      UPDATE dbo.spade_log
      SET closed=@closed,updated_at=CURRENT_TIMESTAMP
      WHERE event_id=@event_id`;

    const request = new sql.Request();
    request.input('event_id', sql.Int, eventId);
    request.input('closed', sql.Bit, closed);

    return request.query(query);
  }

  static createLogTable() {
    const query = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='spade_log' AND xtype='U')
    CREATE TABLE spade_log (
        event_id int not null,
        updated_at datetime default CURRENT_TIMESTAMP,
        closed bit default 0
    )`;
    const request = new sql.Request();
    return request.query(query)
  }

  run() {
    console.log('----[ SourceFfxAction.run start');
    const self = this;
    return sql.connect(this.config.ffx)
      .then(SourceFfxAction.createLogTable)
      .then(SourceFfxAction.findNewIncidents)
      .then((ids) => {
        return Promise.map(ids.recordsets[0], (id) => {
          return SourceFfxAction.processIncident(id.eid)
          .then((res) => {
            const merged = _.assign(...res);
            return self.destination.run(`${merged.event.event_num}.json`, merged)
              .then(() => SourceFfxAction.logIncident(merged.event.event_id, merged.event.is_open === 'F' ? 1 : 0));
          })
        }, { concurrency: 10 });
      })
      .finally(sql.close);
  }

  finalize() {
    console.log('SourceFfxAction.finalize: ', this.config);
  }
}
