import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import apiService from '../../services/api';

const fieldStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(157, 90, 118, 0.25)',
    background: 'rgba(255,255,255,0.75)',
    fontFamily: 'var(--font-sans)',
    outline: 'none'
};

const cardStyle = {
    background: 'rgba(255,255,255,0.8)',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.95)',
    boxShadow: '0 10px 30px rgba(89,54,69,0.08)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)'
};

const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
    }
    return `${value.toFixed(2)} ${units[index]}`;
};

const DatabaseManagement = () => {
    const [summary, setSummary] = useState(null);
    const [selectedTable, setSelectedTable] = useState('users');
    const [tableRows, setTableRows] = useState([]);
    const [schema, setSchema] = useState([]);
    const [limit, setLimit] = useState(20);
    const [loading, setLoading] = useState(true);
    const [rowsLoading, setRowsLoading] = useState(false);

    const tableNames = useMemo(() => Object.keys(summary?.table_counts || {}), [summary]);

    const fetchSummary = async () => {
        try {
            const data = await apiService.getAdminDatabaseSummary();
            setSummary(data);
            if (!selectedTable && Object.keys(data?.table_counts || {}).length > 0) {
                setSelectedTable(Object.keys(data.table_counts)[0]);
            }
        } catch (error) {
            console.error('Fetch database summary failed:', error);
            alert(error.message || 'Gagal memuat database summary');
        } finally {
            setLoading(false);
        }
    };

    const fetchTableData = async (table, rowsLimit) => {
        setRowsLoading(true);
        try {
            const [rowsRes, schemaRes] = await Promise.all([
                apiService.getAdminTableRows(table, { limit: rowsLimit, offset: 0 }),
                apiService.getAdminTableSchema(table)
            ]);
            setTableRows(Array.isArray(rowsRes?.rows) ? rowsRes.rows : []);
            setSchema(Array.isArray(schemaRes?.schema) ? schemaRes.schema : []);
        } catch (error) {
            console.error('Fetch table data failed:', error);
            alert(error.message || 'Gagal memuat isi tabel');
            setTableRows([]);
            setSchema([]);
        } finally {
            setRowsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    useEffect(() => {
        if (!selectedTable) return;
        fetchTableData(selectedTable, limit);
    }, [selectedTable, limit]);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-body)' }}>Loading database summary...</div>;
    }

    return (
        <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-headline)', fontFamily: 'var(--font-serif)' }}>
                            Database Management
                        </h2>
                        <p style={{ color: 'var(--text-body)', fontSize: '0.85rem' }}>{summary?.path}</p>
                    </div>
                    <button
                        onClick={fetchSummary}
                        style={{
                            border: '1px solid rgba(157,90,118,0.25)',
                            background: 'rgba(157,90,118,0.1)',
                            color: 'var(--primary-color)',
                            borderRadius: '10px',
                            padding: '8px 10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <RefreshCcw size={15} />
                        Refresh
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div style={{ ...cardStyle, padding: '10px' }}>
                        <p style={{ color: 'var(--text-body)', fontSize: '0.8rem' }}>DB Size</p>
                        <p style={{ color: 'var(--text-headline)', fontWeight: 700, fontSize: '1.05rem' }}>{formatBytes(summary?.size_bytes || 0)}</p>
                    </div>
                    <div style={{ ...cardStyle, padding: '10px' }}>
                        <p style={{ color: 'var(--text-body)', fontSize: '0.8rem' }}>Admin Bearer Required</p>
                        <p style={{ color: 'var(--text-headline)', fontWeight: 700, fontSize: '1.05rem' }}>
                            {summary?.admin_require_bearer ? 'Yes' : 'No'}
                        </p>
                    </div>
                    {Object.entries(summary?.table_counts || {}).map(([table, count]) => (
                        <div key={table} style={{ ...cardStyle, padding: '10px' }}>
                            <p style={{ color: 'var(--text-body)', fontSize: '0.8rem' }}>{table}</p>
                            <p style={{ color: 'var(--text-headline)', fontWeight: 700, fontSize: '1.05rem' }}>{count}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ ...cardStyle, padding: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '10px', marginBottom: '10px' }}>
                    <select value={selectedTable} onChange={(event) => setSelectedTable(event.target.value)} style={fieldStyle}>
                        {tableNames.map((table) => (
                            <option key={table} value={table}>
                                {table}
                            </option>
                        ))}
                    </select>
                    <select value={limit} onChange={(event) => setLimit(Number(event.target.value))} style={fieldStyle}>
                        <option value={20}>20 rows</option>
                        <option value={50}>50 rows</option>
                        <option value={100}>100 rows</option>
                    </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <h3 style={{ marginBottom: '6px', color: 'var(--text-headline)', fontSize: '1rem' }}>Schema: {selectedTable}</h3>
                    <div style={{ display: 'grid', gap: '6px' }}>
                        {schema.map((column) => (
                            <div key={column.cid} style={{ ...cardStyle, padding: '8px 10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-headline)', fontWeight: 600 }}>{column.name}</span>
                                <span style={{ color: 'var(--text-body)', fontSize: '0.85rem' }}>{column.type}</span>
                                {column.pk ? <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)' }}>PK</span> : null}
                                {column.notnull ? <span style={{ fontSize: '0.75rem', color: 'var(--error-color)' }}>NOT NULL</span> : null}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: '6px', color: 'var(--text-headline)', fontSize: '1rem' }}>Rows: {selectedTable}</h3>
                    {rowsLoading ? (
                        <p style={{ color: 'var(--text-body)' }}>Loading rows...</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {(schema.map((column) => column.name)).map((columnName) => (
                                            <th
                                                key={columnName}
                                                style={{
                                                    padding: '10px',
                                                    textAlign: 'left',
                                                    color: 'var(--text-body)',
                                                    fontSize: '0.75rem',
                                                    borderBottom: '1px solid rgba(157,90,118,0.15)'
                                                }}
                                            >
                                                {columnName}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRows.map((row, index) => (
                                        <tr key={index}>
                                            {schema.map((column) => (
                                                <td
                                                    key={`${index}-${column.name}`}
                                                    style={{
                                                        padding: '10px',
                                                        fontSize: '0.82rem',
                                                        color: 'var(--text-headline)',
                                                        borderBottom: '1px solid rgba(157,90,118,0.08)'
                                                    }}
                                                >
                                                    {String(row[column.name] ?? '')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {tableRows.length === 0 && (
                                <p style={{ marginTop: '8px', color: 'var(--text-body)', textAlign: 'center' }}>No rows</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatabaseManagement;
