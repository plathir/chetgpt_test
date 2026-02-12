# Application Hub (HTML/CSS/JavaScript)

Κεντρική web σελίδα (hub) που φορτώνει μικρές εφαρμογές από τον φάκελο `apps/`.

## Περιεχόμενα
- [Επισκόπηση](#επισκόπηση)
- [Δομή Project](#δομή-project)
- [Εφαρμογές](#εφαρμογές)
- [Εκκίνηση Τοπικά](#εκκίνηση-τοπικά)
- [Οδηγίες Χρήσης](#οδηγίες-χρήσης)
- [Troubleshooting](#troubleshooting)

## Επισκόπηση
Το project αποτελείται από:
- `index.html` στο root: κεντρική οθόνη (hub) με side panel.
- `apps/todolist`: εφαρμογή Todo List.
- `apps/cropimage`: εφαρμογή Crop Image.

Οι εφαρμογές φορτώνονται μέσα στο hub από το αριστερό menu.

## Δομή Project

```text
.
├── index.html          # Κεντρική οθόνη hub
├── app.js              # Logic του hub (φόρτωση εφαρμογών)
├── style.css           # Styles του hub
├── README.md
└── apps
    ├── todolist
    │   ├── index.html
    │   ├── app.js
    │   └── style.css
    └── cropimage
        ├── index.html
        ├── app.js
        └── style.css
```

## Εφαρμογές

### 1) ToDo List (`apps/todolist`)
Δυνατότητες:
- Προσθήκη εργασιών.
- Ολοκλήρωση / αναίρεση εργασίας.
- Επεξεργασία εργασίας.
- Διαγραφή εργασίας.
- Καθαρισμός ολοκληρωμένων.
- Αποθήκευση στο `sessionStorage`.

### 2) Crop Image (`apps/cropimage`)
Δυνατότητες:
- Επιλογή εικόνας από τοπικό αρχείο.
- Επιλογή περιοχής crop με drag πάνω σε canvas.
- Crop της επιλεγμένης περιοχής.
- Reset στην αρχική εικόνα.
- Download του αποτελέσματος ως PNG.

## Εκκίνηση Τοπικά

1. Άνοιξε terminal στον φάκελο του project.
2. Τρέξε έναν static server (παράδειγμα με Python):

```bash
python -m http.server 4173
```

3. Άνοιξε στον browser:

- `http://localhost:4173/index.html`

## Οδηγίες Χρήσης

1. Στην κεντρική οθόνη, επέλεξε εφαρμογή από το side panel.
2. Το hub φορτώνει την εφαρμογή από το `apps/<app-name>/index.html`.
3. Για προσθήκη νέας εφαρμογής:

- Δημιούργησε φάκελο στο `apps/<new-app>` με `index.html`, `app.js`, `style.css`.
- Πρόσθεσε νέο κουμπί στο root `index.html`.
- Πρόσθεσε handler στο root `app.js` με `openApp('<Όνομα>', 'apps/<new-app>/index.html')`.

## Troubleshooting

### Δεν φορτώνει η εφαρμογή μέσα στο hub
- Έλεγξε ότι το path είναι σωστό στο root `app.js`.
- Έλεγξε ότι υπάρχει το `apps/<app>/index.html`.

### Δεν λειτουργεί η επιλογή εικόνας στο Crop Image
- Χρησιμοποίησε σύγχρονο browser (Chrome/Edge/Firefox).
- Τρέξε το project από local server (όχι με απλό άνοιγμα αρχείου με `file://`).

### Δεν αποθηκεύονται τα todos
- Η αποθήκευση γίνεται σε `sessionStorage` και είναι ανά tab/session.
- Μην χρησιμοποιείς mode που μπλοκάρει storage (π.χ. ορισμένα private modes/extensions).
