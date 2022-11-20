

export const ExportCertificateCSV = (key: string[], value: string[]) => {
    const rows = [
        key, value
    ];

    let csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}