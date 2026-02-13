const tableElement = document.getElementById('editable-table');
const tableHead = tableElement.querySelector('thead');
const tableBody = tableElement.querySelector('tbody');
const addRowButton = document.getElementById('add-row-btn');
const addColumnButton = document.getElementById('add-column-btn');
const saveTableButton = document.getElementById('save-table-btn');
const deleteSelectedButton = document.getElementById('delete-selected-btn');
const duplicateSelectedButton = document.getElementById('duplicate-selected-btn');
const clearSelectionButton = document.getElementById('clear-selection-btn');
const selectionCountText = document.getElementById('selection-count');
const exportFormatLabel = document.getElementById('export-format-label');
const exportFormatSelect = document.getElementById('export-format');
const runExportButton = document.getElementById('run-export-btn');
const importFormatLabel = document.getElementById('import-format-label');
const importFormatSelect = document.getElementById('import-format');
const runImportButton = document.getElementById('run-import-btn');
const importFileInput = document.getElementById('import-file-input');
const resetTableButton = document.getElementById('reset-table-btn');
const tableStatus = document.getElementById('table-status');
const rowModal = document.getElementById('row-modal');
const rowModalTitle = document.getElementById('row-modal-title');
const rowForm = document.getElementById('row-form');
const rowFields = document.getElementById('row-fields');
const rowCancelButton = document.getElementById('row-cancel-btn');
const rowSaveButton = document.getElementById('row-save-btn');

const STORAGE_KEY = 'editable_table_data';
const HUB_SETTINGS_KEY = 'hub_settings_data';

let currentLanguage = 'en';
let modalMode = 'create';
let editingRowIndex = null;
let pendingImportType = null;
const selectedRows = new Set();

const TRANSLATIONS = {
  en: {
    title: 'Editable Table',
    addRow: 'Add row',
    addColumn: 'Add column',
    saveTable: 'Save table',
    deleteSelected: 'Delete selected',
    duplicateSelected: 'Duplicate selected',
    clearSelection: 'Clear selection',
    exportLabel: 'Export format',
    importLabel: 'Import format',
    exportAction: 'Export',
    importAction: 'Import',
    formatCsv: 'CSV',
    formatExcel: 'Excel',
    formatXml: 'XML',
    reset: 'Reset',
    statusInitial: 'Use Add/Edit actions to manage rows.',
    statusAddedRow: 'Row added.',
    statusUpdatedRow: 'Row updated.',
    statusEmptyColumnName: 'Column was not added: empty name.',
    statusAddedColumn: 'Added column:',
    statusRowDeleted: 'Row deleted.',
    statusSaved: 'Table saved.',
    statusNoSelection: 'No rows selected.',
    statusSelectionCleared: 'Selection cleared.',
    statusDuplicatedSelected: 'Selected rows duplicated.',
    statusDeletedSelected: 'Selected rows deleted.',
    statusExportedCsv: 'CSV exported.',
    statusExportedExcel: 'Excel exported.',
    statusExportedXml: 'XML exported.',
    statusImportedCsv: 'CSV imported.',
    statusImportedExcel: 'Excel imported.',
    statusImportedXml: 'XML imported.',
    statusReset: 'Table reset to default values.',
    statusImportError: 'Import failed. Unsupported or invalid file format.',
    actions: 'Actions',
    selected: 'selected',
    edit: 'Edit',
    del: 'Delete',
    promptNewColumn: 'New column name:',
    defaultColumn: 'Column',
    confirmSave: 'Do you want to save these changes?',
    confirmImport: 'Replace current table data with imported file?',
    confirmDelete: 'Do you want to delete this row?',
    confirmDeleteSelected: 'Do you want to delete selected rows?',
    confirmReset: 'Reset table to default values?',
    modalCreateTitle: 'Add Row',
    modalEditTitle: 'Edit Row',
    modalCancel: 'Cancel',
    modalSave: 'Save',
    defaultColumns: ['Product', 'Quantity', 'Price'],
  },
  el: {
    title: 'Επεξεργάσιμος Πίνακας',
    addRow: 'Προσθήκη γραμμής',
    addColumn: 'Προσθήκη στήλης',
    saveTable: 'Αποθήκευση πίνακα',
    deleteSelected: 'Διαγραφή επιλεγμένων',
    duplicateSelected: 'Αντιγραφή επιλεγμένων',
    clearSelection: 'Καθαρισμός επιλογής',
    exportLabel: 'Μορφή εξαγωγής',
    importLabel: 'Μορφή εισαγωγής',
    exportAction: 'Εξαγωγή',
    importAction: 'Εισαγωγή',
    formatCsv: 'CSV',
    formatExcel: 'Excel',
    formatXml: 'XML',
    reset: 'Επαναφορά',
    statusInitial: 'Χρησιμοποίησε Add/Edit για διαχείριση γραμμών.',
    statusAddedRow: 'Η γραμμή προστέθηκε.',
    statusUpdatedRow: 'Η γραμμή ενημερώθηκε.',
    statusEmptyColumnName: 'Η στήλη δεν προστέθηκε: κενό όνομα.',
    statusAddedColumn: 'Προστέθηκε στήλη:',
    statusRowDeleted: 'Η γραμμή διαγράφηκε.',
    statusSaved: 'Ο πίνακας αποθηκεύτηκε.',
    statusNoSelection: 'Δεν υπάρχουν επιλεγμένες γραμμές.',
    statusSelectionCleared: 'Η επιλογή καθαρίστηκε.',
    statusDuplicatedSelected: 'Οι επιλεγμένες γραμμές αντιγράφηκαν.',
    statusDeletedSelected: 'Οι επιλεγμένες γραμμές διαγράφηκαν.',
    statusExportedCsv: 'Έγινε εξαγωγή CSV.',
    statusExportedExcel: 'Έγινε εξαγωγή Excel.',
    statusExportedXml: 'Έγινε εξαγωγή XML.',
    statusImportedCsv: 'Έγινε εισαγωγή CSV.',
    statusImportedExcel: 'Έγινε εισαγωγή Excel.',
    statusImportedXml: 'Έγινε εισαγωγή XML.',
    statusReset: 'Ο πίνακας επανήλθε στις αρχικές τιμές.',
    statusImportError: 'Αποτυχία εισαγωγής. Μη υποστηριζόμενο ή άκυρο αρχείο.',
    actions: 'Ενέργειες',
    selected: 'επιλεγμένες',
    edit: 'Επεξεργασία',
    del: 'Διαγραφή',
    promptNewColumn: 'Όνομα νέας στήλης:',
    defaultColumn: 'Στήλη',
    confirmSave: 'Θέλεις να αποθηκευτούν οι αλλαγές;',
    confirmImport: 'Να αντικατασταθούν τα τρέχοντα δεδομένα με το αρχείο;',
    confirmDelete: 'Θέλεις να διαγραφεί αυτή η γραμμή;',
    confirmDeleteSelected: 'Θέλεις να διαγραφούν οι επιλεγμένες γραμμές;',
    confirmReset: 'Να γίνει επαναφορά του πίνακα στις αρχικές τιμές;',
    modalCreateTitle: 'Προσθήκη Γραμμής',
    modalEditTitle: 'Επεξεργασία Γραμμής',
    modalCancel: 'Ακύρωση',
    modalSave: 'Αποθήκευση',
    defaultColumns: ['Προϊόν', 'Ποσότητα', 'Τιμή'],
  },
};

function t() {
  return TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
}

function getSelectedCountText() {
  return `${selectedRows.size} ${t().selected}`;
}

function getDefaultTableData() {
  const translation = t();
  return {
    columns: [...translation.defaultColumns],
    rows: [
      ['Laptop', '1', '1200'],
      ['Mouse', '2', '25'],
    ],
  };
}

let tableData = getDefaultTableData();

function getLanguageFromSettings() {
  const rawSettings = localStorage.getItem(HUB_SETTINGS_KEY);
  if (!rawSettings) {
    return 'en';
  }

  try {
    const settings = JSON.parse(rawSettings);
    return settings.language === 'el' ? 'el' : 'en';
  } catch {
    return 'en';
  }
}

function setStatus(text) {
  tableStatus.textContent = text;
}

function syncSelectedRows() {
  const maxIndex = tableData.rows.length - 1;
  Array.from(selectedRows).forEach((index) => {
    if (index > maxIndex) {
      selectedRows.delete(index);
    }
  });
}

function updateSelectionUi() {
  selectionCountText.textContent = getSelectedCountText();
  const hasSelection = selectedRows.size > 0;
  deleteSelectedButton.disabled = !hasSelection;
  duplicateSelectedButton.disabled = !hasSelection;
  clearSelectionButton.disabled = !hasSelection;
}

function applyLanguage() {
  const translation = t();
  document.documentElement.lang = currentLanguage;

  const title = document.getElementById('table-title');
  if (title) {
    title.textContent = translation.title;
  }

  addRowButton.textContent = translation.addRow;
  addColumnButton.textContent = translation.addColumn;
  saveTableButton.textContent = translation.saveTable;
  deleteSelectedButton.textContent = translation.deleteSelected;
  duplicateSelectedButton.textContent = translation.duplicateSelected;
  clearSelectionButton.textContent = translation.clearSelection;
  exportFormatLabel.textContent = translation.exportLabel;
  importFormatLabel.textContent = translation.importLabel;
  runExportButton.textContent = translation.exportAction;
  runImportButton.textContent = translation.importAction;
  exportFormatSelect.querySelector('option[value="csv"]').textContent = translation.formatCsv;
  exportFormatSelect.querySelector('option[value="excel"]').textContent = translation.formatExcel;
  exportFormatSelect.querySelector('option[value="xml"]').textContent = translation.formatXml;
  importFormatSelect.querySelector('option[value="csv"]').textContent = translation.formatCsv;
  importFormatSelect.querySelector('option[value="excel"]').textContent = translation.formatExcel;
  importFormatSelect.querySelector('option[value="xml"]').textContent = translation.formatXml;
  resetTableButton.textContent = translation.reset;
  rowCancelButton.textContent = translation.modalCancel;
  rowSaveButton.textContent = translation.modalSave;
  updateSelectionUi();
}

function saveTableData() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tableData));
}

function normalizeRowLength(row) {
  const normalized = [...row];
  while (normalized.length < tableData.columns.length) {
    normalized.push('');
  }
  return normalized.slice(0, tableData.columns.length);
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function escapeCsvValue(value) {
  const text = String(value ?? '');
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

function exportCsv() {
  const lines = [];
  lines.push(tableData.columns.map(escapeCsvValue).join(','));
  tableData.rows.forEach((row) => {
    const normalized = normalizeRowLength(row);
    lines.push(normalized.map(escapeCsvValue).join(','));
  });

  const content = lines.join('\n');
  downloadFile(content, 'editable-table.csv', 'text/csv;charset=utf-8;');
  setStatus(t().statusExportedCsv);
}

function escapeXmlValue(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function exportXml() {
  const columnTags = tableData.columns.map((name, index) => {
    const safeName = `col_${index + 1}`;
    return `      <${safeName} name="${escapeXmlValue(name)}">${escapeXmlValue(name)}</${safeName}>`;
  });

  const rowTags = tableData.rows.map((row) => {
    const normalized = normalizeRowLength(row);
    const cells = normalized.map((cell, index) => {
      const safeName = `col_${index + 1}`;
      return `      <${safeName}>${escapeXmlValue(cell)}</${safeName}>`;
    });
    return ['    <row>', ...cells, '    </row>'].join('\n');
  });

  const content = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<table>',
    '  <columns>',
    ...columnTags,
    '  </columns>',
    '  <rows>',
    ...rowTags,
    '  </rows>',
    '</table>',
  ].join('\n');

  downloadFile(content, 'editable-table.xml', 'application/xml;charset=utf-8;');
  setStatus(t().statusExportedXml);
}

function exportExcel() {
  const headerHtml = tableData.columns
    .map((name) => `<th>${escapeXmlValue(name)}</th>`)
    .join('');

  const bodyHtml = tableData.rows
    .map((row) => {
      const normalized = normalizeRowLength(row);
      const cells = normalized.map((cell) => `<td>${escapeXmlValue(cell)}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  const content = [
    '<html>',
    '<head><meta charset="UTF-8"></head>',
    '<body>',
    '<table border="1">',
    `<thead><tr>${headerHtml}</tr></thead>`,
    `<tbody>${bodyHtml}</tbody>`,
    '</table>',
    '</body>',
    '</html>',
  ].join('');

  downloadFile(content, 'editable-table.xls', 'application/vnd.ms-excel');
  setStatus(t().statusExportedExcel);
}

function parseCsvText(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((value) => String(value).trim() !== ''));
}

function parseExcelText(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const table = doc.querySelector('table');
  if (!table) {
    return null;
  }

  const headerCells = table.querySelectorAll('thead th');
  let columns = Array.from(headerCells).map((cell) => cell.textContent.trim());

  if (columns.length === 0) {
    const firstRowCells = table.querySelectorAll('tr:first-child th, tr:first-child td');
    columns = Array.from(firstRowCells).map((cell) => cell.textContent.trim());
  }

  if (columns.length === 0) {
    return null;
  }

  const rowElements = table.querySelectorAll('tbody tr');
  const sourceRows = rowElements.length > 0 ? Array.from(rowElements) : Array.from(table.querySelectorAll('tr')).slice(1);
  const rows = sourceRows.map((tr) =>
    Array.from(tr.querySelectorAll('td, th')).map((cell) => cell.textContent.trim())
  );

  return { columns, rows };
}

function parseXmlText(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) {
    return null;
  }

  const columnNodes = doc.querySelectorAll('table > columns > *');
  const columns = Array.from(columnNodes).map((node) => (node.getAttribute('name') || node.textContent || '').trim());
  if (columns.length === 0) {
    return null;
  }

  const rowNodes = doc.querySelectorAll('table > rows > row');
  const rows = Array.from(rowNodes).map((rowNode) =>
    Array.from(rowNode.children).map((cellNode) => (cellNode.textContent || '').trim())
  );

  return { columns, rows };
}

function sanitizeImportedData(data) {
  if (!data || !Array.isArray(data.columns) || !Array.isArray(data.rows)) {
    return null;
  }

  const columns = data.columns.map((column, index) => {
    const value = String(column ?? '').trim();
    return value || `${t().defaultColumn} ${index + 1}`;
  });

  if (columns.length === 0) {
    return null;
  }

  const rows = data.rows.map((row) => {
    const source = Array.isArray(row) ? row : [];
    const normalized = [...source].map((cell) => String(cell ?? '').trim());
    while (normalized.length < columns.length) {
      normalized.push('');
    }
    return normalized.slice(0, columns.length);
  });

  return { columns, rows };
}

function applyImportedData(data) {
  const sanitized = sanitizeImportedData(data);
  if (!sanitized) {
    throw new Error('invalid import data');
  }

  tableData = sanitized;
  selectedRows.clear();
  renderTable();
  saveTableData();
}

function handleImportResult(type, text) {
  let parsedData = null;

  if (type === 'csv') {
    const rows = parseCsvText(text);
    if (rows.length === 0) {
      throw new Error('empty csv');
    }
    parsedData = {
      columns: rows[0],
      rows: rows.slice(1),
    };
    applyImportedData(parsedData);
    setStatus(t().statusImportedCsv);
    return;
  }

  if (type === 'excel') {
    parsedData = parseExcelText(text);
    applyImportedData(parsedData);
    setStatus(t().statusImportedExcel);
    return;
  }

  if (type === 'xml') {
    parsedData = parseXmlText(text);
    applyImportedData(parsedData);
    setStatus(t().statusImportedXml);
  }
}

function openImportPicker(type, accept) {
  if (!confirm(t().confirmImport)) {
    return;
  }

  pendingImportType = type;
  importFileInput.value = '';
  importFileInput.setAttribute('accept', accept);
  importFileInput.click();
}

function openRowModal(mode, rowIndex = null) {
  modalMode = mode;
  editingRowIndex = rowIndex;
  rowFields.innerHTML = '';

  const sourceValues = rowIndex === null ? [] : tableData.rows[rowIndex];
  const values = normalizeRowLength(sourceValues || []);

  tableData.columns.forEach((columnName, columnIndex) => {
    const wrapper = document.createElement('div');

    const label = document.createElement('label');
    label.className = 'form-label mb-1';
    label.htmlFor = `row-field-${columnIndex}`;
    label.textContent = columnName;

    const input = document.createElement('input');
    input.className = 'form-control form-control-sm';
    input.id = `row-field-${columnIndex}`;
    input.name = `col-${columnIndex}`;
    input.type = 'text';
    input.value = values[columnIndex] || '';

    wrapper.append(label, input);
    rowFields.appendChild(wrapper);
  });

  const translation = t();
  rowModalTitle.textContent = mode === 'create' ? translation.modalCreateTitle : translation.modalEditTitle;
  rowModal.classList.remove('d-none');
}

function closeRowModal() {
  rowModal.classList.add('d-none');
  rowForm.reset();
  editingRowIndex = null;
}

function collectRowFormValues() {
  const values = [];
  for (let i = 0; i < tableData.columns.length; i += 1) {
    const input = rowForm.elements.namedItem(`col-${i}`);
    values.push(input ? input.value.trim() : '');
  }
  return values;
}

function addColumn() {
  const translation = t();
  const newColumnName = prompt(translation.promptNewColumn, `${translation.defaultColumn} ${tableData.columns.length + 1}`);
  if (newColumnName === null) {
    return;
  }

  const trimmedName = newColumnName.trim();
  if (!trimmedName) {
    setStatus(translation.statusEmptyColumnName);
    return;
  }

  tableData.columns.push(trimmedName);
  tableData.rows = tableData.rows.map((row) => {
    const normalized = normalizeRowLength(row);
    normalized.push('');
    return normalized;
  });

  selectedRows.clear();
  renderTable();
  setStatus(`${translation.statusAddedColumn} ${trimmedName}`);
}

function deleteRow(rowIndex) {
  if (!confirm(t().confirmDelete)) {
    return;
  }

  tableData.rows.splice(rowIndex, 1);
  selectedRows.clear();
  renderTable();
  setStatus(t().statusRowDeleted);
}

function clearSelection(showStatus = true) {
  if (selectedRows.size === 0) {
    if (showStatus) {
      setStatus(t().statusNoSelection);
    }
    return;
  }

  selectedRows.clear();
  renderTable();
  if (showStatus) {
    setStatus(t().statusSelectionCleared);
  }
}

function duplicateSelectedRows() {
  if (selectedRows.size === 0) {
    setStatus(t().statusNoSelection);
    return;
  }

  const selectedIndexes = Array.from(selectedRows).sort((a, b) => a - b);
  const clones = selectedIndexes.map((index) => [...normalizeRowLength(tableData.rows[index])]);
  tableData.rows.push(...clones);
  selectedRows.clear();
  renderTable();
  setStatus(t().statusDuplicatedSelected);
}

function deleteSelectedRows() {
  if (selectedRows.size === 0) {
    setStatus(t().statusNoSelection);
    return;
  }

  if (!confirm(t().confirmDeleteSelected)) {
    return;
  }

  tableData.rows = tableData.rows.filter((_, index) => !selectedRows.has(index));
  selectedRows.clear();
  renderTable();
  setStatus(t().statusDeletedSelected);
}

function renderTable() {
  const translation = t();
  syncSelectedRows();
  tableHead.innerHTML = '';
  tableBody.innerHTML = '';

  const headRow = document.createElement('tr');

  const selectHead = document.createElement('th');
  selectHead.scope = 'col';
  const selectAll = document.createElement('input');
  selectAll.type = 'checkbox';
  selectAll.className = 'form-check-input';
  selectAll.checked = tableData.rows.length > 0 && selectedRows.size === tableData.rows.length;
  selectAll.indeterminate = selectedRows.size > 0 && selectedRows.size < tableData.rows.length;
  selectAll.addEventListener('change', () => {
    selectedRows.clear();
    if (selectAll.checked) {
      tableData.rows.forEach((_, index) => {
        selectedRows.add(index);
      });
    }
    renderTable();
  });
  selectHead.appendChild(selectAll);
  headRow.appendChild(selectHead);

  tableData.columns.forEach((columnName) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = columnName;
    headRow.appendChild(th);
  });

  const actionsHead = document.createElement('th');
  actionsHead.scope = 'col';
  actionsHead.className = 'row-actions';
  actionsHead.textContent = translation.actions;
  headRow.appendChild(actionsHead);
  tableHead.appendChild(headRow);

  tableData.rows.forEach((row, rowIndex) => {
    const normalizedRow = normalizeRowLength(row);
    const tr = document.createElement('tr');

    const selectCell = document.createElement('td');
    const rowSelect = document.createElement('input');
    rowSelect.type = 'checkbox';
    rowSelect.className = 'form-check-input';
    rowSelect.checked = selectedRows.has(rowIndex);
    rowSelect.addEventListener('change', () => {
      if (rowSelect.checked) {
        selectedRows.add(rowIndex);
      } else {
        selectedRows.delete(rowIndex);
      }
      updateSelectionUi();
      const headCheckbox = tableHead.querySelector('input[type="checkbox"]');
      if (headCheckbox) {
        headCheckbox.checked = tableData.rows.length > 0 && selectedRows.size === tableData.rows.length;
        headCheckbox.indeterminate = selectedRows.size > 0 && selectedRows.size < tableData.rows.length;
      }
    });
    selectCell.appendChild(rowSelect);
    tr.appendChild(selectCell);

    normalizedRow.forEach((cellValue) => {
      const td = document.createElement('td');
      td.textContent = cellValue;
      tr.appendChild(td);
    });

    const actionsCell = document.createElement('td');
    actionsCell.className = 'row-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-sm btn-outline-primary me-1';
    editButton.textContent = translation.edit;
    editButton.addEventListener('click', () => {
      openRowModal('edit', rowIndex);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-sm btn-outline-danger';
    deleteButton.textContent = translation.del;
    deleteButton.addEventListener('click', () => {
      deleteRow(rowIndex);
    });

    actionsCell.append(editButton, deleteButton);
    tr.appendChild(actionsCell);
    tableBody.appendChild(tr);
  });

  updateSelectionUi();
}

addRowButton.addEventListener('click', () => {
  openRowModal('create');
});

addColumnButton.addEventListener('click', addColumn);

saveTableButton.addEventListener('click', () => {
  saveTableData();
  setStatus(t().statusSaved);
});

deleteSelectedButton.addEventListener('click', deleteSelectedRows);
duplicateSelectedButton.addEventListener('click', duplicateSelectedRows);
clearSelectionButton.addEventListener('click', () => clearSelection(true));

runExportButton.addEventListener('click', () => {
  const format = exportFormatSelect.value;
  if (format === 'csv') {
    exportCsv();
    return;
  }
  if (format === 'excel') {
    exportExcel();
    return;
  }
  exportXml();
});

runImportButton.addEventListener('click', () => {
  const format = importFormatSelect.value;
  if (format === 'csv') {
    openImportPicker('csv', '.csv,text/csv');
    return;
  }
  if (format === 'excel') {
    openImportPicker('excel', '.xls,.xlsx,text/html,application/vnd.ms-excel');
    return;
  }
  openImportPicker('xml', '.xml,text/xml,application/xml');
});

importFileInput.addEventListener('change', async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file || !pendingImportType) {
    return;
  }

  try {
    const text = await file.text();
    handleImportResult(pendingImportType, text);
  } catch {
    setStatus(t().statusImportError);
  } finally {
    pendingImportType = null;
    importFileInput.value = '';
  }
});

resetTableButton.addEventListener('click', () => {
  if (!confirm(t().confirmReset)) {
    return;
  }

  tableData = getDefaultTableData();
  selectedRows.clear();
  saveTableData();
  renderTable();
  setStatus(t().statusReset);
});

rowCancelButton.addEventListener('click', closeRowModal);

rowModal.addEventListener('click', (event) => {
  if (event.target === rowModal) {
    closeRowModal();
  }
});

rowForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!confirm(t().confirmSave)) {
    return;
  }

  const values = collectRowFormValues();
  if (modalMode === 'create') {
    tableData.rows.push(values);
    setStatus(t().statusAddedRow);
  } else if (editingRowIndex !== null) {
    tableData.rows[editingRowIndex] = values;
    setStatus(t().statusUpdatedRow);
  }

  selectedRows.clear();
  renderTable();
  closeRowModal();
});

currentLanguage = getLanguageFromSettings();
applyLanguage();

const savedTableData = sessionStorage.getItem(STORAGE_KEY);
if (savedTableData) {
  try {
    const parsedData = JSON.parse(savedTableData);
    if (Array.isArray(parsedData.columns) && Array.isArray(parsedData.rows)) {
      tableData = {
        columns: [...parsedData.columns],
        rows: parsedData.rows.map((row) => (Array.isArray(row) ? row : [])),
      };
    }
  } catch {
    tableData = getDefaultTableData();
  }
}

renderTable();
setStatus(t().statusInitial);
