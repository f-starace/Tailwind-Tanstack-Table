// TODO Implement plugin for exporting data

import { TableOptions } from "@tanstack/react-table";
import React from "react";

// Get exported file name(do not specify extension here)
const defaultGetExportFileName = ({ fileType, all }) => {
  return `${all ? "all-" : ""}data`;
};

// To get column name while exporting
const defaultGetColumnExportValue = (col) => {
  let name = col.Header;
  if (typeof name === "object" || typeof name === "function") {
    name = col.id;
  }
  return name;
};

// To get cell value while exporting
const defaultGetCellExportValue = (row, col) => {
  return row.values[col.id];
};

const defaultGetExportFileBlob = () => {
  throw new Error("React Table: Export Blob is mandatory");
};

export const useExportData = (hooks) => {
  hooks.useInstance.push(useInstance);
};

useExportData.pluginName = "useExportData";

function useInstance(instance) {
  const {
    rows,
    initialRows = [],
    allColumns,
    disableExport,
    getExportFileName = defaultGetExportFileName,
    getExportFileBlob = defaultGetExportFileBlob,
    plugins,
  } = instance;

  // Adding `canExport` & `exportValue` meta data
  allColumns.forEach((column) => {
    const { accessor, getColumnExportValue = defaultGetColumnExportValue } =
      column;

    const canExport = accessor
      ? getFirstDefined(
          column.disableExport === true ? false : undefined,
          disableExport === true ? false : undefined,
          true
        )
      : false;

    column.canExport = canExport;
    column.exportValue = getColumnExportValue(column);
  });

  // This method will enable export of data on `instance` object
  const exportData = React.useCallback(
    (fileType, all = false) => {
      // Columns which are exportable
      const exportableColumns = allColumns.filter(
        (col) => col.canExport && (all || col.isVisible)
      );

      if (exportableColumns.length === 0) {
        console.warn("No exportable columns are available");
      }

      // Rows which are exportable
      let exportableRows = (all ? initialRows : rows).map((row) => {
        return exportableColumns.map((col) => {
          const { getCellExportValue = defaultGetCellExportValue } = col;

          return getCellExportValue(row, col);
        });
      });

      // Getting fileName
      const fileName = getExportFileName({ fileType, all });

      // Get `FileBlob` to download
      let fileBlob = getExportFileBlob({
        columns: exportableColumns,
        data: exportableRows,
        fileName,
        fileType,
      });

      // Trigger download in browser
      if (fileBlob) {
        downloadFileViaBlob(fileBlob, fileName, fileType);
      }
    },
    [getExportFileBlob, getExportFileName, initialRows, rows, allColumns]
  );

  Object.assign(instance, {
    exportData,
  });
}

function downloadFileViaBlob(fileBlob, fileName, type) {
  if (fileBlob) {
    const dataUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.download = `${fileName}.${type}`;
    link.href = dataUrl;
    link.click();
  }
}

function getExportFileBlob({ columns, data, fileType, fileName }) {
  if (fileType === "csv") {
    // CSV example
    const headerNames = columns.map((col) => col.exportValue);
    const csvString = Papa.unparse({ fields: headerNames, data });
    return new Blob([csvString], { type: "text/csv" });
  } else if (fileType === "xlsx") {
    // XLSX example

    const header = columns.map((c) => c.exportValue);
    const compatibleData = data.map((row) => {
      const obj = {};
      header.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });

    let wb = XLSX.utils.book_new();
    let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
      header,
    });
    XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
    XLSX.writeFile(wb, `${fileName}.xlsx`);

    // Returning false as downloading of file is already taken care of
    return false;
  }
  //PDF example
  if (fileType === "pdf") {
    const headerNames = columns.map((column) => column.exportValue);
    const doc = new JsPDF();
    doc.autoTable({
      head: [headerNames],
      body: data,
      margin: { top: 20 },
      styles: {
        minCellHeight: 9,
        halign: "left",
        valign: "center",
        fontSize: 11,
      },
    });
    doc.save(`${fileName}.pdf`);

    return false;
  }

  // Other formats goes here
  return false;
}
