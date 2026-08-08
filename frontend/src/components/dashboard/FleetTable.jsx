import { useState, useMemo } from 'react';

import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

import { FLEET_DATA } from '../../data/sampleData';


// ==========================================================
// VALUE NORMALIZATION
// ==========================================================

function toPercentage(value) {

  const n = Number(value);

  if (!Number.isFinite(n)) {
    return 0;
  }

  // Backend may return:
  // 0.95 -> 95%
  if (n >= 0 && n <= 1) {
    return n * 100;
  }

  // Backend may already return:
  // 95 -> 95%
  return n;
}


// ==========================================================
// HEALTH COLOR
// ==========================================================

function healthColor(value) {

  const v = toPercentage(value);

  if (v >= 90) {
    return '#16A34A';
  }

  if (v >= 75) {
    return '#D97706';
  }

  if (v >= 60) {
    return '#EF4444';
  }

  return '#DC2626';
}


// ==========================================================
// RISK BADGE
// ==========================================================

function riskBadge(risk) {

  if (risk === 'Low') {
    return 'badge badge-green';
  }

  if (risk === 'Medium') {
    return 'badge badge-yellow';
  }

  return 'badge badge-red';
}


// ==========================================================
// STATUS BADGE
// ==========================================================

function statusBadge(status) {

  if (status === 'Nominal') {
    return 'badge badge-green';
  }

  if (status === 'Monitor') {
    return 'badge badge-yellow';
  }

  return 'badge badge-red';
}


// ==========================================================
// HEALTH BAR
// ==========================================================

function HealthBar({ value }) {

  const safeValue = Math.max(
    0,
    Math.min(100, Number(value) || 0)
  );

  const color = healthColor(
    safeValue
  );

  return (

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
      }}
    >

      <div
        style={{
          flex: 1,
          height: 4,
          background: '#F1F5F9',
          borderRadius: 100,
          overflow: 'hidden',
        }}
      >

        <div
          style={{
            height: '100%',
            width: `${safeValue}%`,
            background: color,
            borderRadius: 100,
            transition: 'width 0.4s ease',
          }}
        />

      </div>

      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color,
          fontFamily: 'monospace',
          minWidth: 42,
        }}
      >
        {safeValue.toFixed(1)}%
      </span>

    </div>
  );
}


// ==========================================================
// PAGINATION OPTIONS
// ==========================================================

const PAGE_SIZE_OPTIONS = [
  5,
  10,
  20,
];


// ==========================================================
// COLUMNS
// ==========================================================

const COLUMNS = [

  {
    key: 'id',
    label: 'Engine ID',
    sortable: true,
  },

  {
    key: 'cycle',
    label: 'Cycle',
    sortable: true,
    align: 'right',
  },

  {
    key: 'health',
    label: 'Overall Health',
    sortable: true,
  },

  {
    key: 'rul',
    label: 'Est. RUL',
    sortable: true,
    align: 'right',
  },

  {
    key: 'risk',
    label: 'Risk',
    sortable: false,
    align: 'center',
  },

  {
    key: 'status',
    label: 'Status',
    sortable: false,
    align: 'center',
  },

  {
    key: 'confidence',
    label: 'Confidence',
    sortable: true,
    align: 'right',
  },

];


// ==========================================================
// FLEET TABLE
// ==========================================================

export function FleetTable({
  predictions,
}) {

  // ========================================================
  // NORMALIZE INPUT DATA
  // ========================================================

  const rows = useMemo(() => {

    const source =
      predictions?.length
        ? predictions
        : FLEET_DATA;

    return source.map(
      (r, index) => {

        // -----------------------------------------------
        // HEALTH
        // -----------------------------------------------

        const health = toPercentage(
          r.health ??
          r.OverallHealth
        );

        // -----------------------------------------------
        // CONFIDENCE
        // -----------------------------------------------

        const confidence =
          toPercentage(
            r.confidence ??
            r.OverallHealth_Confidence
          );

        // -----------------------------------------------
        // RUL
        // -----------------------------------------------

        const rul =
          r.rul ??
          r.EstimatedRUL ??
          r.RUL ??
          null;

        // -----------------------------------------------
        // ENGINE ID
        // -----------------------------------------------

        const engineId =
          r.id ??
          (
            r.EngineID != null
              ? `ENG-${String(
                  r.EngineID
                ).padStart(3, '0')}`
              : `ROW-${index + 1}`
          );

        // -----------------------------------------------
        // CYCLE
        // -----------------------------------------------

        const cycle =
          r.cycle ??
          r.Cycle ??
          index + 1;

        // -----------------------------------------------
        // SAFE HEALTH
        // -----------------------------------------------

        const safeHealth =
          Math.max(
            0,
            Math.min(
              100,
              Number(health) || 0
            )
          );

        // -----------------------------------------------
        // SAFE CONFIDENCE
        // -----------------------------------------------

        const safeConfidence =
          Math.max(
            0,
            Math.min(
              100,
              Number(confidence) || 0
            )
          );

        // -----------------------------------------------
        // RISK
        // -----------------------------------------------

        const risk =
          r.risk ??
          (
            safeHealth >= 80
              ? 'Low'
              : safeHealth >= 60
                ? 'Medium'
                : 'High'
          );

        // -----------------------------------------------
        // STATUS
        // -----------------------------------------------

        const status =
          r.status ??
          (
            safeHealth >= 80
              ? 'Nominal'
              : safeHealth >= 60
                ? 'Monitor'
                : 'Alert'
          );

        return {

          ...r,

          id: engineId,

          cycle,

          health: safeHealth,

          confidence: safeConfidence,

          rul,

          risk,

          status,

        };

      }
    );

  }, [predictions]);


  // ========================================================
  // STATE
  // ========================================================

  const [search, setSearch] =
    useState('');

  const [sortKey, setSortKey] =
    useState('id');

  const [sortDir, setSortDir] =
    useState('asc');

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  const [filter, setFilter] =
    useState('All');


  // ========================================================
  // FILTER + SEARCH + SORT
  // ========================================================

  const filtered = useMemo(() => {

    let data = rows;

    // ------------------------------------------------------
    // SEARCH
    // ------------------------------------------------------

    if (search) {

      const q =
        search
          .toLowerCase()
          .trim();

      data = data.filter(
        (r) =>
          String(r.id)
            .toLowerCase()
            .includes(q) ||

          String(r.status ?? '')
            .toLowerCase()
            .includes(q) ||

          String(r.risk ?? '')
            .toLowerCase()
            .includes(q)
      );

    }


    // ------------------------------------------------------
    // FILTER
    // ------------------------------------------------------

    if (filter !== 'All') {

      data = data.filter(
        (r) =>
          r.status === filter ||
          r.risk === filter
      );

    }


    // ------------------------------------------------------
    // SORT
    // ------------------------------------------------------

    data = [...data].sort(
      (a, b) => {

        const av =
          a[sortKey];

        const bv =
          b[sortKey];


        // Null values always go last

        if (
          av == null &&
          bv == null
        ) {
          return 0;
        }

        if (av == null) {
          return 1;
        }

        if (bv == null) {
          return -1;
        }


        // String sorting

        if (
          typeof av === 'string' ||
          typeof bv === 'string'
        ) {

          const result =
            String(av).localeCompare(
              String(bv),
              undefined,
              {
                numeric: true,
              }
            );

          return sortDir === 'asc'
            ? result
            : -result;

        }


        // Numeric sorting

        const numericA =
          Number(av);

        const numericB =
          Number(bv);

        return sortDir === 'asc'
          ? numericA - numericB
          : numericB - numericA;

      }
    );

    return data;

  }, [
    rows,
    search,
    sortKey,
    sortDir,
    filter,
  ]);


  // ========================================================
  // PAGINATION
  // ========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filtered.length /
        pageSize
      )
    );


  const safePage =
    Math.min(
      page,
      totalPages
    );


  const paged =
    filtered.slice(
      (safePage - 1) *
        pageSize,

      safePage *
        pageSize
    );


  // ========================================================
  // SORT
  // ========================================================

  const handleSort = (
    key
  ) => {

    if (
      sortKey === key
    ) {

      setSortDir(
        (direction) =>
          direction === 'asc'
            ? 'desc'
            : 'asc'
      );

    } else {

      setSortKey(key);

      setSortDir('asc');

    }

  };


  // ========================================================
  // EXPORT CSV
  // ========================================================

  const exportCSV = () => {

    const header =
      COLUMNS
        .map(
          (column) =>
            column.label
        )
        .join(',');


    const body =
      filtered
        .map(
          (row) =>
            [
              row.id,

              row.cycle,

              row.health != null
                ? row.health.toFixed(1)
                : '',

              row.rul != null
                ? Number(row.rul).toFixed(0)
                : '',

              row.risk,

              row.status,

              row.confidence != null
                ? row.confidence.toFixed(1)
                : '',
            ].join(',')
        )
        .join('\n');


    const blob =
      new Blob(
        [
          header +
          '\n' +
          body,
        ],
        {
          type:
            'text/csv',
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const a =
      document.createElement(
        'a'
      );

    a.href = url;

    a.download =
      'AeroTwin_Fleet.csv';

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

  };


  // ========================================================
  // SORT ICON
  // ========================================================

  const SortIcon = ({
    col,
  }) => {

    if (
      sortKey !== col
    ) {

      return (
        <ChevronUp
          size={10}
          color="#CBD5E1"
        />
      );

    }


    return sortDir === 'asc'
      ? (
        <ChevronUp
          size={10}
          color="#2563EB"
        />
      )
      : (
        <ChevronDown
          size={10}
          color="#2563EB"
        />
      );

  };


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <div className="ae-card">


      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        style={{
          padding:
            '16px 16px 12px',

          borderBottom:
            '1px solid #E2E8F0',

          display: 'flex',

          alignItems: 'center',

          justifyContent:
            'space-between',

          gap: 12,

          flexWrap: 'wrap',
        }}
      >

        <div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#1E293B',
            }}
          >
            Fleet Overview
          </div>

          <div
            style={{
              fontSize: 11,
              color: '#94A3B8',
            }}
          >
            {filtered.length}
            {' '}
            engines ·{' '}
            {filter}
            {' '}
            filter
          </div>

        </div>


        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems:
              'center',
            flexWrap:
              'wrap',
          }}
        >


          {/* FILTER */}

          <div
            style={{
              display: 'flex',
              gap: 4,
            }}
          >

            {[
              'All',
              'Nominal',
              'Monitor',
              'Alert',
            ].map(
              (f) => (

                <button
                  key={f}

                  onClick={() => {

                    setFilter(f);

                    setPage(1);

                  }}

                  style={{
                    padding:
                      '4px 10px',

                    border:
                      `1px solid ${
                        filter === f
                          ? '#2563EB'
                          : '#E2E8F0'
                      }`,

                    background:
                      filter === f
                        ? '#EFF6FF'
                        : '#fff',

                    color:
                      filter === f
                        ? '#2563EB'
                        : '#64748B',

                    fontSize: 11,

                    fontWeight:
                      filter === f
                        ? 700
                        : 500,

                    cursor:
                      'pointer',

                    borderRadius: 6,
                  }}
                >
                  {f}
                </button>

              )
            )}

          </div>


          {/* SEARCH */}

          <div
            style={{
              position:
                'relative',
            }}
          >

            <Search
              size={12}
              style={{
                position:
                  'absolute',

                left: 10,

                top: '50%',

                transform:
                  'translateY(-50%)',

                color:
                  '#94A3B8',
              }}
            />

            <input
              id="fleet-search"

              className="ae-input"

              value={search}

              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setPage(1);

              }}

              placeholder=
                "Search engine..."

              style={{
                paddingLeft: 30,
                width: 160,
                fontSize: 12,
              }}
            />

          </div>


          {/* EXPORT */}

          <button
            id="fleet-export-btn"

            className=
              "ae-btn-secondary"

            style={{
              padding:
                '6px 12px',

              fontSize: 12,
            }}

            onClick={
              exportCSV
            }
          >

            <Download
              size={13}
            />

            Export CSV

          </button>

        </div>

      </div>


      {/* ================================================== */}
      {/* TABLE */}
      {/* ================================================== */}

      <div
        style={{
          overflowX:
            'auto',
        }}
      >

        <table
          className="ae-table"
        >

          <thead>

            <tr>

              {COLUMNS.map(
                (col) => (

                  <th
                    key={col.key}

                    style={{
                      textAlign:
                        col.align ||
                        'left',
                    }}

                    onClick={() =>
                      col.sortable &&
                      handleSort(
                        col.key
                      )
                    }
                  >

                    <div
                      style={{
                        display:
                          'inline-flex',

                        alignItems:
                          'center',

                        gap: 4,

                        cursor:
                          col.sortable
                            ? 'pointer'
                            : 'default',
                      }}
                    >

                      {col.label}

                      {col.sortable && (
                        <SortIcon
                          col={
                            col.key
                          }
                        />
                      )}

                    </div>

                  </th>

                )
              )}

            </tr>

          </thead>


          <tbody>

            {paged.length === 0 ? (

              <tr>

                <td
                  colSpan={
                    COLUMNS.length
                  }

                  style={{
                    textAlign:
                      'center',

                    padding:
                      '40px 20px',

                    color:
                      '#94A3B8',

                    fontSize: 12,
                  }}
                >
                  No engines found.
                </td>

              </tr>

            ) : (

              paged.map(
                (row, index) => (

                  <tr
                    key={
                      `${row.id}-${row.cycle}-${index}`
                    }
                  >

                    {/* ENGINE ID */}

                    <td>

                      <span
                        style={{
                          fontFamily:
                            'JetBrains Mono, monospace',

                          fontWeight: 700,

                          color:
                            '#1E293B',

                          fontSize: 12,
                        }}
                      >
                        {row.id}
                      </span>

                    </td>


                    {/* CYCLE */}

                    <td
                      style={{
                        textAlign:
                          'right',

                        fontFamily:
                          'monospace',

                        color:
                          '#64748B',
                      }}
                    >
                      {row.cycle}
                    </td>


                    {/* HEALTH */}

                    <td
                      style={{
                        minWidth:
                          160,
                      }}
                    >

                      <HealthBar
                        value={
                          row.health
                        }
                      />

                    </td>


                    {/* RUL */}

                    <td
                      style={{
                        textAlign:
                          'right',
                      }}
                    >

                      <span
                        style={{
                          fontFamily:
                            'monospace',

                          fontWeight:
                            600,

                          color:
                            row.rul == null
                              ? '#94A3B8'
                              : row.rul < 100
                                ? '#EF4444'
                                : row.rul < 200
                                  ? '#F59E0B'
                                  : '#22C55E',
                        }}
                      >

                        {row.rul != null
                          ? Number(
                              row.rul
                            ).toFixed(0)
                          : '—'}

                      </span>

                      {row.rul != null && (

                        <span
                          style={{
                            color:
                              '#94A3B8',

                            fontSize: 10,

                            marginLeft: 3,
                          }}
                        >
                          cyc
                        </span>

                      )}

                    </td>


                    {/* RISK */}

                    <td
                      style={{
                        textAlign:
                          'center',
                      }}
                    >

                      <span
                        className={
                          riskBadge(
                            row.risk
                          )
                        }
                      >
                        {row.risk}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td
                      style={{
                        textAlign:
                          'center',
                      }}
                    >

                      <span
                        className={
                          statusBadge(
                            row.status
                          )
                        }
                      >
                        {row.status}
                      </span>

                    </td>


                    {/* CONFIDENCE */}

                    <td
                      style={{
                        textAlign:
                          'right',

                        fontFamily:
                          'monospace',

                        color:
                          '#64748B',
                      }}
                    >

                      {Number(
                        row.confidence
                      ).toFixed(1)}
                      %

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* ================================================== */}
      {/* PAGINATION */}
      {/* ================================================== */}

      <div
        style={{
          display:
            'flex',

          alignItems:
            'center',

          justifyContent:
            'space-between',

          padding:
            '10px 16px',

          borderTop:
            '1px solid #E2E8F0',

          flexWrap:
            'wrap',

          gap: 8,
        }}
      >


        {/* ROWS PER PAGE */}

        <div
          style={{
            display:
              'flex',

            alignItems:
              'center',

            gap: 8,
          }}
        >

          <span
            style={{
              fontSize: 11,
              color: '#64748B',
            }}
          >
            Rows per page:
          </span>

          <select
            value={
              pageSize
            }

            onChange={(e) => {

              setPageSize(
                Number(
                  e.target.value
                )
              );

              setPage(1);

            }}

            style={{
              border:
                '1px solid #E2E8F0',

              borderRadius: 6,

              padding:
                '3px 6px',

              fontSize: 11,

              color:
                '#1E293B',

              background:
                '#fff',
            }}
          >

            {PAGE_SIZE_OPTIONS.map(
              (n) => (

                <option
                  key={n}
                  value={n}
                >
                  {n}
                </option>

              )
            )}

          </select>

        </div>


        {/* RANGE */}

        <span
          style={{
            fontSize: 11,
            color: '#64748B',
          }}
        >

          {filtered.length === 0
            ? '0'
            : `${
                (safePage - 1) *
                  pageSize +
                1
              }–${Math.min(
                safePage *
                  pageSize,
                filtered.length
              )}`
          }

          {' '}
          of{' '}

          {filtered.length}

        </span>


        {/* PAGINATION BUTTONS */}

        <div
          style={{
            display:
              'flex',

            gap: 4,
          }}
        >

          {[
            {
              Icon:
                ChevronsLeft,

              action:
                () =>
                  setPage(1),

              disabled:
                safePage === 1,
            },

            {
              Icon:
                ChevronLeft,

              action:
                () =>
                  setPage(
                    (p) =>
                      Math.max(
                        1,
                        p - 1
                      )
                  ),

              disabled:
                safePage === 1,
            },

            {
              Icon:
                ChevronRight,

              action:
                () =>
                  setPage(
                    (p) =>
                      Math.min(
                        totalPages,
                        p + 1
                      )
                  ),

              disabled:
                safePage >=
                totalPages,
            },

            {
              Icon:
                ChevronsRight,

              action:
                () =>
                  setPage(
                    totalPages
                  ),

              disabled:
                safePage >=
                totalPages,
            },

          ].map(
            (
              {
                Icon,
                action,
                disabled,
              },
              i
            ) => (

              <button
                key={i}

                onClick={
                  action
                }

                disabled={
                  disabled
                }

                style={{
                  width: 28,
                  height: 28,

                  border:
                    '1px solid #E2E8F0',

                  borderRadius: 6,

                  background:
                    '#fff',

                  cursor:
                    disabled
                      ? 'not-allowed'
                      : 'pointer',

                  display:
                    'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  opacity:
                    disabled
                      ? 0.4
                      : 1,
                }}
              >

                <Icon
                  size={13}
                  color="#64748B"
                />

              </button>

            )
          )}

        </div>

      </div>

    </div>
  );
}